// FILE: app/landowner-dashboard/applications/page.tsx
// ROUTE: /landowner-dashboard/applications (All applications across ALL your lands)

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  MapPin,
  Calendar,
  MessageSquare,
  Loader2,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  useGetAllApplications,
  useAcceptLeaseApplication,
  useRejectLeaseApplication,
} from "@/queryandmutation";
import { toast } from "sonner";

type AppStatus = "ALL" | "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED";

const TABS: { value: AppStatus; label: string; icon: React.ElementType }[] = [
  { value: "ALL",       label: "All",       icon: MessageSquare },
  { value: "PENDING",   label: "Pending",   icon: Clock },
  { value: "ACCEPTED",  label: "Accepted",  icon: CheckCircle2 },
  { value: "REJECTED",  label: "Rejected",  icon: XCircle },
  { value: "COMPLETED", label: "Completed", icon: CheckCircle2 },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  PENDING:   { label: "Pending",   bg: "bg-amber-100",   text: "text-amber-700",  icon: Clock },
  ACCEPTED:  { label: "Accepted",  bg: "bg-emerald-100", text: "text-emerald-700",icon: CheckCircle2 },
  REJECTED:  { label: "Rejected",  bg: "bg-red-100",     text: "text-red-600",    icon: XCircle },
  COMPLETED: { label: "Completed", bg: "bg-blue-100",    text: "text-blue-700",   icon: CheckCircle2 },
};

function ApplicationRow({ app, onAccept, onReject, accepting, rejecting }: {
  app: any;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  accepting: boolean;
  rejecting: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const conf = STATUS_CONFIG[app.status] ?? STATUS_CONFIG["PENDING"];
  const Icon = conf.icon;

  return (
    <>
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-stone-300 transition-colors">
        <div className="p-4 flex items-start gap-4">
          {/* Status icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${conf.bg}`}>
            <Icon className={`h-5 w-5 ${conf.text}`} />
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <p className="font-black text-stone-900 text-sm">
                  {app.land?.title ?? "Unknown Land"}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-stone-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {app.land?.location ?? "—"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(app.createdAt).toLocaleDateString("en-NP", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${conf.bg} ${conf.text}`}>
                  <Icon className="h-3 w-3" /> {conf.label}
                </span>
              </div>
            </div>

            {/* Message preview */}
            {app.message && (
              <p className={`mt-2 text-xs text-stone-500 leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
                &ldquo;{app.message}&rdquo;
              </p>
            )}
          </div>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 text-stone-300 hover:text-stone-500 transition-colors mt-0.5"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {/* Expanded section */}
        {expanded && (
          <div className="px-4 pb-4 border-t border-stone-100 pt-4 space-y-3">
            {/* Lease duration if provided */}
            {(app.leaseDurationMonths || app.proposedMonthlyRent) && (
              <div className="flex gap-4 flex-wrap">
                {app.leaseDurationMonths && (
                  <div className="bg-stone-50 rounded-xl px-3 py-2">
                    <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Duration</p>
                    <p className="text-sm font-black text-stone-800">{app.leaseDurationMonths} months</p>
                  </div>
                )}
                {app.proposedMonthlyRent && (
                  <div className="bg-stone-50 rounded-xl px-3 py-2">
                    <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Proposed Rent</p>
                    <p className="text-sm font-black text-emerald-700">Rs. {app.proposedMonthlyRent?.toLocaleString()}</p>
                  </div>
                )}
              </div>
            )}

            {/* Actions for PENDING */}
            {app.status === "PENDING" && (
              <div className="flex items-center gap-3 pt-1">
                <Button
                  size="sm"
                  onClick={() => onAccept(app.id)}
                  disabled={accepting || rejecting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold h-9 gap-2"
                >
                  {accepting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  Accept Application
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onReject(app.id)}
                  disabled={accepting || rejecting}
                  className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl font-bold h-9 gap-2"
                >
                  {rejecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                  Reject
                </Button>
              </div>
            )}

            {/* Escrow info if accepted */}
            {app.status === "ACCEPTED" && app.escrow && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <p className="text-xs font-bold text-emerald-800">
                  Escrow Status: <span className="uppercase">{app.escrow.status}</span>
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Amount: Rs. {app.escrow.amount?.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-black">Application Details</DialogTitle>
          </DialogHeader>
          <pre className="text-xs text-stone-600 overflow-auto max-h-96">
            {JSON.stringify(app, null, 2)}
          </pre>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState<AppStatus>("ALL");
  const [search, setSearch]       = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useGetAllApplications(
    activeTab !== "ALL" ? { status: activeTab } : {}
  );
  const acceptMutation = useAcceptLeaseApplication();
  const rejectMutation = useRejectLeaseApplication();

  const apps: any[] = data?.applications ?? [];

  const filtered = apps.filter((app) => {
    if (!search) return true;
    return (
      app.land?.title?.toLowerCase().includes(search.toLowerCase()) ||
      app.land?.location?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const counts = apps.reduce((acc: Record<string, number>, app: any) => {
    acc[app.status] = (acc[app.status] ?? 0) + 1;
    return acc;
  }, {});

  const handleAccept = async (applicationId: string) => {
    setProcessingId(applicationId);
    try {
      await acceptMutation.mutateAsync({ applicationId });
      toast.success("Application accepted! The leaser has been notified.");
      refetch();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to accept application");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (applicationId: string) => {
    setProcessingId(applicationId);
    try {
      await rejectMutation.mutateAsync({ applicationId });
      toast.success("Application rejected.");
      refetch();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to reject application");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-stone-900">Applications</h1>
        <p className="text-stone-500 text-sm mt-1">
          Review and manage lease applications from interested farmers.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const TabIcon = tab.icon;
          const count = tab.value === "ALL" ? apps.length : counts[tab.value];
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeTab === tab.value
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
              }`}
            >
              <TabIcon className="h-3.5 w-3.5" />
              {tab.label}
              {count ? (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.value ? "bg-white/20" : "bg-stone-100 text-stone-500"
                }`}>
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by land name or location…"
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 py-20 text-center">
          <MessageSquare className="h-12 w-12 text-stone-200 mx-auto mb-4" />
          <p className="text-stone-600 font-bold">No applications found</p>
          <p className="text-stone-400 text-sm mt-1">
            {activeTab === "PENDING"
              ? "No pending applications to review"
              : "Applications will appear here once submitted"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app: any) => (
            <ApplicationRow
              key={app.id}
              app={app}
              onAccept={handleAccept}
              onReject={handleReject}
              accepting={acceptMutation.isPending && processingId === app.id}
              rejecting={rejectMutation.isPending && processingId === app.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}