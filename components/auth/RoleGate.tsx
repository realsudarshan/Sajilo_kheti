"use client";

import { useGetMe } from "@/queryandmutation/index";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function RoleGate({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, error } = useGetMe();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const isAdminPath = pathname.startsWith('/admin');
  const isOwnerPath = pathname.startsWith('/landowner-dashboard');
  const isLeaserPath = pathname.startsWith('/dashboard');

  const isAuthorized = user ? (
    (user.role === 'ADMIN' && isAdminPath) ||
    (user.role === 'OWNER' && isOwnerPath) ||
    (user.role === 'LEASER' && isLeaserPath)
  ) : false;

  useEffect(() => {
    console.log('RoleGate Check:', { user, pathname, isAdminPath, isOwnerPath, isLeaserPath, isAuthorized, error });
    if (isLoading) return;

    // 1. Unauthenticated (or error fetching user)
    if (!user) {
      if (error) {
        // If there's an error, don't blindly redirect hook into a loop, let the UI show it below.
        return;
      }
      setIsRedirecting(true);
      router.replace('/login');
      return;
    }

    // 2. Unauthorized (Wrong role for this path)
    if (!isAuthorized) {
      setIsRedirecting(true);
      
      // Send them to their specific home base
      if (user.role === 'ADMIN') {
        router.replace('/admin');
      } else if (user.role === 'OWNER') {
        router.replace('/landowner-dashboard/dashboard');
      } else {
        router.replace('/dashboard');
      }
    } else {
      setIsRedirecting(false);
    }
  }, [user, isLoading, isAuthorized, router, error]);

  // Prevent flash of content
  if (isLoading || isRedirecting || (!isAuthorized && !error)) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md mt-20 p-6 bg-red-50 text-red-700 rounded-xl border border-red-200">
        <h3 className="font-bold text-lg mb-2">Access Error</h3>
        <p className="font-mono text-sm break-all">{error.message || String(error)}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded font-bold text-sm shadow hover:bg-red-700">Force Retry</button>
      </div>
    );
  }

  return <>{children}</>;
}





