// dashboard/lands/[id]/send-application/page.tsx
"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useGetLandById, useSubmitLeaseApplication } from "@/queryandmutation"
import { ArrowLeft, Calendar, DollarSign, FileText, Send, Loader2 } from "lucide-react"
import { Button }   from "@/components/ui/button"
import { Input }    from "@/components/ui/input"
import { Label }    from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { toast }    from "sonner"
import { cn }       from "@/lib/utils"

export default function SendApplicationPage() {
  const { id } = useParams() as { id: string }
  const router  = useRouter()

  const { data: land, isLoading: loadingLand } = useGetLandById(id)
  const { mutate: submitApp, isPending }        = useSubmitLeaseApplication()

  const [duration,    setDuration]    = useState("")
  const [rent,        setRent]        = useState("")
  const [plans,       setPlans]       = useState("")
  const [extraMsg,    setExtraMsg]    = useState("")

  const isValid = duration && +duration > 0 && rent && +rent > 0 && plans.trim().length >= 20

  function handleSubmit() {
    if (!isValid) return
    submitApp(
      {
        landId:                id,
        leaseDurationInMonths: +duration,
        proposedMonthlyRent:   +rent,
        plans:                 plans.trim(),
        additionalMessages:    extraMsg.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Application submitted successfully!")
          router.push("/dashboard/my-leases")
        },
        onError: (e) => toast.error(e.message ?? "Something went wrong"),
      }
    )
  }

  if (loadingLand) return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      <Skeleton className="h-6 w-1/3 rounded-xl" />
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-12 rounded-xl" />
    </div>
  )

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Back */}
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 text-stone-500 rounded-xl">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        {/* Heading */}
        <div>
          <h1 className="text-2xl font-black text-stone-900">Apply to Lease</h1>
          {land && (
            <p className="text-stone-500 text-sm mt-1">
              Submitting application for <span className="font-semibold text-stone-700">{land.title}</span>
            </p>
          )}
        </div>

        {/* Land preview strip */}
        {land && (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 flex gap-4 items-center">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0">
              {land.heroImageUrl && <img src={land.heroImageUrl} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-stone-800 truncate">{land.title}</p>
              <p className="text-xs text-stone-400 truncate">{land.location}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-black text-emerald-700 text-sm">₨{land.pricePerMonth?.toLocaleString()}</p>
              <p className="text-xs text-stone-400">listed/mo</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-5">

          {/* Duration + Rent row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Lease Duration (months)
              </Label>
              <Input
                type="number"
                min={1}
                placeholder="e.g. 12"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="h-11 rounded-xl border-stone-200 focus-visible:ring-emerald-400"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> Proposed Monthly Rent (NPR)
              </Label>
              <Input
                type="number"
                min={1}
                placeholder="e.g. 8000"
                value={rent}
                onChange={e => setRent(e.target.value)}
                className="h-11 rounded-xl border-stone-200 focus-visible:ring-emerald-400"
              />
            </div>
          </div>

          {/* Plans */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Farming Plans <span className="text-stone-400 font-normal">(min. 20 chars)</span>
            </Label>
            <Textarea
              rows={4}
              placeholder="Describe what you plan to grow or do with this land..."
              value={plans}
              onChange={e => setPlans(e.target.value)}
              className="rounded-xl border-stone-200 focus-visible:ring-emerald-400 resize-none text-sm"
            />
            <p className={cn("text-right text-[11px]", plans.length >= 20 ? "text-emerald-500" : "text-stone-300")}>
              {plans.length} / 20+
            </p>
          </div>

          {/* Additional */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-stone-600">Additional Message <span className="text-stone-400 font-normal">(optional)</span></Label>
            <Textarea
              rows={2}
              placeholder="Any extra context for the landowner..."
              value={extraMsg}
              onChange={e => setExtraMsg(e.target.value)}
              className="rounded-xl border-stone-200 focus-visible:ring-emerald-400 resize-none text-sm"
            />
          </div>
        </div>

        {/* Summary */}
        {duration && rent && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4 space-y-1.5">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Application Summary</p>
            <div className="flex justify-between text-sm text-emerald-800">
              <span>Duration</span><span className="font-bold">{duration} months</span>
            </div>
            <div className="flex justify-between text-sm text-emerald-800">
              <span>Proposed rent</span><span className="font-bold">₨{(+rent).toLocaleString()}/mo</span>
            </div>
            <div className="flex justify-between text-sm text-emerald-800 border-t border-emerald-200 pt-1.5 mt-1.5">
              <span>Total lease value</span>
              <span className="font-black">₨{((+rent) * (+duration)).toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={!isValid || isPending}
          className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base gap-2 shadow-md shadow-emerald-100"
        >
          {isPending
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
            : <><Send className="w-4 h-4" /> Submit Application</>
          }
        </Button>
        <p className="text-center text-xs text-stone-400">
          By submitting you agree to SajiloKheti's{" "}
          <a href="/terms" className="underline hover:text-stone-600">Terms & Conditions</a>
        </p>
      </div>
    </div>
  )
}