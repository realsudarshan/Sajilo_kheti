// FILE: app/landowner-dashboard/escrow/page.tsx
// ROUTE: /landowner-dashboard/escrow (Escrow transactions + earnings tracker)

"use client";

import { useState } from "react";
import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileText,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetMyOwnerEscrows } from "@/queryandmutation";

const ESCROW_STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  HOLDING:            { label: "Holding",          bg: "bg-amber-100",   text: "text-amber-700",  icon: Clock },
  WAITING_FOR_PAPERS: { label: "Awaiting Papers",  bg: "bg-blue-100",    text: "text-blue-700",   icon: FileText },
  UNDER_REVIEW:       { label: "Under Review",     bg: "bg-violet-100",  text: "text-violet-700", icon: ShieldCheck },
  RELEASED:           { label: "Released",         bg: "bg-emerald-100", text: "text-emerald-700",icon: CheckCircle2 },
  DISPUTED:           { label: "Disputed",         bg: "bg-red-100",     text: "text-red-600",    icon: AlertCircle },
};

function EscrowCard({ escrow }: { escrow: any }) {
  const conf = ESCROW_STATUS_CONFIG[escrow.status] ?? ESCROW_STATUS_CONFIG["HOLDING"];
  const Icon = conf.icon;
  const net = escrow.amount - (escrow.commission ?? 0);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 hover:shadow-md transition-shadow">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <p className="font-black text-stone-900 text-sm truncate">
            {escrow.application?.land?.title ?? "Land Agreement"}
          </p>
          {escrow.application?.land?.location && (
            <div className="flex items-center gap-1 mt-0.5 text-xs text-stone-400">
              <MapPin className="h-3 w-3" />
              {escrow.application.land.location}
            </div>
          )}
        </div>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${conf.bg} ${conf.text}`}>
          <Icon className="h-3 w-3" />
          {conf.label}
        </span>
      </div>

      {/* Amounts grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-stone-50 rounded-xl p-3">
          <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider mb-1">Escrow</p>
          <p className="text-sm font-black text-stone-800">Rs. {escrow.amount?.toLocaleString()}</p>
        </div>
        <div className="bg-stone-50 rounded-xl p-3">
          <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider mb-1">Commission</p>
          <p className="text-sm font-black text-red-500">-Rs. {escrow.commission?.toLocaleString()}</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
          <p className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider mb-1">You Receive</p>
          <p className="text-sm font-black text-emerald-700">Rs. {net.toLocaleString()}</p>
        </div>
      </div>

      {/* Docs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {escrow.landownerMalpotUrl && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(escrow.landownerMalpotUrl, "_blank")}
            className="h-8 text-xs font-bold border-stone-200 rounded-xl gap-1.5"
          >
            <FileText className="h-3.5 w-3.5 text-emerald-600" />
            Your Malpot Paper
            <ExternalLink className="h-3 w-3 text-stone-400" />
          </Button>
        )}
        {escrow.landleaserMalpotUrl && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(escrow.landleaserMalpotUrl, "_blank")}
            className="h-8 text-xs font-bold border-stone-200 rounded-xl gap-1.5"
          >
            <FileText className="h-3.5 w-3.5 text-blue-500" />
            Leaser&apos;s Paper
            <ExternalLink className="h-3 w-3 text-stone-400" />
          </Button>
        )}
      </div>

      {/* Status info */}
      {escrow.status === "HOLDING" && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <Clock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 font-medium">
            Funds are held in escrow. Submit Malpot papers at{" "}
            <a href={`/verify-agreement/${escrow.id}`} className="underline font-bold">
              verify agreement
            </a>{" "}
            to proceed.
          </p>
        </div>
      )}

      {escrow.status === "RELEASED" && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <p className="text-xs text-emerald-700 font-bold">
            Funds released! Rs. {net.toLocaleString()} transferred to your account.
          </p>
        </div>
      )}

      {/* Payment ID */}
      {escrow.paymentId && (
        <p className="text-[10px] text-stone-400 mt-3 font-mono">
          txn: {escrow.paymentId}
        </p>
      )}
    </div>
  );
}

export default function EscrowPage() {
  const { data, isLoading } = useGetMyOwnerEscrows();
  const escrows: any[] = (data as any)?.escrows ?? [];

  const holding  = escrows.filter((e) => e.status === "HOLDING");
  const review   = escrows.filter((e) => ["WAITING_FOR_PAPERS", "UNDER_REVIEW"].includes(e.status));
  const released = escrows.filter((e) => e.status === "RELEASED");
  const disputed = escrows.filter((e) => e.status === "DISPUTED");

  const totalEarned    = released.reduce((s: number, e: any) => s + (e.amount - (e.commission ?? 0)), 0);
  const totalInEscrow  = holding.reduce((s: number, e: any) => s + e.amount, 0);
  const totalCommission = released.reduce((s: number, e: any) => s + (e.commission ?? 0), 0);

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-stone-900">Escrow & Payments</h1>
        <p className="text-stone-500 text-sm mt-1">
          Track all escrow transactions and earnings from land leases.
        </p>
      </div>

      {/* Summary cards */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-xl font-black text-stone-900">Rs. {totalEarned.toLocaleString()}</p>
            <p className="text-xs text-stone-500 font-medium mt-0.5">Total Earned</p>
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 p-5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center mb-3">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-xl font-black text-stone-900">Rs. {totalInEscrow.toLocaleString()}</p>
            <p className="text-xs text-stone-500 font-medium mt-0.5">Currently in Escrow</p>
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 p-5">
            <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center mb-3">
              <Wallet className="h-5 w-5 text-stone-600" />
            </div>
            <p className="text-xl font-black text-stone-900">Rs. {totalCommission.toLocaleString()}</p>
            <p className="text-xs text-stone-500 font-medium mt-0.5">Platform Commission (5%)</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="holding">
        <TabsList className="bg-stone-100 rounded-xl h-10 p-1">
          <TabsTrigger value="holding" className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Holding ({holding.length})
          </TabsTrigger>
          <TabsTrigger value="review" className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Under Review ({review.length})
          </TabsTrigger>
          <TabsTrigger value="released" className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Released ({released.length})
          </TabsTrigger>
          {disputed.length > 0 && (
            <TabsTrigger value="disputed" className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm">
              Disputed ({disputed.length})
            </TabsTrigger>
          )}
        </TabsList>

        {isLoading ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
          </div>
        ) : (
          <>
            {["holding", "review", "released", "disputed"].map((tab) => {
              const list = tab === "holding" ? holding : tab === "review" ? review : tab === "released" ? released : disputed;
              return (
                <TabsContent key={tab} value={tab} className="mt-4">
                  {list.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-stone-200 py-16 text-center">
                      <Wallet className="h-10 w-10 text-stone-200 mx-auto mb-3" />
                      <p className="text-stone-500 font-medium text-sm">
                        No {tab} escrow transactions
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {list.map((escrow: any) => (
                        <EscrowCard key={escrow.id} escrow={escrow} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </>
        )}
      </Tabs>
    </div>
  );
}