// FILE: app/admin/transactions/page.tsx
"use client";

import { useState } from "react";
import { useGetAllEscrowsForAdmin } from "@/queryandmutation";
import { Badge } from "@/components/ui/badge";
import {
  Shield, TrendingUp, Wallet, Clock,
  CheckCircle2, XCircle, FileCheck, Search,
  ArrowUpRight, Banknote, User, MapPin,
  CalendarDays, Hash
} from "lucide-react";

// ── Status config ────────────────────────────────────────────────────────────

const ESCROW_STATUS: Record<string, { label: string; color: string; dot: string }> = {
  HOLDING:   { label: "Holding",   color: "bg-amber-500/10 text-amber-600 border-amber-200",   dot: "bg-amber-400" },
  RELEASED:  { label: "Released",  color: "bg-emerald-500/10 text-emerald-600 border-emerald-200", dot: "bg-emerald-400" },
  REFUNDED:  { label: "Refunded",  color: "bg-blue-500/10 text-blue-600 border-blue-200",      dot: "bg-blue-400" },
  DISPUTED:  { label: "Disputed",  color: "bg-red-500/10 text-red-600 border-red-200",         dot: "bg-red-400" },
};

const ALL_STATUSES = ["ALL", "HOLDING", "RELEASED", "REFUNDED", "DISPUTED"];

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return "Rs. " + n.toLocaleString("en-NP");
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30)  return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-NP", { month: "short", day: "numeric", year: "numeric" });
}

// ── Summary card ─────────────────────────────────────────────────────────────

function SummaryCard({
  icon: Icon, label, value, sub, accent
}: {
  icon: any; label: string; value: string; sub?: string; accent: string
}) {
  return (
    <div className={`rounded-2xl border p-5 bg-white flex items-start gap-4 shadow-sm`}>
      <div className={`p-2.5 rounded-xl ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">{label}</p>
        <p className="text-xl font-black text-stone-900 mt-0.5 truncate">{value}</p>
        {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Escrow row ────────────────────────────────────────────────────────────────

function EscrowRow({ e }: { e: any }) {
  const [expanded, setExpanded] = useState(false);
  const sc = ESCROW_STATUS[e.status] ?? ESCROW_STATUS.HOLDING;
  const net = (e.amount ?? 0) - (e.commission ?? 0);

  return (
    <div
      className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
      onClick={() => setExpanded((x) => !x)}
    >
      {/* Main row */}
      <div className="flex items-center gap-4 px-5 py-4">

        {/* Status dot */}
        <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${sc.dot}`} />

        {/* ID + land */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-stone-400">
              #{e.id.slice(-8).toUpperCase()}
            </span>
            <span className="text-sm font-bold text-stone-900 truncate">
              {e.application?.land?.title ?? "—"}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-stone-400">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {e.application?.land?.location ?? "—"}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {timeAgo(e.createdAt)}
            </span>
          </div>
        </div>

        {/* People */}
        <div className="hidden md:flex items-center gap-6 text-xs">
          <div className="text-right">
            <p className="text-stone-400 font-medium">Owner</p>
            <p className="font-bold text-stone-800">{e.owner?.name ?? "—"}</p>
          </div>
          <div className="text-right">
            <p className="text-stone-400 font-medium">Leaser</p>
            <p className="font-bold text-stone-800">{e.leaser?.name ?? "—"}</p>
          </div>
        </div>

        {/* Amounts */}
        <div className="hidden lg:flex items-center gap-6 text-xs">
          <div className="text-right">
            <p className="text-stone-400 font-medium">Gross</p>
            <p className="font-bold text-stone-800">{fmt(e.amount ?? 0)}</p>
          </div>
          <div className="text-right">
            <p className="text-stone-400 font-medium">Fee</p>
            <p className="font-bold text-red-500">−{fmt(e.commission ?? 0)}</p>
          </div>
          <div className="text-right">
            <p className="text-stone-400 font-medium">Net</p>
            <p className="font-bold text-emerald-600">{fmt(net)}</p>
          </div>
        </div>

        {/* Status badge */}
        <Badge className={`${sc.color} border text-[10px] font-black uppercase shrink-0`}>
          {sc.label}
        </Badge>

        {/* Expand caret */}
        <ArrowUpRight
          className={`h-4 w-4 text-stone-300 shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`}
        />
      </div>

      {/* Expanded detail panel */}
      {expanded && (
        <div className="border-t border-stone-100 bg-stone-50/60 px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <p className="text-stone-400 font-bold uppercase tracking-widest mb-1">Application ID</p>
            <p className="font-mono text-stone-700 break-all">{e.applicationId}</p>
          </div>
          <div>
            <p className="text-stone-400 font-bold uppercase tracking-widest mb-1">Payment ID</p>
            <p className="font-mono text-stone-700 break-all">{e.paymentId ?? "—"}</p>
          </div>
          <div>
            <p className="text-stone-400 font-bold uppercase tracking-widest mb-1">Lease Duration</p>
            <p className="font-bold text-stone-800">{e.application?.leaseDurationInMonths ?? "—"} months</p>
          </div>
          <div>
            <p className="text-stone-400 font-bold uppercase tracking-widest mb-1">Monthly Rent</p>
            <p className="font-bold text-stone-800">{fmt(e.application?.proposedMonthlyRent ?? 0)}</p>
          </div>
          <div>
            <p className="text-stone-400 font-bold uppercase tracking-widest mb-1">Chat Channel</p>
            <p className="font-mono text-stone-500 truncate">{e.chatChannelId ?? "Not created"}</p>
          </div>
          <div>
            <p className="text-stone-400 font-bold uppercase tracking-widest mb-1">Malpot Papers</p>
            {e.landleaserMalpotUrl
              ? <a href={e.landleaserMalpotUrl} target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 underline font-bold" onClick={(ev) => ev.stopPropagation()}>
                  View Document
                </a>
              : <p className="text-stone-400">Not uploaded</p>
            }
          </div>
          <div>
            <p className="text-stone-400 font-bold uppercase tracking-widest mb-1">Created</p>
            <p className="text-stone-700">{new Date(e.createdAt).toLocaleString("en-NP")}</p>
          </div>
          <div>
            <p className="text-stone-400 font-bold uppercase tracking-widest mb-1">Last Updated</p>
            <p className="text-stone-700">{new Date(e.updatedAt).toLocaleString("en-NP")}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function TransactionsPage() {
  const { data: escrows = [], isLoading } = useGetAllEscrowsForAdmin();
  const [search,    setSearch]    = useState("");
  const [statusTab, setStatusTab] = useState("ALL");

  // Summary stats
  const totalHolding  = escrows.filter((e: any) => e.status === "HOLDING").length;
  const totalReleased = escrows.filter((e: any) => e.status === "RELEASED").length;
  const totalVolume   = escrows.reduce((sum: number, e: any) => sum + (e.amount ?? 0), 0);
  const totalFees     = escrows.reduce((sum: number, e: any) => sum + (e.commission ?? 0), 0);

  // Filter
  const filtered = escrows.filter((e: any) => {
    const matchStatus = statusTab === "ALL" || e.status === statusTab;
    const q = search.toLowerCase();
    const matchSearch = !q
      || e.id.toLowerCase().includes(q)
      || e.owner?.name?.toLowerCase().includes(q)
      || e.leaser?.name?.toLowerCase().includes(q)
      || e.application?.land?.title?.toLowerCase().includes(q)
      || e.application?.land?.location?.toLowerCase().includes(q)
      || e.paymentId?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 min-h-screen bg-[#f8f7f4]">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">Transactions</h1>
        <p className="text-sm text-stone-500 mt-1">All escrow records across every lease on the platform</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard icon={Wallet}      label="Total Volume"    value={`Rs. ${(totalVolume/1000).toFixed(0)}k`}  sub={`${escrows.length} escrows`}    accent="bg-stone-100 text-stone-600" />
        <SummaryCard icon={TrendingUp}  label="Platform Fees"   value={`Rs. ${(totalFees/1000).toFixed(1)}k`}   sub="5% commission"                  accent="bg-emerald-100 text-emerald-600" />
        <SummaryCard icon={Clock}       label="Holding"         value={String(totalHolding)}                     sub="Awaiting Malpot sign-off"       accent="bg-amber-100 text-amber-600" />
        <SummaryCard icon={CheckCircle2} label="Released"       value={String(totalReleased)}                    sub="Funds sent to owners"           accent="bg-blue-100 text-blue-600" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, owner, leaser, land…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
          />
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
          {ALL_STATUSES.map((s) => {
            const count = s === "ALL" ? escrows.length : escrows.filter((e: any) => e.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setStatusTab(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusTab === s
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                {s === "ALL" ? "All" : ESCROW_STATUS[s]?.label}
                <span className={`ml-1.5 text-[10px] font-black ${statusTab === s ? "text-stone-400" : "text-stone-400"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-stone-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400 gap-3">
          <Banknote className="h-12 w-12 text-stone-200" />
          <p className="font-medium text-sm">No transactions found</p>
          {search && (
            <button onClick={() => setSearch("")} className="text-xs text-emerald-600 underline">
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-stone-400 font-medium px-1">
            Showing {filtered.length} of {escrows.length} records — click any row to expand
          </p>
          {filtered.map((e: any) => (
            <EscrowRow key={e.id} e={e} />
          ))}
        </div>
      )}
    </div>
  );
}