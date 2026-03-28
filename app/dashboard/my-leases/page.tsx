// FILE: app/dashboard/my-leases/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  useGetMyApplications,
  useGetMyAcceptedApplications,
  useGetMyEscrows,
} from "@/queryandmutation"
import { ChatProvider } from "@/components/chat/ChatProvider"
import {
  MapPin, Clock, CheckCircle2, XCircle, FileText,
  ArrowRight, ShieldCheck, Wallet, Navigation,
  Landmark, MessageSquare, Calendar,
} from "lucide-react"
import { Button }   from "@/components/ui/button"
import { Badge }    from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn }       from "@/lib/utils"

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CFG: Record<string, {
  label: string; color: string; bg: string; border: string; icon: React.ReactNode
}> = {
  PENDING:   { label: "Pending",   color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   icon: <Clock        className="w-3.5 h-3.5" /> },
  ACCEPTED:  { label: "Accepted",  color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  REJECTED:  { label: "Rejected",  color: "text-red-600",     bg: "bg-red-50",     border: "border-red-200",     icon: <XCircle      className="w-3.5 h-3.5" /> },
  COMPLETED: { label: "Completed", color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200",    icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
}

type AppStatus = "ALL" | "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED"

const FILTERS: { label: string; value: AppStatus }[] = [
  { label: "All",       value: "ALL"       },
  { label: "Pending",   value: "PENDING"   },
  { label: "Accepted",  value: "ACCEPTED"  },
  { label: "Completed", value: "COMPLETED" },
  { label: "Rejected",  value: "REJECTED"  },
]

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

// ─── Escrow card (ACCEPTED + paid) ───────────────────────────────────────────

function EscrowCard({
  escrow,
  onChatOpen,
}: {
  escrow: any
  onChatOpen: (channelId: string) => void
}) {
  const chatChannelId = escrow.chatChannelId ?? null
  const canChat       = !!chatChannelId
  const landId        = escrow.application?.land?.id

  return (
    <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden flex flex-col md:flex-row">

      {/* Land image */}
      <div className="w-full md:w-56 h-48 md:h-auto relative shrink-0">
        <img
          src={escrow.application?.land?.heroImageUrl}
          className="w-full h-full object-cover"
          alt="Land"
        />
        <Badge className="absolute top-3 left-3 bg-emerald-500 shadow-md text-xs font-bold">
          Live Agreement
        </Badge>
      </div>

      {/* Main info */}
      <div className="flex-1 p-5 flex flex-col justify-between gap-4 min-w-0">
        <div>
          <h3 className="font-black text-stone-900 text-base leading-tight">
            {escrow.application?.land?.title ?? "—"}
          </h3>
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-stone-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {escrow.application?.land?.location ?? "—"}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {escrow.application?.leaseDurationInMonths} months
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => window.location.href = `/verify-agreement/${escrow.id}`}
            className="w-full bg-stone-900 hover:bg-black text-white rounded-xl h-10 font-bold gap-2 shadow-sm"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            Verify with Malpot Paper
          </Button>

          <div className="grid grid-cols-3 gap-2">
            {landId && (
              <Link href={`/navigate/malpot/${landId}`} className="w-full">
                <Button variant="outline" size="sm"
                  className="w-full rounded-xl h-9 text-[11px] font-bold border-amber-200 text-amber-700 bg-amber-50/50 hover:bg-amber-100">
                  <Landmark className="w-3.5 h-3.5 mr-1" /> Malpot
                </Button>
              </Link>
            )}
            {landId && (
              <Link href={`/navigate/land/${landId}`} className="w-full">
                <Button variant="outline" size="sm"
                  className="w-full rounded-xl h-9 text-[11px] font-bold border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100">
                  <Navigation className="w-3.5 h-3.5 mr-1" /> Navigate
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="sm"
              disabled={!canChat}
              title={!canChat ? "Chat unlocks after escrow payment" : "Open lease chat"}
              onClick={() => canChat && onChatOpen(chatChannelId)}
              className="rounded-xl h-9 text-[11px] font-bold border-stone-200"
            >
              <MessageSquare className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              {canChat ? "Chat" : "Chat 🔒"}
            </Button>
          </div>
        </div>
      </div>

      {/* Escrow amount panel */}
      <div className="w-full md:w-52 bg-stone-50 p-5 border-t md:border-t-0 md:border-l border-stone-100 flex flex-col justify-center gap-3 shrink-0">
        <div>
          <p className="text-[10px] uppercase font-black text-stone-400 tracking-widest mb-1">Escrow Security</p>
          <p className="text-lg font-black text-emerald-600 flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5" /> PROTECTED
          </p>
        </div>
        <div className="bg-emerald-500/10 rounded-xl border border-emerald-100 p-3">
          <p className="text-[11px] text-emerald-700 font-bold leading-snug">
            NPR {escrow.amount?.toLocaleString()} secured.
            Upload signed Malpot doc to release funds.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Application card (PENDING / ACCEPTED unpaid / REJECTED) ─────────────────

function AppCard({ app, escrowMap }: { app: any; escrowMap: Record<string, any> }) {
  const router  = useRouter()
  const escrow  = escrowMap[app.id]
  const hasPaid = !!escrow
  const total   = app.proposedMonthlyRent * app.leaseDurationInMonths

  return (
    <div className={cn(
      "bg-white rounded-2xl border shadow-sm p-5 flex gap-4 items-start transition-all hover:shadow-md",
      app.status === "ACCEPTED" && !hasPaid ? "border-indigo-200" : "border-stone-100"
    )}>
      {/* Thumbnail */}
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

        <div className="flex flex-wrap gap-4 text-xs text-stone-500">
          <span>💰 <span className="font-bold text-stone-700">₨{app.proposedMonthlyRent?.toLocaleString()}/mo</span></span>
          <span>⏱ <span className="font-bold text-stone-700">{app.leaseDurationInMonths} months</span></span>
          <span>📅 {new Date(app.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" })}</span>
        </div>

        {app.plans && (
          <p className="text-xs text-stone-400 line-clamp-1 italic">"{app.plans}"</p>
        )}

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

          {/* ACCEPTED + not yet paid → show escrow CTA */}
          {app.status === "ACCEPTED" && !hasPaid && (
            <Button
              size="sm"
              onClick={() => router.push(`/checkout/${app.id}`)}
              className="rounded-xl h-8 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-1"
            >
              <Wallet className="w-3 h-3" />
              Pay Escrow — NPR {total.toLocaleString()}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyLeasesPage() {
  const [activeFilter, setActiveFilter] = useState<AppStatus>("ALL")
  const [openChannelId, setOpenChannelId] = useState<string | null>(null)

  // Filtered list for the active tab
  const { data, isLoading } = useGetMyApplications(
    activeFilter === "ALL" ? {} : { status: activeFilter }
  )
  // Full list just for counts
  const { data: allData } = useGetMyApplications({})
  // Escrows to know which accepted apps are paid + get chatChannelId
  const { data: escrowData } = useGetMyEscrows()

  const applications = data?.applications   ?? []
  const allApps      = allData?.applications ?? []
  const escrows      = escrowData?.escrows   ?? []

  // applicationId → escrow lookup
  const escrowMap = escrows.reduce<Record<string, any>>((acc, e: any) => {
    acc[e.applicationId] = e
    return acc
  }, {})

  // Counts per status for filter badges
  const counts = allApps.reduce<Record<string, number>>((acc, a: any) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1
    return acc
  }, {})

  // Separate accepted+paid apps (shown as EscrowCards) from the rest
  const escrowCards = activeFilter === "ALL" || activeFilter === "ACCEPTED"
    ? applications.filter((a: any) => a.status === "ACCEPTED" && !!escrowMap[a.id])
    : []

  const appCards = applications.filter((a: any) =>
    !(a.status === "ACCEPTED" && !!escrowMap[a.id])
  )

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">My Applications</h1>
            <p className="text-stone-400 text-sm mt-0.5">
              {isLoading ? "Loading…" : `${data?.total ?? 0} application${(data?.total ?? 0) !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Link href="/dashboard/find-land">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold gap-2 shadow-sm">
              <FileText className="w-4 h-4" /> Apply for New Land
            </Button>
          </Link>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
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

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        ) : escrowCards.length === 0 && appCards.length === 0 ? (
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
            {/* Escrow cards first (active leases) */}
            {escrowCards.map((app: any) => (
              <EscrowCard
                key={app.id}
                escrow={escrowMap[app.id]}
                onChatOpen={(channelId) => setOpenChannelId(channelId)}
              />
            ))}

            {/* Regular application cards */}
            {appCards.map((app: any) => (
              <AppCard key={app.id} app={app} escrowMap={escrowMap} />
            ))}
          </div>
        )}
      </div>

      {/* Floating chat — proper ChatProvider, no DOM hacks */}
      <ChatProvider role="leaser" openChannelId={openChannelId} />
    </div>
  )
}