// FILE: app/landowner-dashboard/my-lands/page.tsx
// ROUTE: /landowner-dashboard/my-lands (Grid of all lands with filter + hide/show)

"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MapPin,
  PlusCircle,
  Eye,
  EyeOff,
  FileText,
  MoreVertical,
  Search,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetMyLands,
  useUpdateLandStatus,
} from "@/queryandmutation";
import { toast } from "sonner";

type LandStatus = "ALL" | "AVAILABLE" | "IN_NEGOTIATION" | "LEASED" | "HIDDEN" | "UNVERIFIED";

const STATUS_FILTERS: { value: LandStatus; label: string }[] = [
  { value: "ALL",            label: "All" },
  { value: "AVAILABLE",      label: "Available" },
  { value: "IN_NEGOTIATION", label: "Negotiating" },
  { value: "LEASED",         label: "Leased" },
  { value: "HIDDEN",         label: "Hidden" },
  { value: "UNVERIFIED",     label: "Unverified" },
];

const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  AVAILABLE:      { label: "Available",      dot: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  IN_NEGOTIATION: { label: "In Negotiation", dot: "bg-amber-500",   badge: "bg-amber-100 text-amber-700 border-amber-200" },
  LEASED:         { label: "Leased",         dot: "bg-blue-500",    badge: "bg-blue-100 text-blue-700 border-blue-200" },
  HIDDEN:         { label: "Hidden",         dot: "bg-stone-400",   badge: "bg-stone-100 text-stone-500 border-stone-200" },
  UNVERIFIED:     { label: "Unverified",     dot: "bg-orange-400",  badge: "bg-orange-100 text-orange-700 border-orange-200" },
  REJECTED:       { label: "Rejected",       dot: "bg-red-400",     badge: "bg-red-100 text-red-600 border-red-200" },
};

function LandCard({ land }: { land: any }) {
  const updateStatus = useUpdateLandStatus();
  const config = STATUS_CONFIG[land.status] ?? { label: land.status, dot: "bg-gray-400", badge: "bg-gray-100 text-gray-600" };

  const handleToggleVisibility = async () => {
    const newStatus = land.status === "HIDDEN" ? "AVAILABLE" : "HIDDEN";
    try {
      await updateStatus.mutateAsync({ landId: land.id, status: newStatus });
      toast.success(`Land ${newStatus === "HIDDEN" ? "hidden" : "made visible"}`);
    } catch {
      toast.error("Failed to update land status");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow group">
      {/* Image */}
      <div className="relative h-48 bg-stone-100 overflow-hidden">
        {land.galleryUrls?.[0] ? (
          <img
            src={land.galleryUrls[0]}
            alt={land.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="h-12 w-12 text-stone-200" />
          </div>
        )}

        {/* Status dot overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
          <span className={`w-2 h-2 rounded-full ${config.dot}`} />
          <span className="text-xs font-bold text-stone-700">{config.label}</span>
        </div>

        {/* More menu */}
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white rounded-full shadow-sm"
              >
                <MoreVertical className="h-4 w-4 text-stone-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuItem asChild>
                <Link href={`/landowner-dashboard/my-lands/${land.id}/applications`} className="gap-2">
                  <FileText className="h-4 w-4 text-stone-500" />
                  View Applications
                </Link>
              </DropdownMenuItem>
              {(land.status === "AVAILABLE" || land.status === "HIDDEN") && (
                <DropdownMenuItem onClick={handleToggleVisibility} className="gap-2">
                  {land.status === "HIDDEN" ? (
                    <><Eye className="h-4 w-4 text-emerald-600" /> Make Visible</>
                  ) : (
                    <><EyeOff className="h-4 w-4 text-stone-500" /> Hide Land</>
                  )}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-black text-stone-900 text-sm leading-tight truncate">{land.title}</h3>
        <div className="flex items-center gap-1 mt-1 text-stone-400">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="text-xs truncate">{land.location}</span>
        </div>

        {/* Size info */}
        {land.sqMtr && (
          <p className="text-xs text-stone-500 mt-2">
            <span className="font-bold text-stone-700">{land.sqMtr.toFixed(0)} m²</span>
          </p>
        )}

        {/* Price */}
        {land.pricePerMonth && (
          <p className="text-xs text-stone-500 mt-0.5">
            <span className="font-black text-emerald-700">Rs. {land.pricePerMonth.toLocaleString()}</span>
            <span className="text-stone-400"> / month</span>
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <Link href={`/landowner-dashboard/my-lands/${land.id}/applications`} className="flex-1">
            <Button
              size="sm"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold h-8"
            >
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Applications
            </Button>
          </Link>
          {(land.status === "AVAILABLE" || land.status === "HIDDEN") && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleToggleVisibility}
              disabled={updateStatus.isPending}
              className="rounded-xl h-8 w-8 p-0 border-stone-200"
              title={land.status === "HIDDEN" ? "Make visible" : "Hide"}
            >
              {land.status === "HIDDEN" ? (
                <Eye className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <EyeOff className="h-3.5 w-3.5 text-stone-400" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyLandsPage() {
  const [filter, setFilter]   = useState<LandStatus>("ALL");
  const [search, setSearch]   = useState("");
  const { data, isLoading }   = useGetMyLands();

  const lands: any[] = data?.lands ?? [];

  const filtered = lands.filter((land) => {
    const matchStatus = filter === "ALL" || land.status === filter;
    const matchSearch =
      !search ||
      land.title?.toLowerCase().includes(search.toLowerCase()) ||
      land.location?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = lands.reduce((acc: Record<string, number>, land: any) => {
    acc[land.status] = (acc[land.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900">My Lands</h1>
          <p className="text-stone-500 text-sm mt-1">
            {lands.length} land{lands.length !== 1 ? "s" : ""} listed
          </p>
        </div>
        <Link href="/landowner-dashboard/list-land">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-bold shadow-sm">
            <PlusCircle className="h-4 w-4" />
            Add Land
          </Button>
        </Link>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or location…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                filter === f.value
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
              }`}
            >
              {f.label}
              {f.value !== "ALL" && counts[f.value] ? (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                  filter === f.value ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"
                }`}>
                  {counts[f.value]}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 py-24 text-center">
          <MapPin className="h-12 w-12 text-stone-200 mx-auto mb-4" />
          <p className="text-stone-600 font-bold">
            {search ? "No lands match your search" : "No lands in this category"}
          </p>
          <p className="text-stone-400 text-sm mt-1">
            {!search && filter === "ALL" && "List your first land to get started"}
          </p>
          {filter === "ALL" && !search && (
            <Link href="/landowner-dashboard/list-land">
              <Button size="sm" className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold">
                <PlusCircle className="h-4 w-4 mr-1.5" /> List a Land
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((land: any) => (
            <LandCard key={land.id} land={land} />
          ))}
        </div>
      )}
    </div>
  );
}