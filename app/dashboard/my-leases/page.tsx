// dashboard/my-leases/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { useGetMyApplications } from "@/queryandmutation"
import {
  MapPin, Clock, CheckCircle2, XCircle,
  FileText, ArrowRight, ShieldCheck,
} from "lucide-react"
import { Button }   from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn }       from "@/lib/utils"

// ─── types ───────────────────────────────────────────────────────────────────

// ✅ useGetMyApplications uses leaserProcedure (GetMyApplications)
//    Always scoped to ctx.user.id. Includes full land + leaser relations.

type AppStatus = "ALL" | "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED"

const STATUS_CFG: Record<string, {
  label: string; color: string; bg: string; border: string; icon: React.ReactNode
}> = {
  PENDING:   { label: "Pending",   color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   icon: <Clock        className="w-3.5 h-3.5" /> },
  ACCEPTED:  { label: "Accepted",  color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  REJECTED:  { label: "Rejected",  color: "text-red-600",     bg: "bg-red-50",     border: "border-red-200",     icon: <XCircle      className="w-3.5 h-3.5" /> },
  COMPLETED: { label: "Completed", color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200",    icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
}

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_CFG[status] ?? {
    label: status, color: "text-stone-600",
    bg: "bg-stone-50", border: "border-stone-200", icon: null,
  }
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
      c.color, c.bg, c.border
    )}>
      {c.icon}{c.label}
    </span>
  )
}

// ─── application card ────────────────────────────────────────────────────────

function AppCard({ app }: { app: any }) {
  // app.land is fully populated — title, location, heroImageUrl, id all present
  // because GetMyApplications uses include: { land: true, leaser: true }
  return (
    <div className={cn(
      "bg-white rounded-2xl border shadow-sm p-5 flex gap-4 items-start transition-all hover:shadow-md",
      app.status === "ACCEPTED" ? "border-emerald-200" : "border-stone-100"
    )}>
      {/* Land thumbnail */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0">
        {app.land?.heroImageUrl
          ? <img src={app.land.heroImageUrl} alt={app.land.title} className="w-full h-full object-cover" />
          : <MapPin className="w-5 h-5 text-stone-300 m-5" />
        }
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <h3 className="font-black text-stone-900 text-sm leading-tight">
              {app.land?.title ?? "Unknown Land"}
            </h3>
            <div className="flex items-center gap-1 text-stone-400 text-xs mt-0.5">
              <MapPin className="w-3 h-3 shrink-0" />
              {app.land?.location ?? "—"}
            </div>
          </div>
          <StatusBadge status={app.status} />
        </div>

        {/* Lease details */}
        <div className="flex flex-wrap gap-4 text-xs text-stone-500">
          <span>💰 <span className="font-bold text-stone-700">₨{app.proposedMonthlyRent.toLocaleString()}/mo</span></span>
          <span>⏱ <span className="font-bold text-stone-700">{app.leaseDurationInMonths} months</span></span>
          <span>📅 {new Date(app.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" })}</span>
        </div>

        {/* Plans preview */}
        {app.plans && (
          <p className="text-xs text-stone-400 line-clamp-1 italic">"{app.plans}"</p>
        )}

        {/* Additional message from owner rejection — if present */}
        {app.additionalMessages && app.status === "REJECTED" && (
          <p className="text-xs text-red-400 bg-red-50 rounded-lg px-3 py-1.5">
            ℹ️ {app.additionalMessages}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 flex-wrap pt-1">
          {app.land?.id && (
            <Link href={`/dashboard/lands/${app.land.id}`}>
              <Button size="sm" variant="outline" className="rounded-xl h-8 text-xs font-bold border-stone-200 gap-1">
                View Land <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          )}
          {app.status === "ACCEPTED" && (
            <Link href={`/checkout/${app.id}`}>
              <Button size="sm" className="rounded-xl h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1">
                <ShieldCheck className="w-3 h-3" /> Pay Escrow
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── filter tabs ─────────────────────────────────────────────────────────────

const FILTERS: { label: string; value: AppStatus }[] = [
  { label: "All",       value: "ALL"       },
  { label: "Pending",   value: "PENDING"   },
  { label: "Accepted",  value: "ACCEPTED"  },
  { label: "Completed", value: "COMPLETED" },
  { label: "Rejected",  value: "REJECTED"  },
]

// ─── page ────────────────────────────────────────────────────────────────────

export default function MyLeasesPage() {
  const [activeFilter, setActiveFilter] = useState<AppStatus>("ALL")

  // Pass status to the hook only when not "ALL" so the backend
  // filters — avoids fetching everything then filtering client-side
  const { data, isLoading } = useGetMyApplications(
    activeFilter === "ALL" ? {} : { status: activeFilter }
  )

  const applications = data?.applications ?? []
  const total        = data?.total        ?? 0

  // Count per status for badge display (from "ALL" data when filter is ALL)
  const { data: allData } = useGetMyApplications({})
  const counts = (allData?.applications ?? []).reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">My Applications</h1>
            <p className="text-stone-400 text-sm mt-0.5">
              {isLoading ? "Loading…" : `${total} application${total !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Link href="/dashboard/find-land">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold gap-2 shadow-sm">
              <FileText className="w-4 h-4" /> Apply for New Land
            </Button>
          </Link>
        </div>

        {/* Filter pills with counts */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={cn(
                "px-4 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5",
                activeFilter === f.value
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-500 border-stone-200 hover:border-stone-300"
              )}
            >
              {f.label}
              {f.value !== "ALL" && counts[f.value] ? (
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px]",
                  activeFilter === f.value ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"
                )}>
                  {counts[f.value]}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Application list */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-100 py-24 text-center shadow-sm">
            <FileText className="w-10 h-10 text-stone-200 mx-auto mb-3" />
            <p className="font-bold text-stone-500">No applications in this category</p>
            <Link href="/dashboard/find-land">
              <Button variant="link" className="text-emerald-600 mt-1 font-bold h-auto p-0 text-sm">
                Browse available lands →
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app: any) => <AppCard key={app.id} app={app} />)}
          </div>
        )}
      </div>
    </div>
  )
}