import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const data = formData.get('data') as string;
  const status = formData.get('status') as string;

  // If there is data, it's a success callback
  if (data) {
    const redirectUrl = new URL('/checkout/esewa-success', req.url);
    redirectUrl.searchParams.set('data', data);
    return NextResponse.redirect(redirectUrl.toString(), { status: 303 });
  }

  // Otherwise, it's a failure
  const failureUrl = new URL('/checkout/esewa-failure', req.url);
  if (status) failureUrl.searchParams.set('reason', status);
  return NextResponse.redirect(failureUrl.toString(), { status: 303 });
}