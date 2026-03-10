// FRONTEND: app/checkout/esewa-success/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { CheckCircle2, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

function EsewaSuccessContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const encodedData  = searchParams.get('data') ?? '';

  const [status,          setStatus]          = useState<'verifying' | 'success' | 'error'>('verifying');
  const [transactionCode, setTransactionCode] = useState('');
  const [amount,          setAmount]          = useState(0);
  const [errorMsg,        setErrorMsg]        = useState('');

  useEffect(() => {
    if (!encodedData) {
      setStatus('error');
      setErrorMsg('No payment data received from eSewa.');
      return;
    }

    // Decode base64 client-side using atob() — Buffer is Node.js only
    let applicationId = '';
    try {
      const decoded = JSON.parse(atob(encodedData));
      // transactionUuid format: {applicationId}-{timestamp}
      applicationId = decoded.transaction_uuid.split('-').slice(0, -1).join('-');
    } catch {
      setStatus('error');
      setErrorMsg('Could not parse payment data.');
      return;
    }

    fetch('/api/esewa/verify', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ encodedData, applicationId }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setTransactionCode(json.transactionCode);
          setAmount(json.escrow?.amount ?? json.amount ?? 0);
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMsg(json.error ?? 'Verification failed.');
        }
      })
      .catch(() => {
        setStatus('error');
        setErrorMsg('Network error during verification.');
      });
  }, [encodedData]);

  if (status === 'verifying') {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-blue-50">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Verifying your payment…</h2>
        <p className="text-sm text-slate-500">Please do not close this page.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Verification Failed</h2>
        <p className="text-sm text-red-500">{errorMsg}</p>
        <p className="text-xs text-slate-400">
          If money was deducted, contact support with your eSewa transaction details.
        </p>
        <Button variant="outline" onClick={() => router.push('/dashboard/my-lands')}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle2 className="h-14 w-14 text-emerald-500" />
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-900">Payment Successful!</h2>
        <p className="text-sm text-slate-500 mt-1">Your escrow payment is securely held.</p>
      </div>

      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 text-left space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 font-medium">Transaction Code</span>
          <span className="font-mono font-bold text-slate-800">{transactionCode}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 font-medium">Amount Paid</span>
          <span className="font-bold text-emerald-600">{Number(amount).toLocaleString()} NPR</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 font-medium">Escrow Status</span>
          <span className="font-bold text-blue-600">HOLDING</span>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-left">
        <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">What happens next?</p>
        <p className="text-sm text-blue-700">
          Visit the <strong>Malpot Karyalaya</strong> with the landowner to sign the official lease agreement.
          Once our admin verifies the signed papers, funds will be released to the landowner.
        </p>
      </div>

      <Button
        onClick={() => router.push('/dashboard')}
        className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-bold gap-2"
      >
        Go to Dashboard <ArrowRight size={16} />
      </Button>
    </div>
  );
}

export default function EsewaSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
        <Suspense fallback={
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto" />
          </div>
        }>
          <EsewaSuccessContent />
        </Suspense>
      </div>
    </div>
  );
}