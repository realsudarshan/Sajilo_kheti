"use client"

import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { Sprout } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import LandownerShadcnButton from "./Belandowner"

const navigation = [
    { name: "Overview", href: "/dashboard" },
    { name: "Find Land", href: "/dashboard/lands" },
    { name: "My Farm", href: "/dashboard/my-lands" },
]

export function DashboardHeader() {
    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                            <Sprout className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight hidden sm:inline-block">
                            Sajilo<span className="text-emerald-600">Kheti</span>
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors ${pathname === item.href
                                        ? "text-emerald-600"
                                        : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                   <LandownerShadcnButton/>
                    <div className="h-8 w-px bg-gray-200 hidden sm:block" />
                    <UserButton afterSignOutUrl="/" showName />
                </div>
            </div>
        </header>
    )
}
