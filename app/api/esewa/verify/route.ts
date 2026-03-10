// FRONTEND: app/api/esewa/verify/route.ts
//
// Uses the REST endpoint your backend already exposes via trpc-to-openapi:
//   POST /api/lease/pay-escrow
// This is simpler and more reliable than the tRPC batch format.

import { auth }                      from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { verifyEsewaCallback }       from '@/lib/esewa.utils';

const BACKEND_URL     = process.env.BACKEND_URL ?? 'http://localhost:8000';
const COMMISSION_RATE = 0.05;

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
    console.log('[esewa/verify] Signature valid:', valid, '| status:', decoded?.status);

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
    // Our uuid format: {applicationId}-{timestamp}
    const uuidAppId = decoded.transaction_uuid.split('-').slice(0, -1).join('-');
    if (uuidAppId !== applicationId) {
      return NextResponse.json(
        { error: 'Transaction does not match application.' },
        { status: 400 }
      );
    }

    // 5. Get Clerk token for server-to-server auth
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ error: 'Could not get auth token.' }, { status: 401 });
    }

    // 6. Parse amount — eSewa sends total_amount as string e.g. "2000.0"
    const amount     = parseFloat(decoded.total_amount);
    const commission = amount * COMMISSION_RATE;

    // 7. Call the REST endpoint (trpc-to-openapi) — plain JSON, no tRPC batch format
    //    Your backend exposes this at: POST /api/lease/pay-escrow
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
    console.log('[esewa/verify] Backend status:', backendRes.status);
    console.log('[esewa/verify] Backend response:', JSON.stringify(backendJson)?.slice(0, 300));

    if (!backendRes.ok) {
      const errMsg: string =
        backendJson?.message ??
        backendJson?.error?.message ??
        'Unknown error';

      // Idempotency — already paid
      if (errMsg.toLowerCase().includes('already exists')) {
        return NextResponse.json({
          success:         true,
          alreadyRecorded: true,
          transactionCode: decoded.transaction_code,
          amount,
          applicationId,
          message: 'Escrow already recorded.',
        });
      }

      console.error('[esewa/verify] Backend error:', errMsg);
      return NextResponse.json({ error: errMsg }, { status: 502 });
    }

    return NextResponse.json({
      success:         true,
      transactionCode: decoded.transaction_code,
      amount,
      applicationId,
      escrow:  backendJson?.escrow  ?? null,
      message: backendJson?.message ?? 'Payment verified and escrow recorded.',
    });

  } catch (err: any) {
    console.error('[esewa/verify] Unhandled error:', err);
    return NextResponse.json({ error: err?.message ?? 'Internal server error' }, { status: 500 });
  }
}