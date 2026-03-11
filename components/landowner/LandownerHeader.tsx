"use client"

import { Sprout, LayoutDashboard, MapPin, ClipboardList, FileText } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserAccountNav } from "./userAccountNav"

const landownerNavigation = [
    { name: "Overview", href: "/landowner-dashboard/dashboard", icon: LayoutDashboard },
    { name: "My Lands", href: "/landowner-dashboard/my-lands", icon: MapPin },
    { name: "Lease Requests", href: "/landowner-dashboard/applications", icon: ClipboardList },
    { name: "Blog", href: "/blog", icon: FileText }
]

export function LandownerHeader() {
    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
            <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-10">
                    <Link href="/landowner-dashboard/dashboard" className="flex items-center gap-2 group">
                        <div className="h-9 w-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                            <Sprout className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-gray-900 leading-none">
                                Sajilo<span className="text-emerald-600">Kheti</span>
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold">Landowner Panel</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {landownerNavigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                    pathname === item.href
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* User Actions */}
                <div className="flex items-center gap-2">
                    <UserAccountNav />
                </div>
            </div>
        </header>
    )
}