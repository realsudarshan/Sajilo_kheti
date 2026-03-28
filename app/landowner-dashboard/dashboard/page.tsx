"use client";

import Link from "next/link";
import {
  MapPin,
  FileText,
  Wallet,
  PlusCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Eye,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetMe,
  useGetMyLands,
  useGetAllApplications,
  useGetMyOwnerEscrows,
} from "@/queryandmutation";
import { useUser } from "@clerk/nextjs";
import { EnablePushNotifications } from "@/components/ui/enable-push-notifications";

// ─── Status badge helper ──────────────────────────────────────────────────────
const LandStatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { label: string; className: string }> = {
    AVAILABLE:      { label: "Available",      className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    IN_NEGOTIATION: { label: "In Negotiation", className: "bg-amber-100 text-amber-700 border-amber-200" },
    LEASED:         { label: "Leased",         className: "bg-blue-100 text-blue-700 border-blue-200" },
    HIDDEN:         { label: "Hidden",         className: "bg-stone-100 text-stone-500 border-stone-200" },
    UNVERIFIED:     { label: "Unverified",     className: "bg-orange-100 text-orange-700 border-orange-200" },
  };
  const c = config[status] ?? { label: status, className: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${c.className}`}>
      {c.label}
    </span>
  );
};

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  href?: string;
}) {
  const card = (
    <div className={`bg-white rounded-2xl border border-stone-200 p-5 hover:shadow-md transition-shadow group cursor-pointer`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        {href && (
          <ArrowRight className="h-4 w-4 text-stone-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
        )}
      </div>
      <p className="text-2xl font-black text-stone-900">{value}</p>
      <p className="text-sm font-medium text-stone-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
    </div>
  );

  if (href) return <Link href={href}>{card}</Link>;
  return card;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandownerDashboardPage() {
  const { user } = useUser();
  const { data: me, isLoading: meLoading } = useGetMe();
  const { data: landsData, isLoading: landsLoading } = useGetMyLands();
  const { data: applicationsData, isLoading: appsLoading } = useGetAllApplications({});
  const { data: escrowsData } = useGetMyOwnerEscrows();

  const lands = landsData?.lands ?? [];
  const applications = applicationsData?.applications ?? [];
  const escrows = (escrowsData as any)?.escrows ?? [];

  // ── computed stats ──
  const availableLands    = lands.filter((l: any) => l.status === "AVAILABLE").length;
  const negotiatingLands  = lands.filter((l: any) => l.status === "IN_NEGOTIATION").length;
  const leasedLands       = lands.filter((l: any) => l.status === "LEASED").length;
  const pendingApps       = applications.filter((a: any) => a.status === "PENDING").length;
  const totalEarnings     = escrows
    .filter((e: any) => e.status === "RELEASED")
    .reduce((sum: number, e: any) => sum + (e.amount - (e.commission ?? 0)), 0);

  const recentApplications = [...applications]
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900">
            {greeting}, {user?.firstName ?? "Landowner"} 👋
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Here&apos;s what&apos;s happening with your lands today.
          </p>
        </div>
        <Link href="/landowner-dashboard/list-land">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-bold shadow-sm">
            <PlusCircle className="h-4 w-4" />
            List New Land
          </Button>
        </Link>
      </div>

      <EnablePushNotifications />

      {/* ── KYC warning if unverified ── */}
      {!meLoading && !me?.isKycVerified && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-800">KYC Verification Pending</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Your identity verification is under review. You can still list lands but they won&apos;t be publicly visible until approved.
            </p>
          </div>
          <Link href="/dashboard/verify-landowner">
            <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100 rounded-xl text-xs font-bold shrink-0">
              Check Status
            </Button>
          </Link>
        </div>
      )}

      {meLoading && (
        <Skeleton className="h-16 w-full rounded-2xl" />
      )}

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {landsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))
        ) : (
          <>
            <StatCard
              icon={MapPin}
              label="Total Lands"
              value={lands.length}
              sub={`${availableLands} available`}
              color="bg-emerald-100 text-emerald-600"
              href="/landowner-dashboard/my-lands"
            />
            <StatCard
              icon={Clock}
              label="In Negotiation"
              value={negotiatingLands}
              sub="Active discussions"
              color="bg-amber-100 text-amber-600"
              href="/landowner-dashboard/my-lands"
            />
            <StatCard
              icon={FileText}
              label="Pending Apps"
              value={pendingApps}
              sub="Awaiting your review"
              color="bg-blue-100 text-blue-600"
              href="/landowner-dashboard/applications"
            />
            <StatCard
              icon={Wallet}
              label="Total Earned"
              value={`Rs. ${totalEarnings.toLocaleString()}`}
              sub="After 5% commission"
              color="bg-violet-100 text-violet-600"
              href="/landowner-dashboard/escrow"
            />
          </>
        )}
      </div>

      {/* ── Land status breakdown ── */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-stone-900">Land Status Breakdown</h2>
          <Link href="/landowner-dashboard/my-lands" className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {landsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
          </div>
        ) : lands.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-10 w-10 text-stone-200 mx-auto mb-3" />
            <p className="text-stone-500 font-medium text-sm">No lands listed yet</p>
            <Link href="/landowner-dashboard/list-land">
              <Button size="sm" className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold">
                + List your first land
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {lands.slice(0, 5).map((land: any) => (
              <div
                key={land.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-stone-50 transition-colors group"
              >
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden shrink-0">
                  {land.galleryUrls?.[0] ? (
                    <img src={land.galleryUrls[0]} alt={land.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <MapPin className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-stone-900 truncate">{land.title}</p>
                  <p className="text-xs text-stone-400 truncate">{land.location}</p>
                </div>

                <LandStatusBadge status={land.status} />

                <Link
                  href={`/landowner-dashboard/my-lands/${land.id}/applications`}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Button size="sm" variant="ghost" className="h-8 text-xs text-stone-500 rounded-lg">
                    <Eye className="h-3.5 w-3.5 mr-1" /> View
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Recent Applications ── */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-stone-900">Recent Applications</h2>
          <Link href="/landowner-dashboard/applications" className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1">
            Manage all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {appsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : recentApplications.length === 0 ? (
          <div className="text-center py-10">
            <FileText className="h-10 w-10 text-stone-200 mx-auto mb-3" />
            <p className="text-stone-500 font-medium text-sm">No applications received yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentApplications.map((app: any) => (
              <div
                key={app.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-stone-50 transition-colors"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  app.status === "ACCEPTED" ? "bg-emerald-100" :
                  app.status === "REJECTED" ? "bg-red-100" : "bg-amber-100"
                }`}>
                  {app.status === "ACCEPTED" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : app.status === "REJECTED" ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-amber-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-stone-800 truncate">
                    {app.land?.title ?? "Land Application"}
                  </p>
                  <p className="text-xs text-stone-400">
                    {new Date(app.createdAt).toLocaleDateString("en-NP", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </div>

                <Badge
                  className={`text-xs font-bold border-none ${
                    app.status === "ACCEPTED" ? "bg-emerald-100 text-emerald-700" :
                    app.status === "REJECTED" ? "bg-red-100 text-red-600" :
                    "bg-amber-100 text-amber-700"
                  }`}
                >
                  {app.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Quick actions ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/landowner-dashboard/list-land">
          <div className="bg-emerald-600 rounded-2xl p-5 text-white hover:bg-emerald-700 transition-colors group cursor-pointer">
            <PlusCircle className="h-6 w-6 mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-black text-sm">List New Land</p>
            <p className="text-xs text-emerald-200 mt-0.5">Add a land to the marketplace</p>
          </div>
        </Link>
        <Link href="/landowner-dashboard/applications">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-md transition-shadow group cursor-pointer">
            <FileText className="h-6 w-6 mb-3 text-stone-600 group-hover:text-emerald-600 transition-colors" />
            <p className="font-black text-sm text-stone-900">Review Applications</p>
            <p className="text-xs text-stone-400 mt-0.5">Accept or reject requests</p>
          </div>
        </Link>
        <Link href="/landowner-dashboard/escrow">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-md transition-shadow group cursor-pointer">
            <TrendingUp className="h-6 w-6 mb-3 text-stone-600 group-hover:text-emerald-600 transition-colors" />
            <p className="font-black text-sm text-stone-900">View Earnings</p>
            <p className="text-xs text-stone-400 mt-0.5">Track escrow & payments</p>
          </div>
        </Link>
      </div>
    </div>
  );
}