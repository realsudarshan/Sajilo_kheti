// app/admin/page.tsx
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { getSectionCardData, getWeeklyLeases } from "./analytics/posthog.server"

export default async function Page() {
  const [stats, weeklyLeases] = await Promise.all([
    getSectionCardData(),
    getWeeklyLeases(),
  ])

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards stats={stats} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive weeklyLeases={weeklyLeases} />
      </div>
    </div>
  )
}