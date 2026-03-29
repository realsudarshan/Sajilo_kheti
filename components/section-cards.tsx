// components/section-cards.tsx
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SectionCardsProps {
  stats: {
    totalProfit:       number
    totalLeasers:      number
    totalOwners:       number
    totalTransactions: number
  }
}

export function SectionCards({ stats }: SectionCardsProps) {
  const { totalProfit, totalLeasers, totalOwners, totalTransactions } = stats

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

      {/* Total Profit */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Profit</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rs {totalProfit.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              All time
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Commission from escrow payments <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            5% of each escrow transaction
          </div>
        </CardFooter>
      </Card>

      {/* Total Land Leasers */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Land Leasers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalLeasers.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              All time
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Registered users on the platform <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            All users start as leasers
          </div>
        </CardFooter>
      </Card>

      {/* Total Land Owners */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Land Owners</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalOwners.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              All time
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            KYC approved landowners <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Verified via citizenship documents
          </div>
        </CardFooter>
      </Card>

      {/* Total Transactions */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Transactions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalTransactions.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              All time
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Escrow payments processed <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Successful lease escrow holdings
          </div>
        </CardFooter>
      </Card>

    </div>
  )
}