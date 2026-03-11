// dashboard/layout.tsx
import { RoleGate } from "@/components/auth/RoleGate"
import { LeaserSidebar } from "@/components/dashboard/LeaserSidebar"

export default function LeaserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGate>
      <div className="flex h-screen overflow-hidden bg-[#F6F7F5]">
        {/* Sidebar — fixed height, never scrolls */}
        <LeaserSidebar />

        {/* Main content — scrolls independently */}
        <main className="flex-1 min-w-0 h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </RoleGate>
  )
}