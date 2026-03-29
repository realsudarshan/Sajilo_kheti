"use client";

import { useState } from "react";
import { 
  Flag, Lightbulb, Bug, Shield, 
  CheckCircle2, XCircle, Eye, 
  Filter, Search, Loader2,
  Calendar, Mail, Hash
} from "lucide-react";

import { trpc } from "@/lib/trpc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --- Types ---
type ReportType = "COMPLAINT" | "SUGGESTION" | "BUG" | "SAFETY";
type ReportStatus = "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";

interface Report {
  id: string;
  type: ReportType;
  subject: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  status: ReportStatus;
  createdAt: string | Date;
  contactEmail?: string;
  anonymous?: boolean;
}

const typeConfig: Record<ReportType, { icon: any; color: string; label: string }> = {
  COMPLAINT:  { icon: Flag,      color: "text-red-600 bg-red-50",     label: "Complaint"   },
  SUGGESTION: { icon: Lightbulb, color: "text-emerald-600 bg-emerald-50", label: "Suggestion" },
  BUG:         { icon: Bug,       color: "text-amber-600 bg-amber-50",  label: "Bug"         },
  SAFETY:      { icon: Shield,    color: "text-violet-600 bg-violet-50",label: "Safety"      },
};

export default function AdminReportsPage() {
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selected, setSelected] = useState<Report | null>(null);

  const { data, isLoading, refetch } = trpc.report.getAll.useQuery({
    type: filterType === "ALL" ? undefined : (filterType as any),
    status: filterStatus === "ALL" ? undefined : (filterStatus as any),
  });

  const updateStatus = trpc.report.updateStatus.useMutation({
    onSuccess: () => { refetch(); setSelected(null); },
  });

  const reports = (data?.reports as Report[]) ?? [];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Report Management</h1>
            <p className="text-slate-500 font-medium">Review and resolve platform issues.</p>
          </div>
          <Badge variant="outline" className="h-8 px-4 rounded-full bg-white border-slate-200 font-bold text-slate-700">
            {reports.length} Reports
          </Badge>
        </div>

        {/* Filters using Shadcn Select */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Filter className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px] h-11 rounded-2xl border-2 border-slate-200 bg-white font-bold text-xs uppercase tracking-wider focus:ring-slate-900 transition-all">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-2xl p-1">
              <SelectItem value="ALL" className="rounded-xl font-bold uppercase text-[10px] tracking-widest py-3 cursor-pointer">All Types</SelectItem>
              <SelectItem value="COMPLAINT" className="rounded-xl font-bold uppercase text-[10px] tracking-widest py-3 cursor-pointer">Complaint</SelectItem>
              <SelectItem value="SUGGESTION" className="rounded-xl font-bold uppercase text-[10px] tracking-widest py-3 cursor-pointer">Suggestion</SelectItem>
              <SelectItem value="BUG" className="rounded-xl font-bold uppercase text-[10px] tracking-widest py-3 cursor-pointer">Bug</SelectItem>
              <SelectItem value="SAFETY" className="rounded-xl font-bold uppercase text-[10px] tracking-widest py-3 cursor-pointer">Safety</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px] h-11 rounded-2xl border-2 border-slate-200 bg-white font-bold text-xs uppercase tracking-wider focus:ring-slate-900 transition-all">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-2 border-slate-100 shadow-2xl p-1">
              <SelectItem value="ALL" className="rounded-xl font-bold uppercase text-[10px] tracking-widest py-3 cursor-pointer">All Statuses</SelectItem>
              <SelectItem value="PENDING" className="rounded-xl font-bold uppercase text-[10px] tracking-widest py-3 cursor-pointer">Pending</SelectItem>
              <SelectItem value="REVIEWED" className="rounded-xl font-bold uppercase text-[10px] tracking-widest py-3 cursor-pointer">Reviewed</SelectItem>
              <SelectItem value="RESOLVED" className="rounded-xl font-bold uppercase text-[10px] tracking-widest py-3 cursor-pointer">Resolved</SelectItem>
              <SelectItem value="DISMISSED" className="rounded-xl font-bold uppercase text-[10px] tracking-widest py-3 cursor-pointer">Dismissed</SelectItem>
            </SelectContent>
          </Select>

          {(filterType !== "ALL" || filterStatus !== "ALL") && (
            <Button 
              variant="ghost" 
              onClick={() => { setFilterType("ALL"); setFilterStatus("ALL"); }}
              className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
          {isLoading ? (
            <div className="p-24 flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 text-slate-900 animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading DB</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-24 text-center">
              <Search className="h-10 w-10 text-slate-200 mx-auto mb-4" />
              <p className="font-bold text-slate-900">No reports found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <th className="px-8 py-5">Type</th>
                    <th className="px-8 py-5">Issue</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {reports.map((r) => {
                    const type = typeConfig[r.type];
                    return (
                      <tr key={r.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold ${type.color}`}>
                            <type.icon className="h-3.5 w-3.5" />
                            {type.label}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-black text-slate-900">{r.subject}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <Badge variant="secondary" className="rounded-lg text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border-none">
                            {r.status}
                          </Badge>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <Button 
                            size="icon" 
                            variant="secondary" 
                            className="rounded-xl h-10 w-10 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                            onClick={() => setSelected(r)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal Logic here... */}
    </div>
  );
}