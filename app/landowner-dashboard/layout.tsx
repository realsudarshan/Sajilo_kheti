import { RoleGate } from "@/components/auth/RoleGate";
import { LandownerHeader } from "@/components/landowner/LandownerHeader";

export default function LandownerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGate>
      <div className="min-h-screen bg-[#fafafa]">
        <LandownerHeader />
        <main className="container mx-auto px-4 py-8 lg:px-8">
          {children}
        </main>
      </div>
    </RoleGate>
  );
}