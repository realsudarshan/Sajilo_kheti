// FILE: app/api/esewa/verify/route.ts
import { auth }                      from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { verifyEsewaCallback }       from '@/lib/esewa.utils';
import { StreamChat }                from 'stream-chat';

const BACKEND_URL     = process.env.BACKEND_URL ?? 'http://localhost:8000';
const COMMISSION_RATE = 0.05;
const IS_DEV          = process.env.NODE_ENV === 'development';

const streamServer = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

export async function POST(req: NextRequest) {
  try {
    // 1. Auth
    const { userId, getToken } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse body
    const body = await req.clone().json() as {
      encodedData:   string;
      applicationId: string;
      mock?:         boolean;
    };
    const { encodedData, applicationId, mock } = body;

    if (!encodedData || !applicationId) {
      return NextResponse.json(
        { error: 'encodedData and applicationId are required' },
        { status: 400 }
      );
    }

    // 3. Verify eSewa HMAC — skipped in dev when mock=true
    let decoded: any;

    if (IS_DEV && mock) {
      try {
        decoded = JSON.parse(atob(encodedData));
        decoded.status = 'COMPLETE';
      } catch {
        return NextResponse.json({ error: 'Could not parse mock payload.' }, { status: 400 });
      }
      console.warn('[esewa/verify] ⚠️  DEV MOCK — skipping HMAC signature check');
    } else {
      const result = verifyEsewaCallback(encodedData);
      if (!result.valid || !result.decoded) {
        return NextResponse.json({ error: 'Invalid eSewa signature.' }, { status: 400 });
      }
      decoded = result.decoded;
    }

    if (decoded.status !== 'COMPLETE') {
      return NextResponse.json(
        { error: `Payment not complete. Status: ${decoded.status}` },
        { status: 400 }
      );
    }

    // 4. Confirm transaction belongs to this application
    const uuidAppId = decoded.transaction_uuid.split('-').slice(0, -1).join('-');
    if (uuidAppId !== applicationId) {
      return NextResponse.json(
        { error: 'Transaction does not match application.' },
        { status: 400 }
      );
    }

    // 5. Get Clerk token
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ error: 'Could not get auth token.' }, { status: 401 });
    }

    // ─── 6. Fetch application FIRST to reliably get ownerId ───────────────────
    // The pay-escrow response doesn't always include ownerId, so we resolve it
    // here from the application's land record before doing anything else.
    let ownerId: string | null = null;

    try {
      // Use the REST wrapper path that actually exists on the Express backend:
      // GET /api/lease/application/{applicationId}
      const appRes = await fetch(
        `${BACKEND_URL}/api/lease/application/${applicationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (appRes.ok) {
        const appJson = await appRes.json();
        // tRPC REST wrapper: result is either { result: { data: ... } } or the object directly
        const appData = appJson?.result?.data ?? appJson;
        ownerId = appData?.land?.ownerId ?? appData?.ownerId ?? null;
        console.log('[esewa/verify] Resolved ownerId from application:', ownerId);
      } else {
        console.warn('[esewa/verify] Could not fetch application — will fall back to escrow response');
      }
    } catch (appFetchErr) {
      console.warn('[esewa/verify] Application pre-fetch failed:', appFetchErr);
    }

    // ─── 7. Record escrow in DB ────────────────────────────────────────────────
    const amount     = IS_DEV && mock ? 1000 : parseFloat(decoded.total_amount);
    const commission = amount * COMMISSION_RATE;

    const backendRes = await fetch(`${BACKEND_URL}/api/lease/pay-escrow`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        applicationId,
        amount,
        paymentId:  decoded.transaction_code,
        commission,
      }),
    });

    const backendJson = await backendRes.json().catch(() => null);
    console.log('[esewa/verify] pay-escrow response:', backendRes);
    

    if (!backendRes.ok) {
      const errMsg: string =
        backendJson?.message ??
        backendJson?.error?.message ??
        'Unknown error';

      if (!errMsg.toLowerCase().includes('already exists')) {
        console.error('[esewa/verify] Backend error:', errMsg);
        return NextResponse.json({ error: errMsg }, { status: 502 });
      }
    }

    const escrow = backendJson?.escrow ?? null;

    // Resolve ownerId — priority: pre-fetched > escrow response > backendJson root
    ownerId = ownerId
      ?? escrow?.ownerId
      ?? backendJson?.ownerId
      ?? null;

    // leaserId is always the authenticated user making the payment
    const leaserId = userId;

    console.log('[esewa/verify] Final IDs — ownerId:', ownerId, '| leaserId:', leaserId);

    // ─── 8. Create Stream Chat channel ────────────────────────────────────────
    const channelId   = `lease-${applicationId}`;
    let chatChannelId = channelId;

    try {
      if (!ownerId) {
        throw new Error('ownerId could not be resolved — cannot create chat channel');
      }

      // IMPORTANT: Stream user IDs must match the IDs used by /api/chat/token.
      // That route prefixes Clerk IDs with "sk_" to avoid conflicts and deletions,
      // so we mirror the exact same convention here.
      const streamOwnerId  = `sk_${ownerId}`;
      const streamLeaserId = `sk_${leaserId}`;

      await streamServer.upsertUsers([
        { id: streamOwnerId,  name: 'Land Owner', role: 'admin' } as any,
        { id: streamLeaserId, name: 'Leaser',     role: 'admin' } as any,
      ]);

      const channel = streamServer.channel('messaging', channelId, {
        created_by_id: streamLeaserId,
        members:       [streamOwnerId, streamLeaserId],
      } as any);

      await channel.create();

      await channel.sendMessage({
        text: IS_DEV && mock
          ? '🧪 Dev mock payment confirmed! Chat channel is active for testing.'
          : '🎉 Escrow payment confirmed! You can now discuss the lease agreement and arrange to visit the Malpot Karyalaya together.',
        user_id: streamLeaserId,
      });

      console.log('[esewa/verify] Stream channel created:', channelId);
    } catch (streamErr: any) {
      console.error('[esewa/verify] Stream error:', streamErr?.message, '| code:', streamErr?.code);
    }

    // ─── 9. Save chatChannelId to Escrow record ────────────────────────────────
    try {
      await fetch(`${BACKEND_URL}/api/escrow/save-chat-channel`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ applicationId, chatChannelId }),
      });
    } catch (saveErr) {
      console.error('[esewa/verify] Failed to save chatChannelId:', saveErr);
    }

    return NextResponse.json({
      success:         true,
      transactionCode: decoded.transaction_code,
      amount,
      applicationId,
      chatChannelId,
      escrow:          escrow ?? null,
      message:         IS_DEV && mock
        ? 'Mock payment verified, escrow recorded, chat channel created.'
        : 'Payment verified, escrow recorded, chat channel created.',
    });

  } catch (err: any) {
    console.error('[esewa/verify] Unhandled error:', err);
    return NextResponse.json({ error: err?.message ?? 'Internal server error' }, { status: 500 });
  }
}