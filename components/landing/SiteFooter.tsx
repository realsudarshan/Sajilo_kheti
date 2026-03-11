"use client"

import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { subscribeToNewsletter } from "@/app/actions/subscribe"

export function SiteFooter() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    async function handleAction(formData: FormData) {
        setStatus("loading");
        const result = await subscribeToNewsletter(formData);
        if (result?.success) {
            setStatus("success");
            setTimeout(() => setStatus("idle"), 5000);
        } else {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
    }

    return (
        <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-bold text-emerald-800 tracking-tight">
                                Sajilo<span className="text-emerald-600">Kheti</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Connecting landowners with aspiring farmers to create a greener, more sustainable future through shared cultivation.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-gray-400 hover:text-emerald-600 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-emerald-600 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-emerald-600 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-6">Resources</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/docs" className="text-gray-500 hover:text-emerald-600 text-sm">Documentation</Link>
                            </li>
                            <li>
                                <Link href="/report" className="text-gray-500 hover:text-emerald-600 text-sm"> Reports</Link>
                            </li>
                            <li>
                                <Link href="/help" className="text-gray-500 hover:text-emerald-600 text-sm">Help Center</Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-gray-500 hover:text-emerald-600 text-sm">Terms of Service</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-6">Contact</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-500 text-sm">
                                <MapPin className="h-4 w-4 mt-1 text-emerald-600 shrink-0" />
                                <span>Kathmandu, Nepal</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-500 text-sm">
                                <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                                <span>+977 9800000000</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-500 text-sm">
                                <Mail className="h-4 w-4 text-emerald-600 shrink-0" />
                                <span>hello@sajilokheti.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-6">Stay Updated</h3>
                        <p className="text-gray-500 text-sm mb-4">
                            {status === "success" 
                                ? "Check your email for confirmation!" 
                                : "Join our newsletter for the latest farming tips and updates."}
                        </p>
                        <form action={handleAction} className="space-y-2">
                            <Input
                                name="email"
                                type="email"
                                required
                                placeholder={status === "success" ? "Subscribed! ✨" : "Enter your email"}
                                disabled={status === "success"}
                                className={`bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 ${status === "error" ? "border-red-500" : ""}`}
                            />
                            <Button 
                                type="submit" 
                                disabled={status !== "idle"}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                            >
                                {status === "loading" ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : status === "success" ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                    "Subscribe"
                                )}
                            </Button>
                        </form>
                        {status === "error" && (
                           <p className="text-[10px] text-red-500 mt-1">Please try again later.</p>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} Sajilo Kheti. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link href="/privacy" className="text-gray-400 hover:text-emerald-600">Privacy Policy</Link>
                        <Link href="/terms" className="text-gray-400 hover:text-emerald-600">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}