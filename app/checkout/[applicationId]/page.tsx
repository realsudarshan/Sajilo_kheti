// FRONTEND: app/checkout/[applicationId]/page.tsx
'use client';

import { useParams, useRouter }     from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Loader2, ShieldCheck, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { Button }  from '@/components/ui/button';
import { Badge }   from '@/components/ui/badge';
import { useGetMyAcceptedApplications } from '@/queryandmutation/index';

interface EsewaFormFields {
  amount:                  number;
  tax_amount:              number;
  total_amount:            number;
  transaction_uuid:        string;
  product_code:            string;
  product_service_charge:  number;
  product_delivery_charge: number;
  success_url:             string;
  failure_url:             string;
  signed_field_names:      string;
  signature:               string;
}

export default function CheckoutPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const router            = useRouter();

  const { data, isLoading } = useGetMyAcceptedApplications();
  const application = data?.applications.find((a) => a.id === applicationId);

  const [fields,    setFields]    = useState<EsewaFormFields | null>(null);
  const [esewaUrl,  setEsewaUrl]  = useState('');
  const [preparing, setPreparing] = useState(false);
  const [error,     setError]     = useState('');

  const formRef = useRef<HTMLFormElement>(null);

  const preparePayment = async () => {
    if (!application) return;
    setPreparing(true);
    setError('');

    try {
      const totalAmount = application.proposedMonthlyRent * application.leaseDurationInMonths;
      const res = await fetch(
        `/api/esewa/initiate?applicationId=${applicationId}&amount=${totalAmount}`
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? 'Failed to prepare payment');
      }
      const json = await res.json();
      setEsewaUrl(json.esewaUrl);
      setFields(json.fields);
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong');
    } finally {
      setPreparing(false);
    }
  };

  // Auto-submit form once fields are ready
  useEffect(() => {
    if (fields && formRef.current) {
      formRef.current.submit();
    }
  }, [fields]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <h2 className="text-xl font-bold">Application not found</h2>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const totalAmount = application.proposedMonthlyRent * application.leaseDurationInMonths;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">

        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-900">Complete Your Payment</h1>
          <p className="text-sm text-slate-500 mt-1">Funds are held in escrow until the lease is verified.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Land image */}
          <div className="relative h-44 w-full">
            <img src={application.land.heroImageUrl} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <Badge className="bg-emerald-500 mb-1">Accepted</Badge>
              <h2 className="text-lg font-bold">{application.land.title}</h2>
            </div>
          </div>

          <div className="p-6 space-y-5">

            {/* Info */}
            <div className="flex flex-col gap-2 text-sm text-slate-500">
              <span className="flex items-center gap-2"><MapPin size={14} className="text-emerald-500" />{application.land.location}</span>
              <span className="flex items-center gap-2"><Calendar size={14} className="text-blue-500" />{application.leaseDurationInMonths} month lease</span>
            </div>

            {/* Amount breakdown */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Monthly Rent</span>
                <span className="font-semibold">{application.proposedMonthlyRent.toLocaleString()} NPR</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Duration</span>
                <span className="font-semibold">× {application.leaseDurationInMonths} months</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between">
                <span className="font-black text-slate-900">Total Escrow</span>
                <span className="font-black text-lg text-emerald-600">{totalAmount.toLocaleString()} NPR</span>
              </div>
            </div>

            {/* Security note */}
            <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-3 border border-blue-100">
              <ShieldCheck className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed">
                Funds are held securely in escrow. Released to the landowner only after both parties sign the Malpot agreement.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Pay button */}
            <Button
              onClick={preparePayment}
              disabled={preparing || !!fields}
              className="w-full h-14 rounded-2xl bg-[#60BB46] hover:bg-[#4da336] text-white font-bold text-base shadow-lg"
            >
              {preparing || fields ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Redirecting to eSewa...</>
              ) : (
                <>Pay {totalAmount.toLocaleString()} NPR via eSewa</>
              )}
            </Button>

            <button
              type="button"
              onClick={() => router.back()}
              className="w-full text-sm text-slate-400 hover:text-slate-600"
            >
              ← Go back
            </button>
          </div>
        </div>
      </div>

      {/* Hidden form — auto-submitted once fields are set */}
      {fields && (
        <form ref={formRef} method="POST" action={esewaUrl} className="hidden">
          <input type="hidden" name="amount"                  value={fields.amount} />
          <input type="hidden" name="tax_amount"              value={fields.tax_amount} />
          <input type="hidden" name="total_amount"            value={fields.total_amount} />
          <input type="hidden" name="transaction_uuid"        value={fields.transaction_uuid} />
          <input type="hidden" name="product_code"            value={fields.product_code} />
          <input type="hidden" name="product_service_charge"  value={fields.product_service_charge} />
          <input type="hidden" name="product_delivery_charge" value={fields.product_delivery_charge} />
          <input type="hidden" name="success_url"             value={fields.success_url} />
          <input type="hidden" name="failure_url"             value={fields.failure_url} />
          <input type="hidden" name="signed_field_names"      value={fields.signed_field_names} />
          <input type="hidden" name="signature"               value={fields.signature} />
        </form>
      )}
    </div>
  );
}