// FILE: components/application/ApplicationCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Landmark,
  MessageSquare,
  Banknote,
  Navigation,
  Loader2,
  Paperclip,
} from "lucide-react";

interface ApplicationCardProps {
  app: any;
  escrow: any | null;
  onAction: (id: string, action: "ACCEPT" | "REJECT") => void;
  isAccepting: boolean;
  isRejecting: boolean;
  getStatusConfig: (status: string) => string;
  /** Called when the Chat button is clicked — opens the correct channel */
  onChatOpen?: (channelId: string) => void;
}

export function ApplicationCard({
  app,
  escrow,
  onAction,
  isAccepting,
  isRejecting,
  getStatusConfig,
  onChatOpen,
}: ApplicationCardProps) {
  const hasEscrow = !!escrow;
  const landId    = app.land?.id || app.landId;

  // Chat is only available once escrow is active and channel exists
  const chatChannelId = escrow?.chatChannelId ?? null;
  const canChat       = hasEscrow && !!chatChannelId;

  return (
    <Card
      className={`relative overflow-hidden border-0 shadow-lg bg-white dark:bg-zinc-950 ring-1 transition-all duration-300 ${
        hasEscrow
          ? "ring-emerald-500/40 shadow-emerald-100/20"
          : "ring-zinc-200 dark:ring-zinc-800"
      }`}
    >
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">

          {/* 1. Applicant Profile */}
          <div className="p-6 flex-1 border-b lg:border-b-0 lg:border-r border-zinc-100 dark:border-zinc-800">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="h-14 w-14 rounded-2xl shadow-inner border-2 border-white dark:border-zinc-800">
                  <AvatarImage src={app.leaser?.image} className="object-cover" />
                  <AvatarFallback className="bg-emerald-50 text-emerald-600">
                    {app.leaser?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {hasEscrow && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white dark:border-zinc-950">
                    <Shield className="h-3 w-3" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {app.leaser?.name}
                </h4>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusConfig(app.status)} text-[9px] uppercase font-bold py-0.5`}>
                    {app.status}
                  </Badge>
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">
                    {app.leaseDurationInMonths} Months Lease
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
              <p className="text-xs italic text-zinc-500 leading-relaxed">
                "{app.plans || "No specific plans provided."}"
              </p>
            </div>
          </div>

          {/* 2. Escrow & Financial Ledger */}
          <div className="p-6 flex-1 bg-zinc-50/50 dark:bg-zinc-900/20">
            <p className="text-[10px] font-black uppercase text-zinc-400 mb-4 tracking-widest flex items-center gap-2">
              <Banknote className="h-3 w-3" /> Financial Details
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-500">Proposed Rent:</span>
                <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                  Rs. {app.proposedMonthlyRent?.toLocaleString()}
                </span>
              </div>

              {hasEscrow ? (
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-emerald-600 font-bold">Securely Held:</span>
                    <span className="text-sm font-black text-emerald-600">
                      Rs. {escrow.amount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Service Fee:</span>
                    <span className="text-xs font-bold text-red-500">
                      - Rs. {escrow.commission?.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-[9px] font-black animate-pulse"
                    >
                      ESCROW ACTIVE: {escrow.status}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="pt-2">
                  <p className="text-[10px] text-amber-600 font-bold bg-amber-50 dark:bg-amber-950/20 p-2 rounded-lg border border-amber-100 dark:border-amber-900/30">
                    Waiting for initial deposit to activate Escrow protections.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 3. Actions */}
          <div className="p-6 flex flex-col justify-center gap-2.5 min-w-[240px] bg-white dark:bg-zinc-950">
            {app.status === "PENDING" ? (
              <div className="space-y-2 w-full">
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 font-bold shadow-lg shadow-emerald-100 dark:shadow-none transition-transform active:scale-95"
                  onClick={() => onAction(app.id, "ACCEPT")}
                  disabled={isAccepting || isRejecting}
                >
                  {isAccepting ? <Loader2 className="animate-spin h-4 w-4" /> : "Accept Proposal"}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl h-10 font-bold"
                  onClick={() => onAction(app.id, "REJECT")}
                  disabled={isAccepting || isRejecting}
                >
                  {isRejecting ? <Loader2 className="animate-spin h-4 w-4" /> : "Decline"}
                </Button>
              </div>
            ) : (
              <div className="space-y-2 w-full">
                <Link href={`/landowner-dashboard/navigate/malpot/${landId}`} className="w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start rounded-xl h-9 text-[11px] font-bold border-amber-200 text-amber-700 bg-amber-50/50 hover:bg-amber-100 transition-colors"
                  >
                    <Landmark className="h-3.5 w-3.5 mr-2" /> Live Malpot Navigation
                  </Button>
                </Link>

                <Link href={`/landowner-dashboard/navigate/land/${landId}`} className="w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start rounded-xl h-9 text-[11px] font-bold border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100 transition-colors"
                  >
                    <Navigation className="h-3.5 w-3.5 mr-2" /> Live Field Navigation
                  </Button>
                </Link>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  {/* ✅ Clean onChatOpen callback — no more DOM hacks */}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-xl h-9 text-[10px] font-bold"
                    disabled={!canChat}
                    title={!canChat ? "Chat unlocks after escrow payment" : undefined}
                    onClick={() => canChat && onChatOpen?.(chatChannelId)}
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                    {canChat ? "Chat" : "Chat 🔒"}
                  </Button>

                  {escrow?.id && (
                    <Link href={`/verify-agreement/${escrow.id}`} className="w-full">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full rounded-xl h-9 text-[10px] font-bold"
                      >
                        <Paperclip className="h-3.5 w-3.5 mr-1.5" /> Verify Malpot
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Helper text when chat not yet unlocked */}
                {!canChat && hasEscrow && (
                  <p className="text-[10px] text-zinc-400 text-center mt-1">
                    Chat unlocks once escrow payment is confirmed
                  </p>
                )}
              </div>
            )}
          </div>

        </div>
      </CardContent>
    </Card>
  );
}