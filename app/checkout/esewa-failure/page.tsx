// FRONTEND: app/checkout/esewa-failure/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

function FailureContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const reason       = searchParams.get('reason') ?? '';

  return (
    <div className="text-center space-y-6">
      <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-red-50">
        <XCircle className="h-14 w-14 text-red-400" />
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-900">Payment Failed</h2>
        <p className="text-sm text-slate-500 mt-2">
          Your payment was not completed. No amount has been charged.
        </p>
        {reason && (
          <p className="text-xs text-red-400 mt-1 font-mono bg-red-50 px-3 py-1 rounded-lg inline-block">
            {reason}
          </p>
        )}
      </div>

      <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-left">
        <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">Common reasons</p>
        <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
          <li>Insufficient eSewa balance</li>
          <li>Payment session timed out</li>
          <li>Transaction cancelled by user</li>
          <li>Invalid eSewa credentials</li>
        </ul>
      </div>

      {/* Sandbox test credentials — remove in production */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-left">
        <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">Sandbox Test Credentials</p>
        <div className="text-sm text-blue-700 font-mono space-y-1">
          <p>ID: <strong>9806800001</strong></p>
          <p>Password: <strong>Nepal@123</strong></p>
          <p>OTP: <strong>123456</strong></p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          onClick={() => router.back()}
          className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-bold gap-2"
        >
          <ArrowLeft size={16} /> Try Again
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
          className="w-full h-12 rounded-2xl"
        >
          Go to Dashboard
        </Button>
      </div>

      <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
        <LifeBuoy size={12} /> Need help? Contact support@sajilokhet.com
      </p>
    </div>
  );
}

export default function EsewaFailurePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
        <Suspense fallback={<div className="h-40" />}>
          <FailureContent />
        </Suspense>
      </div>
    </div>
  );
}