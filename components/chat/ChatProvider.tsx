// FILE: components/chat/ChatProvider.tsx
// Multi-chat manager. One FAB — clicking shows a list of active lease chats.
// Pass openChannelId to jump straight to a specific channel (e.g. from Chat button on ApplicationCard).
//
// Usage:
//   <ChatProvider role="owner" />
//   <ChatProvider role="leaser" />
//   <ChatProvider role="owner" openChannelId={channelId} />  ← jumps straight to that chat

"use client";

import { useEffect, useRef, useState } from "react";
import {
  Chat, Channel, Window, MessageList, MessageInput, Thread,
} from "stream-chat-react";
import { StreamChat, Channel as StreamChannel } from "stream-chat";
import { MessageSquare, X, ChevronLeft, Users, Loader2 } from "lucide-react";
import "stream-chat-react/dist/css/v2/index.css";
import { useGetMyEscrows, useGetMyOwnerEscrows } from "@/queryandmutation";

interface EscrowChat {
  channelId:   string;
  partnerName: string;
  landTitle:   string;
}

type PanelState = "closed" | "list" | "chat";

interface ChatProviderProps {
  role:           "owner" | "leaser";
  openChannelId?: string | null; // when set, jumps directly to that channel
}

export function ChatProvider({ role, openChannelId }: ChatProviderProps) {
  const ownerQuery  = useGetMyOwnerEscrows({ enabled: role === "owner" });
  const leaserQuery = useGetMyEscrows({ enabled: role === "leaser" });

  const escrows = role === "owner"
    ? (ownerQuery.data?.escrows  ?? [])
    : (leaserQuery.data?.escrows ?? []);

  const activeChats: EscrowChat[] = escrows
    .filter((e: any) => e.chatChannelId && e.status !== "RELEASED" && e.status !== "REFUNDED")
    .map((e: any) => ({
      channelId:   e.chatChannelId,
      landTitle:   e.land?.title ?? e.application?.land?.title ?? "Land",
      partnerName: role === "owner"
        ? (e.leaser?.name ?? e.leaserName ?? "Leaser")
        : (e.owner?.name  ?? e.ownerName  ?? "Land Owner"),
    }));

  if (activeChats.length === 0) return null;

  return (
    <ChatManager
      chats={activeChats}
      openChannelId={openChannelId ?? null}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function ChatManager({
  chats,
  openChannelId,
}: {
  chats:          EscrowChat[];
  openChannelId:  string | null;
}) {
  const [panelState,      setPanelState]      = useState<PanelState>("closed");
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [totalUnread,     setTotalUnread]     = useState(0);
  const [client,          setClient]          = useState<StreamChat | null>(null);
  const [channels,        setChannels]        = useState<Record<string, StreamChannel>>({});
  const [channelUnread,   setChannelUnread]   = useState<Record<string, number>>({});
  const [connecting,      setConnecting]      = useState(false);
  const [error,           setError]           = useState("");
  const clientRef = useRef<StreamChat | null>(null);

  // Connect to Stream once on mount
  useEffect(() => {
    if (clientRef.current) return;
    let cancelled = false;

    async function connect() {
      console.log('[ChatProvider] connect() start. chats length =', chats.length);
      setConnecting(true);
      try {
        const res  = await fetch("/api/chat/token");
        console.log("[ChatProvider] /api/chat/token status:", res.status);
        const data = await res.json();
        if (!res.ok) {
          console.error("[ChatProvider] Token fetch failed:", data);
          throw new Error(data.error ?? "Token fetch failed");
        }

        const { token, userId, name, image, apiKey } = data;
        console.log("[ChatProvider] Token payload:", {
          hasToken: !!token,
          userId,
          hasApiKey: !!apiKey,
        });

        // Use a dedicated client instance for this provider so that
        // other widgets disconnecting their clients do not affect this one.
        const sc = new StreamChat(apiKey);
        console.log("[ChatProvider] Calling connectUser for", userId);
        await sc.connectUser({ id: userId, name, image }, token);
        console.log("[ChatProvider] connectUser success for", userId);

        if (cancelled) { await sc.disconnectUser(); return; }

        clientRef.current = sc;
        setClient(sc);

        const map: Record<string, StreamChannel> = {};
        for (const chat of chats) {
          const ch = sc.channel("messaging", chat.channelId);
          console.log("[ChatProvider] Watching channel", chat.channelId);
          await ch.watch();
          map[chat.channelId] = ch;
        }
        setChannels(map);

        sc.on("connection.changed", (e: any) => {
          console.log("[ChatProvider] connection.changed:", {
            online: e.online,
            type: e.type,
            eventType: (e as any).eventType,
          });
        });

        sc.on("message.new", (event) => {
          const cid = event.channel_id;
          if (cid) {
            setChannelUnread((prev) => ({ ...prev, [cid]: (prev[cid] ?? 0) + 1 }));
            setTotalUnread((n) => n + 1);
          }
        });
      } catch (err: any) {
        console.error("[ChatProvider] connect() error:", err);
        if (!cancelled) setError(err?.message ?? "Could not connect to chat");
      } finally {
        if (!cancelled) setConnecting(false);
      }
    }

    connect();
    return () => {
      cancelled = true;
      clientRef.current?.disconnectUser();
      clientRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When a card's Chat button passes openChannelId, jump straight to that chat
  useEffect(() => {
    if (!openChannelId) return;
    setActiveChannelId(openChannelId);
    setPanelState("chat");
    setChannelUnread((prev) => ({ ...prev, [openChannelId]: 0 }));
    setTotalUnread((prev) => Math.max(0, prev - (channelUnread[openChannelId] ?? 0)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openChannelId]);

  function openChat(channelId: string) {
    setActiveChannelId(channelId);
    setPanelState("chat");
    setChannelUnread((prev) => ({ ...prev, [channelId]: 0 }));
    setTotalUnread((prev) => Math.max(0, prev - (channelUnread[channelId] ?? 0)));
  }

  const activeChat    = chats.find((c) => c.channelId === activeChannelId);
  const activeChannel = activeChannelId ? channels[activeChannelId] : null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* ── Panel ──────────────────────────────────────────────── */}
      {panelState !== "closed" && (
        <div
          className="w-[360px] rounded-2xl overflow-hidden shadow-2xl border border-stone-200 bg-white flex flex-col"
          style={{
            height: panelState === "list" ? "auto" : "520px",
            animation: "chatSlideUp 0.2s ease-out",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-emerald-600 text-white shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              {panelState === "chat" && (
                <button
                  onClick={() => setPanelState(chats.length > 1 ? "list" : "closed")}
                  className="hover:bg-emerald-500 rounded-md p-1 transition-colors shrink-0"
                >
                  <ChevronLeft size={15} />
                </button>
              )}
              <div className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse shrink-0" />
              <span className="text-sm font-bold truncate">
                {panelState === "chat" && activeChat
                  ? activeChat.partnerName
                  : "Lease Chats"}
              </span>
              {panelState === "chat" && activeChat && (
                <span className="text-[10px] text-emerald-200 truncate hidden sm:block">
                  · {activeChat.landTitle}
                </span>
              )}
            </div>
            <button
              onClick={() => setPanelState("closed")}
              className="hover:bg-emerald-500 rounded-md p-1 transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </div>

          {/* List view */}
          {panelState === "list" && (
            <div className="flex flex-col divide-y divide-stone-100">
              {connecting && (
                <div className="flex items-center justify-center gap-2 py-8 text-stone-400">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Connecting…</span>
                </div>
              )}
              {error && (
                <div className="p-4 text-sm text-red-500 text-center">{error}</div>
              )}
              {!connecting && !error && chats.map((chat) => {
                const unread = channelUnread[chat.channelId] ?? 0;
                return (
                  <button
                    key={chat.channelId}
                    onClick={() => openChat(chat.channelId)}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-stone-50 transition-colors text-left w-full"
                  >
                    <div className="h-9 w-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                      <Users size={16} className="text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-stone-900 truncate">{chat.partnerName}</p>
                      <p className="text-xs text-stone-400 truncate">{chat.landTitle}</p>
                    </div>
                    {unread > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shrink-0">
                        {unread > 9 ? "9+" : unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Chat view */}
          {panelState === "chat" && (
            <div className="flex-1 overflow-hidden">
              {!client || !activeChannel ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-stone-400">
                  <Loader2 size={20} className="animate-spin" />
                  <span className="text-xs">Loading messages…</span>
                </div>
              ) : (
                <div className="h-full [&_.str-chat]:h-full [&_.str-chat__container]:h-full">
                  <Chat client={client} theme="str-chat__theme-light">
                    <Channel channel={activeChannel}>
                      <Window>
                        <MessageList />
                        <MessageInput />
                      </Window>
                      <Thread />
                    </Channel>
                  </Chat>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── FAB ────────────────────────────────────────────────── */}
      <button
        onClick={() => {
          if (panelState !== "closed") { setPanelState("closed"); return; }
          chats.length === 1 ? openChat(chats[0].channelId) : setPanelState("list");
        }}
        className="relative h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        aria-label="Open lease chat"
      >
        <MessageSquare size={22} />
        {totalUnread > 0 && panelState === "closed" && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {totalUnread > 9 ? "9+" : totalUnread}
          </span>
        )}
      </button>

      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}