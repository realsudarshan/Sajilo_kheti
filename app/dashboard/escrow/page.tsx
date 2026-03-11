// dashboard/escrow/page.tsx
"use client"

import Link from "next/link"
import { useGetMyEscrows } from "@/queryandmutation"
import {
  ShieldCheck, Upload, CheckCircle2, Clock,
  ArrowRight, AlertTriangle, MapPin, Info
} from "lucide-react"
import { Button }   from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// ─── helpers ─────────────────────────────────────────────────────────────────

function fmtNPR(n: number) {
  return `₨ ${n.toLocaleString("en-NP")}`
}

const ESCROW_STATUS: Record<string, { label: string; color: string; bg: string }> = {
  HOLDING:  { label: "In Escrow",  color: "text-violet-700", bg: "bg-violet-50" },
  RELEASED: { label: "Released",   color: "text-emerald-700",bg: "bg-emerald-50" },
  REFUNDED: { label: "Refunded",   color: "text-amber-700",  bg: "bg-amber-50"  },
}

function MalpotStep({ done, label, icon }: { done: boolean; label: string; icon: React.ReactNode }) {
  return (
    <div className={cn(
      "flex flex-col items-center gap-1.5 flex-1 px-2 py-3 rounded-xl text-center",
      done ? "bg-emerald-50" : "bg-stone-50"
    )}>
      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", done ? "bg-emerald-500" : "bg-stone-200")}>
        {done
          ? <CheckCircle2 className="w-4 h-4 text-white" />
          : <Clock className="w-4 h-4 text-stone-400" />
        }
      </div>
      <span className="text-[10px] leading-tight font-bold">{label}</span>
      <span className={cn("text-[10px] font-semibold", done ? "text-emerald-600" : "text-stone-400")}>
        {done ? "Done" : "Pending"}
      </span>
    </div>
  )
}

// ─── escrow card ─────────────────────────────────────────────────────────────

function EscrowCard({ escrow }: { escrow: any }) {
  const statusCfg = ESCROW_STATUS[escrow.status] ?? { label: escrow.status, color: "text-stone-600", bg: "bg-stone-50" }
  const needsUpload = escrow.status === "HOLDING" && !escrow.landleaserMalpotUrl

  return (
    <div className={cn(
      "bg-white rounded-2xl border shadow-sm p-5 space-y-4 transition-all hover:shadow-md",
      needsUpload ? "border-amber-200" : "border-stone-100"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl overflow-hidden bg-stone-100 shrink-0">
            {escrow.application?.land?.heroImageUrl
              ? <img src={escrow.application.land.heroImageUrl} alt="" className="w-full h-full object-cover" />
              : <MapPin className="w-4 h-4 text-stone-300 m-3.5" />
            }
          </div>
          <div className="min-w-0">
            <p className="font-black text-stone-900 text-sm leading-tight truncate">
              {escrow.application?.land?.title ?? "Unknown Land"}
            </p>
            <p className="text-xs text-stone-400 mt-0.5 truncate">
              {escrow.application?.land?.location}
            </p>
          </div>
        </div>
        <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0", statusCfg.color, statusCfg.bg)}>
          {statusCfg.label}
        </span>
      </div>

      {/* Amount row */}
      <div className="flex items-center justify-between bg-stone-50 rounded-xl px-4 py-3">
        <div>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Escrow Amount</p>
          <p className="text-xl font-black text-stone-900 mt-0.5">{fmtNPR(escrow.amount)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Lease</p>
          <p className="text-sm font-bold text-stone-700 mt-0.5">
            {escrow.application?.leaseDurationInMonths} months
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Monthly</p>
          <p className="text-sm font-bold text-emerald-700 mt-0.5">
            {fmtNPR(escrow.application?.proposedMonthlyRent ?? 0)}
          </p>
        </div>
      </div>

      {/* Malpot steps */}
      <div>
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Malpot Paper Progress</p>
        <div className="flex gap-2">
          <MalpotStep done={!!escrow.landleaserMalpotUrl} label="Your Submission" icon={null} />
          <MalpotStep done={!!escrow.landownerMalpotUrl}  label="Owner Submission" icon={null} />
          <MalpotStep done={escrow.status === "RELEASED"} label="Admin Verified" icon={null} />
        </div>
      </div>

      {/* CTA */}
      {needsUpload && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="text-amber-700 text-xs font-medium flex-1">Upload your signed Malpot papers to proceed.</p>
          <Link href={`/verify-agreement/${escrow.id}`}>
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold h-8 gap-1">
              <Upload className="w-3 h-3" /> Upload
            </Button>
          </Link>
        </div>
      )}

      {escrow.status === "RELEASED" && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <p className="text-emerald-700 text-xs font-medium">Escrow released — your lease is active.</p>
        </div>
      )}

      {/* Chat */}
      {escrow.chatChannelId && (
        <div className="flex justify-end">
          <Button size="sm" variant="outline" className="rounded-xl text-xs font-bold border-stone-200 gap-1">
            Open Chat <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  )
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function EscrowPage() {
  const { data, isLoading } = useGetMyEscrows()
  const escrows = data?.escrows ?? []

  const holding  = escrows.filter(e => e.status === "HOLDING")
  const released = escrows.filter(e => e.status === "RELEASED")

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Escrow & Payments</h1>
          <p className="text-stone-400 text-sm mt-1">Track your escrow transactions and Malpot submissions</p>
        </div>

        {/* Explainer */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 space-y-1">
            <p className="font-bold">How Escrow Works</p>
            <p className="text-blue-700 text-xs leading-relaxed">
              When a landowner accepts your application, you pay the first month's rent into a secure SajiloKheti escrow account.
              Funds are held until both parties submit signed Malpot papers and an admin verifies them.
              Only then are funds released to the landowner.
            </p>
          </div>
        </div>

        {/* Summary */}
        {!isLoading && escrows.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Held in Escrow", value: fmtNPR(holding.reduce((s, e) => s + e.amount, 0)), color: "text-violet-700", bg: "bg-violet-50" },
              { label: "Total Released", value: fmtNPR(released.reduce((s, e) => s + e.amount, 0)), color: "text-emerald-700", bg: "bg-emerald-50" },
              { label: "Active Escrows", value: holding.length, color: "text-stone-700", bg: "bg-stone-50" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={cn("rounded-2xl p-4 text-center", bg)}>
                <p className={cn("text-lg font-black", color)}>{value}</p>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Active */}
        {(isLoading || holding.length > 0) && (
          <section className="space-y-3">
            <h2 className="font-extrabold text-stone-700 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-violet-500" /> Active Escrows
            </h2>
            {isLoading
              ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)
              : holding.map((e: any) => <EscrowCard key={e.id} escrow={e} />)
            }
          </section>
        )}

        {/* History */}
        {!isLoading && released.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-extrabold text-stone-700 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Completed
            </h2>
            {released.map((e: any) => <EscrowCard key={e.id} escrow={e} />)}
          </section>
        )}

        {!isLoading && escrows.length === 0 && (
          <div className="bg-white rounded-2xl border border-stone-100 py-24 text-center shadow-sm">
            <ShieldCheck className="w-10 h-10 text-stone-200 mx-auto mb-3" />
            <p className="font-bold text-stone-500">No escrow transactions yet</p>
            <p className="text-stone-400 text-xs mt-1">Escrows are created when a landowner accepts your application.</p>
            <Link href="/dashboard/find-land">
              <Button variant="link" className="text-emerald-600 mt-2 font-bold h-auto p-0 text-sm">
                Find a land to lease →
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}