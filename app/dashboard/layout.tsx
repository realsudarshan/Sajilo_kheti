import { SidebarProvider } from "@/components/ui/sidebar"
import { RoleGate } from "@/components/auth/RoleGate"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"

export default function LandownerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGate>
      {/* SidebarProvider must wrap anything that uses useSidebar() */}
      <SidebarProvider defaultOpen={false}> 
        
        <div className="flex flex-col min-h-screen w-full">
            <DashboardHeader/>
          {children}
        </div>
      </SidebarProvider>
    </RoleGate>
  )
}