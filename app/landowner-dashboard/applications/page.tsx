// FILE: app/landowner-dashboard/applications/page.tsx
// Shows all applications across all the owner's lands.
// When Chat button is clicked on a card, opens that specific lease channel.
"use client";

import { useState } from "react";
import { useGetAllApplications, useGetMyOwnerEscrows, useAcceptLeaseApplication, useRejectLeaseApplication } from "@/queryandmutation";
import { ApplicationCard } from "@/components/application/ApplicationCard";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

const STATUSES = ["ALL", "PENDING", "ACCEPTED", "REJECTED"] as const;

export default function ApplicationsPage() {
  const [activeTab, setActiveTab]         = useState("ALL");
  const [openChannelId, setOpenChannelId] = useState<string | null>(null);

  const { data,      isLoading }  = useGetAllApplications({});
  const { data: escrowData }      = useGetMyOwnerEscrows();
  const { mutate: accept, isPending: isAccepting } = useAcceptLeaseApplication();
  const { mutate: reject, isPending: isRejecting } = useRejectLeaseApplication();

  const applications = data?.applications ?? [];
  const escrows      = escrowData?.escrows ?? [];

  // Build a map of applicationId → escrow for O(1) lookup
  const escrowByAppId = escrows.reduce((acc: Record<string, any>, e: any) => {
    if (e.applicationId) acc[e.applicationId] = e;
    return acc;
  }, {});

  const filtered = activeTab === "ALL"
    ? applications
    : applications.filter((a: any) => a.status === activeTab);

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = s === "ALL"
      ? applications.length
      : applications.filter((a: any) => a.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  function handleAction(id: string, action: "ACCEPT" | "REJECT") {
    if (action === "ACCEPT") {
      accept({ applicationId: id }, {
        onSuccess: () => toast.success("Application accepted"),
        onError:   () => toast.error("Failed to accept"),
      });
    } else {
      reject({ applicationId: id }, {
        onSuccess: () => toast.success("Application rejected"),
        onError:   () => toast.error("Failed to reject"),
      });
    }
  }

  function getStatusConfig(status: string) {
    return {
      PENDING:  "bg-amber-100 text-amber-700 border-amber-200",
      ACCEPTED: "bg-emerald-100 text-emerald-700 border-emerald-200",
      REJECTED: "bg-red-100 text-red-600 border-red-200",
    }[status] ?? "bg-zinc-100 text-zinc-600";
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-900">Applications</h1>
        <p className="text-sm text-stone-500 mt-1">All lease applications across your lands</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="rounded-xl bg-stone-100">
          {STATUSES.map((s) => (
            <TabsTrigger key={s} value={s} className="rounded-lg text-xs font-bold gap-1.5">
              {s}
              <span className="bg-white/70 text-stone-600 rounded-full px-1.5 py-0.5 text-[10px] font-black">
                {counts[s]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {STATUSES.map((s) => (
          <TabsContent key={s} value={s} className="mt-4 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-16 text-stone-400">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-stone-400 gap-2">
                <FileText className="h-10 w-10 text-stone-200" />
                <p className="text-sm font-medium">No {s === "ALL" ? "" : s.toLowerCase()} applications</p>
              </div>
            ) : (
              filtered.map((app: any) => (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  escrow={escrowByAppId[app.id] ?? null}
                  onAction={handleAction}
                  isAccepting={isAccepting}
                  isRejecting={isRejecting}
                  getStatusConfig={getStatusConfig}
                  // ✅ Wire chat: tell ChatProvider which channel to open
                  onChatOpen={(channelId) => setOpenChannelId(channelId)}
                />
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Floating chat — openChannelId tells it which conversation to show */}
      <ChatProvider role="owner" openChannelId={openChannelId} />
    </div>
  );
}