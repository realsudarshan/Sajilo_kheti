'use client'

import { useEffect, useState, useCallback } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { RoleGate } from "@/components/auth/RoleGate";
import { LandingRedirect } from "./LandingRedirect";

const PREF_KEY = "sajilokheti:admin:prefs";

type Prefs = {
  sidebarCollapsed?: boolean;
  landing?: string;
  timezone?: string;
};

function readPrefs(): Prefs | null {
  try {
    const raw = localStorage.getItem(PREF_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Prefs;
  } catch {
    return null;
  }
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<boolean>(true);

  const applyPref = useCallback(() => {
    const prefs = readPrefs();
    if (prefs?.sidebarCollapsed === true) setOpen(false);
    else setOpen(true);
  }, []);

  useEffect(() => {
    applyPref();
    const handler = (e: StorageEvent) => {
      if (e.key === PREF_KEY) applyPref();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [applyPref]);

  return (
    <SidebarProvider
      open={open}
      onOpenChange={setOpen}
      style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <LandingRedirect />
            <RoleGate>
              {children}
            </RoleGate>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
