// FRONTEND: components/chat/ChatWidget.tsx
//
// Floating chat widget — shown on dashboard pages when the user
// has an active escrow with a chatChannelId.
//
// Usage:
//   <ChatWidget channelId="lease-69aed1e47ff72560599135b5" />
//
// Install deps first:
//   npm install stream-chat stream-chat-react
//   npm install --save-dev @types/stream-chat-react  (if needed)

'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
} from 'stream-chat-react';
import { StreamChat, Channel as StreamChannel } from 'stream-chat';
import { MessageSquare, X, Minimize2, Maximize2 } from 'lucide-react';
import 'stream-chat-react/dist/css/v2/index.css';

interface ChatWidgetProps {
  channelId: string;
}

type WidgetState = 'closed' | 'minimized' | 'open';

export default function ChatWidget({ channelId }: ChatWidgetProps) {
  const [widgetState, setWidgetState] = useState<WidgetState>('closed');
  const [client,      setClient]      = useState<StreamChat | null>(null);
  const [channel,     setChannel]     = useState<StreamChannel | null>(null);
  const [unread,      setUnread]      = useState(0);
  const [error,       setError]       = useState('');
  const clientRef = useRef<StreamChat | null>(null);

  // ── Connect to Stream on first open ────────────────────────────────────────
  useEffect(() => {
    if (widgetState === 'closed' || clientRef.current) return;

    let cancelled = false;

    async function connect() {
      try {
        // Get token from our API route
        const res  = await fetch('/api/chat/token');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Token fetch failed');

        const { token, userId, name, image, apiKey } = data;

        const streamClient = StreamChat.getInstance(apiKey);

        await streamClient.connectUser({ id: userId, name, image }, token);

        const ch = streamClient.channel('messaging', channelId);
        await ch.watch();

        if (cancelled) {
          await streamClient.disconnectUser();
          return;
        }

        clientRef.current = streamClient;
        setClient(streamClient);
        setChannel(ch);

        // Track unread when minimized
        streamClient.on('message.new', (event) => {
          if (event.channel_id === channelId) {
            setUnread((n) => n + 1);
          }
        });
      } catch (err: any) {
        console.error('[ChatWidget]', err);
        setError(err?.message ?? 'Could not connect to chat');
      }
    }

    connect();

    return () => {
      cancelled = true;
    };
  }, [widgetState, channelId]);

  // ── Disconnect on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clientRef.current?.disconnectUser();
      clientRef.current = null;
    };
  }, []);

  // ── Clear unread when opened ────────────────────────────────────────────────
  useEffect(() => {
    if (widgetState === 'open') setUnread(0);
  }, [widgetState]);

  const toggle = () => {
    setWidgetState((s) => {
      if (s === 'closed' || s === 'minimized') return 'open';
      return 'minimized';
    });
  };

  const close = (e: React.MouseEvent) => {
    e.stopPropagation();
    setWidgetState('closed');
  };

  // ── Fab button ──────────────────────────────────────────────────────────────
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Chat panel */}
      {widgetState === 'open' && (
        <div
          className="w-[360px] h-[520px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white flex flex-col"
          style={{ animation: 'slideUp 0.2s ease-out' }}
        >
          {/* Custom header bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-emerald-600 text-white shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-sm font-bold">Lease Chat</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWidgetState('minimized')}
                className="hover:bg-emerald-500 rounded-md p-1 transition-colors"
              >
                <Minimize2 size={14} />
              </button>
              <button
                onClick={close}
                className="hover:bg-emerald-500 rounded-md p-1 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Stream Chat UI */}
          {error ? (
            <div className="flex-1 flex items-center justify-center p-6 text-center">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : !client || !channel ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <div className="h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">Connecting…</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden [&_.str-chat]:h-full [&_.str-chat__container]:h-full">
              <Chat client={client} theme="str-chat__theme-light">
                <Channel channel={channel}>
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

      {/* Minimized bar */}
      {widgetState === 'minimized' && (
        <div
          onClick={() => setWidgetState('open')}
          className="flex items-center gap-3 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg cursor-pointer hover:bg-emerald-700 transition-colors"
          style={{ animation: 'slideUp 0.15s ease-out' }}
        >
          <MessageSquare size={16} />
          <span className="text-sm font-bold">Lease Chat</span>
          {unread > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
          <Maximize2 size={14} className="opacity-70" />
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={toggle}
        className="relative h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        aria-label="Open chat"
      >
        <MessageSquare size={22} />
        {unread > 0 && widgetState !== 'open' && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}