import type { Metadata } from "next";
import Link from "next/link";
import BrandedLeftPanel from "@/components/auth/BrandedLeftPanel";

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
            <div className="hidden lg:flex lg:w-1/2">
                <BrandedLeftPanel />
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
