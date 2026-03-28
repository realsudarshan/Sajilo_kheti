"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";
import { trpc } from "@/lib/trpc"; // Adjust this path to your trpc helper

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
     httpBatchLink({
      url: process.env.NEXT_PUBLIC_TRPC_URL || 'http://127.0.0.1:8000/trpc',
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include', // Add this
        });
      },
    }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}