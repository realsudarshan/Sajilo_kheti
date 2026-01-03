"use client"

import { Menu } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function SiteHeader() {
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header
            className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled
                    ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100"
                    : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-emerald-800 tracking-tight">
                        Sajilo<span className="text-emerald-600">Kheti</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#how-it-works" className="text-sm font-medium hover:text-emerald-600 transition-colors">
                        How it Works
                    </Link>
                    <Link href="#benefits" className="text-sm font-medium hover:text-emerald-600 transition-colors">
                        Benefits
                    </Link>
                    <Link href="#stories" className="text-sm font-medium hover:text-emerald-600 transition-colors">
                        Stories
                    </Link>
                    <Link href="#faq" className="text-sm font-medium hover:text-emerald-600 transition-colors">
                        FAQ
                    </Link>
                    <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6">
                        Get Started
                    </Button>
                </nav>

                {/* Mobile Nav */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-900">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <div className="flex flex-col gap-6 mt-10">
                                <Link href="#how-it-works" className="text-lg font-medium hover:text-emerald-600">
                                    How it Works
                                </Link>
                                <Link href="#benefits" className="text-lg font-medium hover:text-emerald-600">
                                    Benefits
                                </Link>
                                <Link href="#stories" className="text-lg font-medium hover:text-emerald-600">
                                    Stories
                                </Link>
                                <Link href="#faq" className="text-lg font-medium hover:text-emerald-600">
                                    FAQ
                                </Link>
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">
                                    Get Started
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
