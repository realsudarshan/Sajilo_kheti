
import { DashboardEssential } from "@/components/dashboard/DashboardEssential";
import { LandCard } from "@/components/dashboard/LandCard";
import { lands } from "@/data/lands";


export default function FindLand() {
  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardEssential />
      <LandCard lands={lands} />
      <div className="mt-8">
        <p className="text-sm text-gray-600">No results yet. Use the search above to find available land listings.</p>
      </div>
    </div>
  )
}
