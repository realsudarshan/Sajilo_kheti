// FILE: app/landowner-dashboard/my-lands/[id]/applications/page.tsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  MessageSquare,
  Loader2,
  User,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetLandById,
  useGetAllApplications,
  useAcceptLeaseApplication,
  useRejectLeaseApplication,
} from "@/queryandmutation";
import { toast } from "sonner";

export default function LandApplicationsPage() {
  const params = useParams();
  const landId = params.id as string;
  const [processingId, setProcessingId] = useState<string | null>(null);

  // 1. Fetching Data
  const { data: land, isLoading: landLoading } = useGetLandById(landId);
  const { data: appsData, isLoading: appsLoading, refetch } = useGetAllApplications({ landId });
  
  const acceptMutation = useAcceptLeaseApplication();
  const rejectMutation = useRejectLeaseApplication();

  // 2. Extracting nested data correctly based on your provided types
  // landData is the object itself
  // appsData is { applications: [...], total: number }
  const applications = appsData?.applications ?? [];
  const totalApps = appsData?.total ?? 0;

  // 3. Logic Handlers
  const handleAccept = async (applicationId: string) => {
    setProcessingId(applicationId);
    try {
      await acceptMutation.mutateAsync({ applicationId });
      toast.success("Application accepted!");
      refetch();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to accept");
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
      toast.error(err?.message ?? "Failed to reject");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        href="/landowner-dashboard/my-lands"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Lands
      </Link>

      {/* Land Info Banner */}
      {landLoading ? (
        <Skeleton className="h-24 rounded-2xl" />
      ) : land && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0">
            <img 
              src={land.heroImageUrl || land.galleryUrls?.[0] || ""} 
              alt={land.title} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-stone-900 text-lg truncate">{land.title}</h1>
            <div className="flex items-center gap-1 text-sm text-stone-400 mt-0.5">
              <MapPin className="h-3.5 w-3.5" />
              {land.location}
            </div>
          </div>
        </div>
      )}

      {/* Applications Header */}
      <div>
        <h2 className="text-xl font-black text-stone-900">Applications</h2>
        <p className="text-stone-500 text-sm mt-1">
          {totalApps} application{totalApps !== 1 ? "s" : ""} for this land
        </p>
      </div>

      {/* Applications List */}
      {appsLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 py-20 text-center">
          <MessageSquare className="h-12 w-12 text-stone-200 mx-auto mb-4" />
          <p className="text-stone-600 font-bold">No applications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const isPending = app.status === "PENDING";
            const isAccepted = app.status === "ACCEPTED";
            const isRejected = app.status === "REJECTED";

            return (
              <div key={app.id} className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-stone-500" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-stone-900">
                        {app.leaser?.name || "Anonymous Applicant"}
                      </p>
                      <p className="text-xs text-stone-400">
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Badge className={`text-[10px] font-black border-none px-2 py-0.5 ${
                    isAccepted ? "bg-emerald-100 text-emerald-700" :
                    isRejected ? "bg-red-100 text-red-600" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {app.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="bg-stone-50 rounded-xl px-3 py-2">
                    <p className="text-[10px] text-stone-400 font-bold uppercase">Proposed Rent</p>
                    <p className="text-sm font-black text-emerald-700">Rs. {app.proposedMonthlyRent?.toLocaleString()}</p>
                  </div>
                </div>

                {/* Actions */}
                {isPending && (
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleAccept(app.id)}
                      disabled={!!processingId}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold h-9 gap-2"
                    >
                      {processingId === app.id && acceptMutation.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      )}
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(app.id)}
                      disabled={!!processingId}
                      className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl font-bold h-9 gap-2"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}