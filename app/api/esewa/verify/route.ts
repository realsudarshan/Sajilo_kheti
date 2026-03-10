// FRONTEND: app/api/esewa/verify/route.ts

import { auth }                      from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { verifyEsewaCallback }       from '@/lib/esewa.utils';
import { StreamChat }                from 'stream-chat';

const BACKEND_URL     = process.env.BACKEND_URL ?? 'http://localhost:8000';
const COMMISSION_RATE = 0.05;

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
    };
    const { encodedData, applicationId } = body;

    if (!encodedData || !applicationId) {
      return NextResponse.json(
        { error: 'encodedData and applicationId are required' },
        { status: 400 }
      );
    }

    // 3. Verify eSewa HMAC signature
    const { valid, decoded } = verifyEsewaCallback(encodedData);
    if (!valid || !decoded) {
      return NextResponse.json({ error: 'Invalid eSewa signature.' }, { status: 400 });
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

    const amount     = parseFloat(decoded.total_amount);
    const commission = amount * COMMISSION_RATE;

    // 6. Record escrow in DB via backend REST
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

    const escrow   = backendJson?.escrow ?? null;
    const ownerId  = escrow?.ownerId  ?? backendJson?.ownerId;
    const leaserId = escrow?.leaserId ?? userId;

    console.log('[esewa/verify] ownerId:', ownerId, '| leaserId:', leaserId);

    // 7. Create Stream Chat channel
    const channelId   = `lease-${applicationId}`;
    let chatChannelId = channelId;

    try {
      if (!ownerId || !leaserId) {
        throw new Error(`Missing user IDs — ownerId: ${ownerId}, leaserId: ${leaserId}`);
      }

      // Upsert both users as admin — bypasses all Stream permission checks
      await streamServer.upsertUsers([
        { id: ownerId,  name: 'Land Owner', role: 'admin' } as any,
        { id: leaserId, name: 'Leaser',     role: 'admin' } as any,
      ]);

      // Create channel with both as members
      const channel = streamServer.channel('messaging', channelId, {
        created_by_id: leaserId,
        members:       [ownerId, leaserId],
      } as any);

      await channel.create();

      console.log('[esewa/verify] Channel created:', channelId);

      // Send welcome message
      await channel.sendMessage({
        text:    '🎉 Escrow payment confirmed! You can now discuss the lease agreement and arrange to visit the Malpot Karyalaya together.',
        user_id: leaserId,
      });

      chatChannelId = channelId;
    } catch (streamErr: any) {
      console.error('[esewa/verify] Stream error:', streamErr?.message, '| code:', streamErr?.code);
    }

    // 8. Save chatChannelId to Escrow record in DB
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
      message:         'Payment verified, escrow recorded, chat channel created.',
    });

  } catch (err: any) {
    console.error('[esewa/verify] Unhandled error:', err);
    return NextResponse.json({ error: err?.message ?? 'Internal server error' }, { status: 500 });
  }
}