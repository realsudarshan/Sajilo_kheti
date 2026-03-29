"use client";

import { useState } from "react";
import { MapPin, User, Calendar, Wallet, CheckCircle2, Clock } from "lucide-react";
import { useGetAllLeasesAdmin } from "@/queryandmutation";
import { Skeleton } from "@/components/ui/skeleton";

const escrowStatusConfig: Record<string, { label: string; className: string; icon: any }> = {
  HOLDING:  { label: "Pending",  className: "bg-amber-100 text-amber-700 border-amber-200",    icon: Clock        },
  RELEASED: { label: "Active",   className: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  REFUNDED: { label: "Refunded", className: "bg-red-100 text-red-700 border-red-200",           icon: Clock        },
};

type FilterType = "ALL" | "HOLDING" | "RELEASED";

export default function LeasesPage() {
  const [filter, setFilter] = useState<FilterType>("ALL");

  const { data, isLoading } = useGetAllLeasesAdmin(
    filter === "ALL" ? undefined : filter
  );

  const leases = data?.applications ?? [];

  // Count tabs without refetching — just count from ALL data
  const { data: allData } = useGetAllLeasesAdmin(undefined);
  const allLeases = allData?.applications ?? [];
  const counts = {
    ALL:      allLeases.length,
    HOLDING:  allLeases.filter((l: any) => l.escrow?.status === "HOLDING").length,
    RELEASED: allLeases.filter((l: any) => l.escrow?.status === "RELEASED").length,
  };

  return (
    <div className="flex flex-col gap-6 py-6 px-4 lg:px-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Leases</h1>
          <p className="text-slate-500 text-sm mt-1">
            Pending leases are in escrow negotiation. Active leases have released escrow.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          {([
            { key: "ALL",      label: "All"     },
            { key: "HOLDING",  label: "Pending" },
            { key: "RELEASED", label: "Active"  },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                filter === key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {label}
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                filter === key
                  ? "bg-slate-100 text-slate-600"
                  : "bg-slate-200 text-slate-500"
              }`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : leases.length === 0 ? (
          <div className="py-20 text-center text-slate-400 font-medium">
            No leases found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-5 py-3.5 font-bold text-slate-500 uppercase text-xs tracking-wider">Land</th>
                  <th className="text-left px-5 py-3.5 font-bold text-slate-500 uppercase text-xs tracking-wider">Leaser</th>
                  <th className="text-left px-5 py-3.5 font-bold text-slate-500 uppercase text-xs tracking-wider">Duration</th>
                  <th className="text-left px-5 py-3.5 font-bold text-slate-500 uppercase text-xs tracking-wider">Rent/mo</th>
                  <th className="text-left px-5 py-3.5 font-bold text-slate-500 uppercase text-xs tracking-wider">Escrow Amount</th>
                  <th className="text-left px-5 py-3.5 font-bold text-slate-500 uppercase text-xs tracking-wider">Commission</th>
                  <th className="text-left px-5 py-3.5 font-bold text-slate-500 uppercase text-xs tracking-wider">Status</th>
                  <th className="text-left px-5 py-3.5 font-bold text-slate-500 uppercase text-xs tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leases.map((lease: any) => {
                  const escrow = lease.escrow;
                  const escrowCfg = escrowStatusConfig[escrow?.status ?? "HOLDING"];
                  const StatusIcon = escrowCfg.icon;
                  return (
                    <tr key={lease.id} className="hover:bg-slate-50 transition-colors">

                      {/* Land */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900 truncate max-w-[150px]">
                          {lease.land?.title ?? "—"}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {lease.land?.location ?? "—"}
                        </p>
                      </td>

                      {/* Leaser */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                          </div>
                          <span className="text-slate-700 font-medium">
                            {lease.leaser?.name ?? "—"}
                          </span>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {lease.leaseDurationInMonths} mo
                        </div>
                      </td>

                      {/* Rent */}
                      <td className="px-5 py-4 font-bold text-slate-800">
                        Rs {lease.proposedMonthlyRent?.toLocaleString()}
                      </td>

                      {/* Escrow Amount */}
                      <td className="px-5 py-4">
                        {escrow ? (
                          <span className="font-bold text-slate-800">
                            Rs {escrow.amount?.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">No escrow</span>
                        )}
                      </td>

                      {/* Commission */}
                      <td className="px-5 py-4 text-emerald-700 font-bold">
                        {escrow ? `Rs ${escrow.commission?.toLocaleString()}` : "—"}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${escrowCfg.className}`}>
                          <StatusIcon className="h-3 w-3" />
                          {escrowCfg.label}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-slate-400 text-xs">
                        {new Date(lease.createdAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!isLoading && leases.length > 0 && (
        <p className="text-xs text-slate-400 text-center">
          Showing {leases.length} lease{leases.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}