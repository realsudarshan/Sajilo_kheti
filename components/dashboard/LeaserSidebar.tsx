// dashboard/LeaserSidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useGetMe } from "@/queryandmutation"
import {
  LayoutDashboard,
  Search,
  FileText,
  ShieldCheck,
  ScrollText,
  HelpCircle,
  ChevronRight,
  Sprout,
  UserPlus, // Added for Become Landowner icon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { UserButton } from "@clerk/nextjs"

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/find-land", label: "Find Land", icon: Search },
  { href: "/dashboard/my-leases", label: "My Applications", icon: FileText },
  { href: "/dashboard/escrow", label: "Escrow & Payments", icon: ShieldCheck },
  { href: "/dashboard/agreements", label: "Agreements", icon: ScrollText },
  { href: "/blog", label: "Blog", icon: Sprout },
]

export function LeaserSidebar() {
  const pathname = usePathname()
  const { data: me } = useGetMe()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <aside className="w-[230px] shrink-0 min-h-screen bg-[#0C1A0E] flex flex-col sticky top-0 h-screen">
      {/* 1. Logo Section */}
      <div className="px-5 pt-6 pb-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
          <Sprout className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-extrabold text-sm leading-none">SajiloKheti</p>
          <p className="text-emerald-400 text-[10px] font-semibold mt-0.5">Leaser Portal</p>
        </div>
      </div>

      {/* 2. Main Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link key={href} href={href} className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border-l-2",
              active
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-400"
                : "text-stone-400 border-transparent hover:text-stone-200 hover:bg-white/5"
            )}>
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
              {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* 3. Bottom Section (User Menu & Landowner Option) */}
      <div className="p-4 border-t border-white/5 space-y-4">
        
        {/* Become Landowner Option */}
        <Link 
          href="/dashboard/verify-landowner" 
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Become Landowner</span>
    </Link>

        {/* User Profile Info */}
        <div className="px-2 flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-bold truncate">{me?.name ?? "..."}</p>
            <p className={cn(
              "text-[10px] font-semibold mt-0.5",
              me?.isKycVerified ? "text-emerald-400" : "text-amber-400"
            )}>
              {me?.isKycVerified ? "✓ Verified" : "⚠ Unverified"}
            </p>
          </div>
        </div>

        {/* Support Link */}
        <Link href="/help" className="flex items-center gap-2 px-2 text-stone-500 hover:text-stone-300 text-[11px] font-medium transition-colors">
          <HelpCircle className="w-3.5 h-3.5" />
          Help & Support
        </Link>
      </div>
    </aside>
  )
}