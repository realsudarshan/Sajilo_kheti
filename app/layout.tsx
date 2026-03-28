import { TRPCProvider } from "@/components/providers/query-provider";
import { UserSync } from "@/components/user-sync";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { PostHogProvider } from '@/components/providers/PosthogProvider';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SajiloKheti - Connect Landowners & Urban Farmers",
  description: "Find unused land in your community to start farming today. Connect with landowners and grow healthy, organic produce. From small plots to larger fields, SajiloKheti makes urban farming accessible to everyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="overflow-x-hidden" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
          suppressHydrationWarning
        >
          <PostHogProvider>
          <TRPCProvider>
            <UserSync />
            {children}
          </TRPCProvider>
          <Toaster position="top-center" />
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
