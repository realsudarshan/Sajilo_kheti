import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "SajiloKheti – Auth",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex">
            {/* Left branding panel (hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500 overflow-hidden p-12">
                {/* Decorative blobs */}
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

                <div className="relative z-10 text-center text-white max-w-md">
                    <Link href="/" className="inline-block mb-8">
                        <div className="flex items-center gap-3 justify-center">
                            {/* Leaf SVG icon */}
                            <svg
                                viewBox="0 0 40 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-14 h-14 drop-shadow-lg"
                            >
                                <circle cx="20" cy="20" r="20" fill="white" fillOpacity="0.15" />
                                <path
                                    d="M20 8C14 8 8 14 8 22C8 28 13 34 20 34C27 34 32 28 32 22C32 14 26 8 20 8Z"
                                    fill="white"
                                    fillOpacity="0.9"
                                />
                                <path
                                    d="M20 8 L20 34"
                                    stroke="emerald"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeDasharray="3 3"
                                />
                                <path
                                    d="M13 18 Q20 12 27 18"
                                    stroke="#10b981"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    fill="none"
                                />
                            </svg>
                            <span className="text-3xl font-bold tracking-tight">
                                SajiloKheti
                            </span>
                        </div>
                    </Link>

                    <h1 className="text-3xl font-bold mb-4 leading-tight">
                        Connect Landowners &amp; Urban Farmers
                    </h1>
                    <p className="text-emerald-50 text-base leading-relaxed">
                        Find unused land in your community to start farming today. Grow
                        healthy, organic produce with SajiloKheti.
                    </p>

                    <div className="mt-10 grid grid-cols-3 gap-4 text-center">
                        {[
                            { value: "500+", label: "Land Listings" },
                            { value: "2,000+", label: "Active Farmers" },
                            { value: "95%", label: "Satisfaction" },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-white/15 rounded-2xl px-3 py-4 backdrop-blur-sm"
                            >
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-xs text-emerald-100 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right auth form panel */}
            <div className="flex-1 flex flex-col items-center justify-center bg-white px-6 py-12">
                {/* Mobile logo */}
                <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
                    <span className="text-2xl font-bold text-emerald-600">🌱 SajiloKheti</span>
                </Link>

                {children}
            </div>
        </div>
    );
}
