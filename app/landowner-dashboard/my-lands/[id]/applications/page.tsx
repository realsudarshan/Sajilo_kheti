"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  useGetAllApplications,
  useAcceptLeaseApplication,
  useRejectLeaseApplication,
  useGetMyOwnerEscrows,
} from "@/queryandmutation/index";
import { toast } from "sonner";
import { Loader2, MapPin, Inbox, ArrowLeft, Maximize2, Layers } from "lucide-react";
import ChatWidget from "@/components/chat/Chatwidget";
import { ApplicationCard } from "@/components/application/ApplicationCard"; 
import { Badge } from "@/components/ui/badge";

export default function LandApplicationsPage() {
  const { id: landId } = useParams() as { id: string };
  const { data, isLoading, refetch } = useGetAllApplications({ landId });
  const { data: escrowData } = useGetMyOwnerEscrows();

  const { mutateAsync: acceptApp, isPending: isAccepting } = useAcceptLeaseApplication();
  const { mutateAsync: rejectApp, isPending: isRejecting } = useRejectLeaseApplication();

  const applications = data?.applications || [];
  const escrows = escrowData?.escrows ?? [];
  const landInfo = applications.length > 0 ? applications[0].land : null;
  const escrowMap = new Map(escrows.map((e) => [e.applicationId, e]));

  const getStatusConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACCEPTED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "REJECTED": return "bg-red-100 text-red-700 border-red-200";
      case "PENDING":  return "bg-amber-100 text-amber-700 border-amber-200";
      default:         return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleAction = async (applicationId: string, action: "ACCEPT" | "REJECT") => {
    try {
      if (action === "ACCEPT") {
        await acceptApp({ applicationId });
        toast.success("Application Accepted!");
      } else {
        await rejectApp({ applicationId });
        toast.info("Application Rejected.");
      }
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Action failed");
    }
  };

  if (isLoading) return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin h-12 w-12 text-emerald-600" />
        <p className="font-bold text-gray-400 animate-pulse">Syncing Applications...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10">
      
      {/* --- HERO LAND DETAIL TOP --- */}
      {landInfo && (
        <div className="relative h-64 md:h-80 w-full rounded-[2.5rem] overflow-hidden shadow-2xl group">
          <img 
            src={landInfo.heroImageUrl} 
            alt={landInfo.title} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <Link href="/landowner-dashboard/my-lands" className="inline-flex items-center text-xs font-black text-emerald-400 mb-2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <ArrowLeft className="h-3 w-3 mr-1" /> BACK TO MY LANDS
              </Link>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">{landInfo.title}</h1>
              <p className="flex items-center text-emerald-50/80 font-medium">
                <MapPin className="mr-2 h-5 w-5 text-emerald-400" /> {landInfo.location}
              </p>
            </div>

            <div className="flex gap-3 md:gap-6 bg-white/10 backdrop-blur-xl p-4 rounded-[2rem] border border-white/20 shadow-2xl">
              <div className="text-center px-4 border-r border-white/10">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Size</p>
                <p className="text-xl font-black text-white">{landInfo.sizeInSqmeter.toLocaleString()} <span className="text-[10px] font-normal">m²</span></p>
              </div>
              <div className="text-center px-4">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Monthly Rate</p>
                <p className="text-xl font-black text-white">Rs. {landInfo.pricePerMonth.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- APPLICATIONS LIST --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                Lease Proposals
                <Badge className="bg-emerald-600 text-white border-0 font-black">{applications.length}</Badge>
            </h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {applications.length > 0 ? (
            applications.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                landId={landId}
                escrow={escrowMap.get(app.id) || null}
                isAccepting={isAccepting}
                isRejecting={isRejecting}
                onAction={handleAction}
                getStatusConfig={getStatusConfig}
              />
            ))
          ) : (
            <div className="text-center py-24 bg-gray-50 dark:bg-zinc-900 rounded-[3rem] border-4 border-dashed border-gray-100 dark:border-zinc-800">
              <Inbox className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400">No Applicants Yet</h3>
              <p className="text-sm text-gray-400">Your land is live. Potential farmers will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Chat Widgets */}
      {escrows.map((e) => e.chatChannelId && (
        <ChatWidget key={e.chatChannelId} channelId={e.chatChannelId} />
      ))}
    </div>
  );
}