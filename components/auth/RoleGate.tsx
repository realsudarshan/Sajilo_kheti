"use client";

import { useGetMe } from "@/queryandmutation/index";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function RoleGate({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useGetMe();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const isAdminPath = pathname.startsWith('/admin');
  const isOwnerPath = pathname.startsWith('/landowner-dashboard');
  const isLeaserPath = pathname.startsWith('/dashboard');

  // STRICT AUTHORIZATION LOGIC
  // Returns true ONLY if the user is on their assigned dashboard
  const isAuthorized = user ? (
    (user.role === 'ADMIN' && isAdminPath) ||
    (user.role === 'OWNER' && isOwnerPath) ||
    (user.role === 'LEASER' && isLeaserPath)
  ) : false;
console.log('RoleGate Render:', { user, pathname, isAdminPath, isOwnerPath, isLeaserPath, isAuthorized });
  useEffect(() => {
    console.log('RoleGate Check:', { user, pathname, isAdminPath, isOwnerPath, isLeaserPath, isAuthorized });
    if (isLoading) return;

    // 1. Unauthenticated
    if (!user) {
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
  }, [user, isLoading, isAuthorized, router]);

  // Prevent flash of content
  if (isLoading || isRedirecting || !isAuthorized) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}





