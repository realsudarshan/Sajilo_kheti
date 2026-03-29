import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { getAnalyticsData } from "./analytics/posthog.server"

export default async function Page() {
  const data = await getAnalyticsData()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards
        totalProfit={data.totalProfit}
        totalLeasers={data.totalLeasers}
        totalOwners={data.totalOwners}
        totalTransactions={data.totalTransactions}
      />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive weeklyLeases={data.weeklyLeases} />
      </div>
    </div>
  )
}