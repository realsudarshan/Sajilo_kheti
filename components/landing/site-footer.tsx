import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SiteFooter() {
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

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="text-gray-500 hover:text-emerald-600 text-sm">About Us</Link>
                            </li>
                            <li>
                                <Link href="#how-it-works" className="text-gray-500 hover:text-emerald-600 text-sm">How it Works</Link>
                            </li>
                            <li>
                                <Link href="#benefits" className="text-gray-500 hover:text-emerald-600 text-sm">Benefits</Link>
                            </li>
                            <li>
                                <Link href="#stories" className="text-gray-500 hover:text-emerald-600 text-sm">Success Stories</Link>
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
                            Join our newsletter for the latest farming tips and updates.
                        </p>
                        <form className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} Sajilo Kheti. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link href="#" className="text-gray-400 hover:text-emerald-600">Privacy Policy</Link>
                        <Link href="#" className="text-gray-400 hover:text-emerald-600">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
