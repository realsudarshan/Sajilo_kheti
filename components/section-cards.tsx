import { IconTrendingUp } from "@tabler/icons-react"
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
  totalProfit: number
  totalLeasers: number
  totalOwners: number
  totalTransactions: number
}

export function SectionCards({
  totalProfit,
  totalLeasers,
  totalOwners,
  totalTransactions,
}: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Profit</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rs {totalProfit.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Commission
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total escrow commission earned
          </div>
          <div className="text-muted-foreground">All time</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Land Leasers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalLeasers.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Users
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Registered leasers
          </div>
          <div className="text-muted-foreground">All time</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Land Owners</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalOwners.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Owners
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            KYC verified landowners
          </div>
          <div className="text-muted-foreground">All time</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Transactions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalTransactions.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Escrow
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Completed escrow payments
          </div>
          <div className="text-muted-foreground">All time</div>
        </CardFooter>
      </Card>

    </div>
  )
}