// FILE: app/landowner-dashboard/layout.tsx
// ROUTE: Wraps ALL /landowner-dashboard/* pages (sidebar + mobile nav)

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignedIn, useClerk, useUser } from "@clerk/nextjs";
import ChatWidget from "@/components/chat/Chatwidget";
import {
  LayoutDashboard,
  MapPin,
  FileText,
  Wallet,
  PlusCircle,
  ShieldCheck,
  BookOpen,
  ChevronRight,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetMe } from "@/queryandmutation";

const navItems = [
  {
    label: "Overview",
    href: "/landowner-dashboard/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Lands",
    href: "/landowner-dashboard/my-lands",
    icon: MapPin,
  },
  {
    label: "Applications",
    href: "/landowner-dashboard/applications",
    icon: FileText,
  },
  {
    label: "Escrow & Payments",
    href: "/landowner-dashboard/escrow",
    icon: Wallet,
  },
  {
    label: "List New Land",
    href: "/landowner-dashboard/list-land",
    icon: PlusCircle,
    highlight: true,
  },
];

const secondaryItems = [
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "KYC Status", href: "/dashboard/verify-landowner", icon: ShieldCheck },
];

export default function LandownerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: me } = useGetMe();
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div className="flex min-h-screen bg-[#f8f7f4] font-sans">

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-stone-200 fixed inset-y-0 z-40">

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-stone-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-bold">🌾</span>
          </div>
          <div>
            <p className="font-black text-sm text-stone-900 tracking-tight">SajiloKheti</p>
            <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">Landowner Portal</p>
          </div>
        </div>

        {/* KYC verified badge */}
        {me?.isKycVerified && (
          <div className="mx-4 mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold text-emerald-700">KYC Verified</span>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            Manage
          </p>
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  active
                    ? "bg-emerald-600 text-white shadow-sm"
                    : item.highlight
                    ? "border-2 border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                )}
              >
                <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-white" : "")} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="h-3 w-3 text-white/60" />}
              </Link>
            );
          })}

          <div className="pt-4">
            <p className="px-3 pb-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              More
            </p>
            {secondaryItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    active
                      ? "bg-emerald-600 text-white"
                      : "text-stone-500 hover:bg-stone-100 hover:text-stone-700"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ── Account panel ───────────────────────────────────── */}
        <div className="border-t border-stone-100 p-3 space-y-0.5">

          {/* Avatar + name + email */}
          <div className="flex items-center gap-3 px-2 py-2.5">
            <UserButton
              appearance={{
                elements: { avatarBox: "w-9 h-9 rounded-xl shrink-0" },
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-stone-900 truncate">
                {user?.fullName ?? user?.firstName ?? "Landowner"}
              </p>
              <p className="text-[10px] text-stone-400 truncate">
                {user?.primaryEmailAddress?.emailAddress ?? ""}
              </p>
            </div>
          </div>

          {/* Manage Account — opens Clerk's built-in user profile modal */}
          <SignedIn>
            <button
              onClick={() => openUserProfile()}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
            >
              <Settings className="h-3.5 w-3.5 shrink-0 text-stone-400" />
              Manage Account
            </button>
          </SignedIn>

          {/* Sign Out */}
          <SignedIn>
            <button
              onClick={() => signOut({ redirectUrl: "/login" })}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              Sign Out
            </button>
          </SignedIn>

        </div>
      </aside>

      {/* ── Mobile top bar ─────────────────────────────────── */}
      {/* On mobile, UserButton popup still gives access to manage account + sign out */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-stone-200 flex items-center justify-between px-4 h-14">
        <Link href="/landowner-dashboard/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
            <span className="text-white text-xs">🌾</span>
          </div>
          <span className="font-black text-sm text-stone-900">SajiloKheti</span>
        </Link>
        <UserButton
          appearance={{
            elements: { avatarBox: "w-8 h-8 rounded-xl" },
          }}
        />
      </header>

      {/* ── Mobile bottom nav ──────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-stone-200 flex items-center justify-around px-2 h-16">
        {navItems.slice(0, 4).map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors",
                active ? "text-emerald-600" : "text-stone-400"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[9px] font-bold">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Main content ────────────────────────────────────── */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 pb-16 lg:pb-0 min-h-screen">
        {children}
        <ChatWidget channelId="general-support" />
      </main>


    </div>
  );
} 