"use client";

import { useState } from "react";
import { Flag, Lightbulb, Bug, Shield, Clock, CheckCircle2, XCircle, Eye } from "lucide-react";
import { trpc } from "@/lib/trpc"; // adjust path

const typeConfig: Record<string, { icon: any; color: string; label: string }> = {
  COMPLAINT:  { icon: Flag,      color: "text-red-600 bg-red-50",     label: "Complaint"   },
  SUGGESTION: { icon: Lightbulb, color: "text-emerald-600 bg-emerald-50", label: "Suggestion" },
  BUG:        { icon: Bug,       color: "text-amber-600 bg-amber-50",  label: "Bug"         },
  SAFETY:     { icon: Shield,    color: "text-violet-600 bg-violet-50",label: "Safety"      },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Pending",   color: "bg-yellow-100 text-yellow-700" },
  REVIEWED:  { label: "Reviewed",  color: "bg-blue-100 text-blue-700"     },
  RESOLVED:  { label: "Resolved",  color: "bg-emerald-100 text-emerald-700"},
  DISMISSED: { label: "Dismissed", color: "bg-gray-100 text-gray-500"     },
};

const priorityColor: Record<string, string> = {
  low:      "text-gray-500",
  medium:   "text-amber-600",
  high:     "text-orange-600",
  critical: "text-red-600 font-bold",
};

export default function AdminReportsPage() {
  const [filterType,   setFilterType]   = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selected,     setSelected]     = useState<any>(null);

  const { data, isLoading, refetch } = trpc.report.getAll.useQuery({
    type:   filterType   as any || undefined,
    status: filterStatus as any || undefined,
  });

  const updateStatus = trpc.report.updateStatus.useMutation({
    onSuccess: () => { refetch(); setSelected(null); },
  });

  const reports = data?.reports ?? [];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">User Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Complaints, suggestions, bugs and safety concerns</p>
        </div>
        <span className="bg-slate-100 text-slate-700 text-sm font-bold px-3 py-1 rounded-full">
          {reports.length} total
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
        >
          <option value="">All Types</option>
          <option value="COMPLAINT">Complaint</option>
          <option value="SUGGESTION">Suggestion</option>
          <option value="BUG">Bug</option>
          <option value="SAFETY">Safety</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="RESOLVED">Resolved</option>
          <option value="DISMISSED">Dismissed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No reports found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-bold text-slate-600">Type</th>
                <th className="text-left px-4 py-3 font-bold text-slate-600">Subject</th>
                <th className="text-left px-4 py-3 font-bold text-slate-600">Priority</th>
                <th className="text-left px-4 py-3 font-bold text-slate-600">Status</th>
                <th className="text-left px-4 py-3 font-bold text-slate-600">Date</th>
                <th className="text-left px-4 py-3 font-bold text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((r: any) => {
                const type = typeConfig[r.type];
                const status = statusConfig[r.status];
                return (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold ${type.color}`}>
                        <type.icon className="h-3 w-3" />
                        {type.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-800 font-medium max-w-[200px] truncate">
                      {r.subject}
                    </td>
                    <td className={`px-4 py-3 capitalize ${priorityColor[r.priority] ?? ''}`}>
                      {r.priority}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(r)}
                        className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <h2 className="font-black text-lg text-slate-900">{selected.subject}</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">×</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-slate-400 text-xs font-bold uppercase">Type</p><p>{typeConfig[selected.type]?.label}</p></div>
              <div><p className="text-slate-400 text-xs font-bold uppercase">Priority</p><p className={`capitalize ${priorityColor[selected.priority]}`}>{selected.priority}</p></div>
              <div><p className="text-slate-400 text-xs font-bold uppercase">Status</p><p>{statusConfig[selected.status]?.label}</p></div>
              <div><p className="text-slate-400 text-xs font-bold uppercase">Submitted</p><p>{new Date(selected.createdAt).toLocaleString()}</p></div>
              {selected.leaseId && <div className="col-span-2"><p className="text-slate-400 text-xs font-bold uppercase">Lease ID</p><p className="font-mono text-xs">{selected.leaseId}</p></div>}
              {selected.contactEmail && <div className="col-span-2"><p className="text-slate-400 text-xs font-bold uppercase">Contact</p><p>{selected.contactEmail}</p></div>}
              {selected.anonymous && <div className="col-span-2"><p className="text-xs text-slate-400 italic">Submitted anonymously</p></div>}
            </div>

            <div>
              <p className="text-slate-400 text-xs font-bold uppercase mb-1">Description</p>
              <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3 leading-relaxed">{selected.description}</p>
            </div>

            <div>
              <p className="text-slate-400 text-xs font-bold uppercase mb-2">Update Status</p>
              <div className="flex gap-2 flex-wrap">
                {(['REVIEWED', 'RESOLVED', 'DISMISSED'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus.mutate({ reportId: selected.id, status: s })}
                    disabled={updateStatus.isPending}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      selected.status === s
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}