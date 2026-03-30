'use client'

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const STORAGE_KEY = "sajilokheti:admin:prefs";
const ALLOWED = new Set([
  "/admin",
  "/admin/analytics",
  "/admin/events",
  "/admin/settings",
]);

export function LandingRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    // Only redirect from the root admin landing.
    if (pathname !== "/admin" && pathname !== "/admin/") return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { landing?: string };
      const target = parsed?.landing;
      if (!target || !ALLOWED.has(target)) return;
      if (target === pathname || target === "/admin/") return;
      router.replace(target);
    } catch {
      // If parsing fails, do nothing.
    }
  }, [pathname, router]);

  return null;
}
