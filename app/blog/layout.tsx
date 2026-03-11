// app/blog/layout.tsx

import { SiteHeader } from "@/components/landing/SiteHeader"

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <SiteHeader />
      <main className="container mx-auto px-4 py-8 lg:px-8">
        {children}
      </main>
    </div>
  )
}