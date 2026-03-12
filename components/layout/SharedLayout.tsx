// components/layout/SharedLayout.tsx
"use client";

import { useGetMe } from "@/queryandmutation";
import { LeaserSidebar } from "@/components/dashboard/LeaserSidebar";
import { LandownerSidebar } from "@/components/landowner/LandownerSidebar";
import { ChatProvider } from "@/components/chat/ChatProvider";

export function SharedLayout({ children }: { children: React.ReactNode }) {
  const { data: me, isLoading } = useGetMe();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F6F7F5]">
        <span className="text-stone-500 font-medium">Loading...</span>
      </div>
    );
  }

  const isLandowner = me?.role === "OWNER" || me?.role === "ADMIN";

  return (
    <div className="flex min-h-screen bg-[#F6F7F5] font-sans">
      {/* Sidebar rendered based on role */}
      {isLandowner ? <LandownerSidebar /> : <LeaserSidebar />}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 pb-16 lg:pb-0 min-h-screen relative">
        {children}
        <ChatProvider role={isLandowner ? "owner" : "leaser"} />
      </main>
    </div>
  );
}
