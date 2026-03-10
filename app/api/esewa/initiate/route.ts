// FRONTEND: app/api/esewa/initiate/route.ts

import { auth }              from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { buildEsewaFormFields, ESEWA_CONFIG } from '@/lib/esewa.utils';

// ↑ Adjust this path to point to your backend folder.
//   If your repos are siblings:  ../../backend/src/server/services/escrow.service
//   If monorepo:                 @backend/server/services/escrow.service

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const applicationId    = searchParams.get('applicationId');

    if (!applicationId) {
      return NextResponse.json({ error: 'applicationId is required' }, { status: 400 });
    }

    // Build unique transaction UUID: {applicationId}-{timestamp}
    // We recover applicationId from this on the success callback
    const transactionUuid = `${applicationId}-${Date.now()}`;

    const appUrl     = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const successUrl = `${appUrl}/checkout/esewa-success`;
    const failureUrl = `${appUrl}/checkout/esewa-failure`;

    const fields = buildEsewaFormFields({
      // Amount is calculated in the checkout page and passed as query param
      amount: Number(searchParams.get('amount') ?? 0),
      transactionUuid,
      successUrl,
      failureUrl,
    });

    return NextResponse.json({
      esewaUrl: `${ESEWA_CONFIG.baseUrl}/api/epay/main/v2/form`,
      fields,
    });
  } catch (err) {
    console.error('[esewa/initiate]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}