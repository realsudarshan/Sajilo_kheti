// dashboard/page.tsx
"use client"

import Link from "next/link"
import { useGetMe, useGetMyApplications, useGetMyEscrows } from "@/queryandmutation"
import {
  MapPin, FileText, ShieldCheck, Search,
  ArrowRight, CheckCircle2, Clock, XCircle,
  AlertTriangle, TrendingUp,
} from "lucide-react"
import { Button }   from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn }       from "@/lib/utils"

function fmtNPR(n: number) {
  return `₨ ${n.toLocaleString("en-NP")}`
}

const APP_STATUS_CFG: Record<string, {
  label: string; color: string; bg: string; icon: React.ReactNode
}> = {
  PENDING:   { label: "Pending",   color: "text-amber-700",   bg: "bg-amber-50",   icon: <Clock        className="w-3 h-3" /> },
  ACCEPTED:  { label: "Accepted",  color: "text-emerald-700", bg: "bg-emerald-50", icon: <CheckCircle2 className="w-3 h-3" /> },
  REJECTED:  { label: "Rejected",  color: "text-red-600",     bg: "bg-red-50",     icon: <XCircle      className="w-3 h-3" /> },
  COMPLETED: { label: "Completed", color: "text-blue-700",    bg: "bg-blue-50",    icon: <CheckCircle2 className="w-3 h-3" /> },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = APP_STATUS_CFG[status] ?? {
    label: status, color: "text-stone-600", bg: "bg-stone-50", icon: null,
  }
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold",
      cfg.color, cfg.bg
    )}>
      {cfg.icon}{cfg.label}
    </span>
  )
}

const JOURNEY_STEPS = ["Applied", "Accepted", "Escrow Paid", "Malpot Signed", "Active Lease"]

function getJourneyStep(app: any, escrow: any): number {
  if (!app) return -1
  if (app.status === "PENDING")  return 0
  if (app.status === "REJECTED") return -1
  if (app.status === "ACCEPTED" && !escrow)                        return 1
  if (escrow?.status === "HOLDING" && !escrow.landleaserMalpotUrl) return 2
  if (escrow?.landleaserMalpotUrl && escrow.status === "HOLDING")  return 3
  if (escrow?.status === "RELEASED" || app.status === "COMPLETED") return 4
  return 1
}

function LeaseJourney({ app, escrow }: { app: any; escrow: any }) {
  const step = getJourneyStep(app, escrow)
  return (
    <div className="bg-gradient-to-br from-[#073213] to-[#0f4d1a] rounded-2xl p-6 relative overflow-hidden">
      <span className="absolute right-4 bottom-0 text-[100px] opacity-[0.06] select-none pointer-events-none">🌾</span>
      <p className="text-[10px] font-bold tracking-widest text-emerald-400/70 uppercase mb-1">Active Lease Journey</p>
      <p className="text-white font-extrabold text-base mb-6 truncate">
        {app?.land?.title ?? "No active lease"}
      </p>
      <div className="flex items-start">
        {JOURNEY_STEPS.map((label, i) => {
          const done = i < step
          const active = i === step
          const future = i > step
          return (
            <div key={label} className="flex-1 flex flex-col items-center">
              <div className="flex items-center w-full">
                {i > 0 && <div className={cn("flex-1 h-[2px]", done ? "bg-emerald-400" : "bg-white/10")} />}
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-extrabold",
                  done   ? "bg-emerald-400 text-[#073213]" : "",
                  active ? "bg-white text-[#073213] ring-4 ring-emerald-400/40" : "",
                  future ? "bg-white/10 text-white/30" : "",
                )}>
                  {done ? "✓" : i + 1}
                </div>
                {i < JOURNEY_STEPS.length - 1 && <div className={cn("flex-1 h-[2px]", done ? "bg-emerald-400" : "bg-white/10")} />}
              </div>
              <span className={cn(
                "text-[9px] font-semibold mt-1.5 text-center leading-tight",
                done || active ? "text-emerald-300" : "text-white/25"
              )}>{label}</span>
            </div>
          )
        })}
      </div>
      {step === 1 && app && (
        <div className="mt-5 flex items-center gap-3 bg-black/20 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-amber-200 text-xs font-medium flex-1">Pay escrow to lock in your lease.</p>
          <Link href={`/checkout/${app.id}`}>
            <Button size="sm" className="bg-emerald-400 text-[#073213] font-bold text-xs h-7 rounded-lg hover:bg-emerald-300">Pay →</Button>
          </Link>
        </div>
      )}
      {step === 2 && (
        <div className="mt-5 flex items-center gap-3 bg-black/20 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-amber-200 text-xs font-medium flex-1">Upload your signed Malpot papers.</p>
          <Link href={`/verify-agreement/${escrow?.id}`}>
            <Button size="sm" className="bg-emerald-400 text-[#073213] font-bold text-xs h-7 rounded-lg hover:bg-emerald-300">Upload →</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, sub, icon, accent }: {
  label: string; value: string | number; sub: string; icon: React.ReactNode; accent: string
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className={cn("p-2 rounded-xl", accent)}>{icon}</div>
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">{sub}</span>
      </div>
      <div>
        <p className="text-2xl font-black text-stone-900 tracking-tight">{value}</p>
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mt-0.5">{label}</p>
      </div>
    </div>
  )
}

export default function LeaserDashboardPage() {
  const { data: me }                                               = useGetMe()
  // ✅ leaserProcedure — full land relation included
  const { data: appsData,   isLoading: loadingApps   }            = useGetMyApplications()
  // ✅ leaserProcedure — scoped to ctx.user.id
  const { data: escrowData, isLoading: loadingEscrow }            = useGetMyEscrows()

  const applications  = appsData?.applications  ?? []
  const escrows       = escrowData?.escrows      ?? []

  const activeLeases  = applications.filter(a => a.status === "ACCEPTED" || a.status === "COMPLETED").length
  const pendingApps   = applications.filter(a => a.status === "PENDING").length
  const totalReleased = escrows.filter(e => e.status === "RELEASED").reduce((s, e) => s + e.amount, 0)
  const escrowHeld    = escrows.filter(e => e.status === "HOLDING").reduce((s, e) => s + e.amount, 0)

  const activeApp    = applications.find(a => a.status === "ACCEPTED")
  const activeEscrow = activeApp ? escrows.find(e => e.applicationId === activeApp.id) : null
  const isLoading    = loadingApps || loadingEscrow

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Welcome back{me?.name ? `, ${me.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-stone-400 text-sm mt-0.5">
            {new Date().toLocaleDateString("en-NP", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <Link href="/dashboard/find-land">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold gap-2 shadow-sm">
            <Search className="w-4 h-4" /> Find Land
          </Button>
        </Link>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active Leases"  value={activeLeases}        sub="Live"     icon={<MapPin      className="w-4 h-4 text-emerald-600" />} accent="bg-emerald-50" />
          <StatCard label="Pending Apps"   value={pendingApps}          sub="Awaiting" icon={<Clock       className="w-4 h-4 text-amber-500"   />} accent="bg-amber-50"   />
          <StatCard label="Total Released" value={fmtNPR(totalReleased)} sub="Paid"    icon={<TrendingUp  className="w-4 h-4 text-blue-500"    />} accent="bg-blue-50"    />
          <StatCard label="Escrow Held"    value={fmtNPR(escrowHeld)}   sub="Secure"  icon={<ShieldCheck className="w-4 h-4 text-violet-500"  />} accent="bg-violet-50"  />
        </div>
      )}

      {/* Journey + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          {isLoading
            ? <Skeleton className="h-52 rounded-2xl" />
            : <LeaseJourney app={activeApp} escrow={activeEscrow} />
          }
        </div>
        <div className="lg:col-span-3 bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold text-stone-800 text-sm">Recent Applications</h2>
            <Link href="/dashboard/my-leases" className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-0.5">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
          ) : applications.length === 0 ? (
            <div className="py-10 text-center">
              <FileText className="w-8 h-8 text-stone-200 mx-auto mb-2" />
              <p className="text-stone-400 text-sm font-medium">No applications yet</p>
              <Link href="/dashboard/find-land">
                <Button variant="link" className="text-emerald-600 text-xs mt-1 font-bold h-auto p-0">Browse lands →</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {applications.slice(0, 4).map((app: any) => (
                <div key={app.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                    {app.land?.heroImageUrl
                      ? <img src={app.land.heroImageUrl} alt="" className="w-full h-full object-cover" />
                      : <MapPin className="w-4 h-4 text-stone-300 m-3" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-stone-800 truncate">{app.land?.title ?? "—"}</p>
                    <p className="text-xs text-stone-400 truncate">{app.land?.location} · ₨{app.proposedMonthlyRent.toLocaleString()}/mo</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/dashboard/find-land", label: "Find New Land",     desc: "Browse available listings",   icon: Search,      color: "emerald" },
          { href: "/dashboard/my-leases", label: "My Applications",   desc: "Track all your applications", icon: FileText,    color: "blue"    },
          { href: "/dashboard/escrow",    label: "Escrow & Payments", desc: "Manage your escrow payments", icon: ShieldCheck, color: "violet"  },
        ].map(({ href, label, desc, icon: Icon, color }) => (
          <Link key={href} href={href} className={cn(
            "bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex items-start gap-4",
            "hover:border-stone-200 hover:shadow-md transition-all group"
          )}>
            <div className={cn("p-2.5 rounded-xl shrink-0", `bg-${color}-50`)}>
              <Icon className={cn("w-4 h-4", `text-${color}-600`)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-stone-800 text-sm">{label}</p>
              <p className="text-xs text-stone-400 mt-0.5">{desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-300 mt-0.5 group-hover:text-stone-500 transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}