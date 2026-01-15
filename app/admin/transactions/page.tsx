"use client"

import { useQuery } from "@tanstack/react-query"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTransactions } from "@/lib/api"

interface Transaction {
  id: number
  transaction_id: string
  property: {
    name: string
    owner: string
  }
  leaser: {
    name: string
    status: string
  }
  financials: {
    gross: number
    fee: number
    net: number
  }
  payout_status: {
    stage: string
    label: string
    color: string
  }
}

function getStatusColor(color: string) {
  const colors: Record<string, string> = {
    yellow: "bg-yellow-500/10 text-yellow-500",
    green: "bg-green-500/10 text-green-500",
    red: "bg-red-500/10 text-red-500",
    blue: "bg-blue-500/10 text-blue-500",
  }
  return colors[color] || "bg-gray-500/10 text-gray-500"
}

function TransactionCard({ transaction }: { transaction: Transaction }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{transaction.transaction_id}</CardTitle>
          <Badge
            className={getStatusColor(transaction.payout_status.color)}
            variant="secondary"
          >
            {transaction.payout_status.label}
          </Badge>
        </div>
        <CardDescription>{transaction.property.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Property Owner</p>
            <p className="font-medium">{transaction.property.owner}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Leaser</p>
            <div className="flex items-center gap-2">
              <p className="font-medium">{transaction.leaser.name}</p>
              <Badge
                variant="outline"
                className={transaction.leaser.status === "paid" ? "text-green-500" : "text-yellow-500"}
              >
                {transaction.leaser.status}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground mb-2">Financials</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Gross</p>
              <p className="font-medium">Rs {transaction.financials.gross.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fee</p>
              <p className="font-medium">Rs {transaction.financials.fee.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net</p>
              <p className="font-medium text-green-600">Rs {transaction.financials.net.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TransactionsPage() {
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  })

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          View all financial transactions and payment records.
        </p>
      </div>
      
      {isLoading ? (
        <p className="text-muted-foreground">Loading transactions...</p>
      ) : transactions.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))
          }
        </div>
      ) : (
        <p className="text-muted-foreground">No transactions found.</p>
      )}
    </div>
  )
}
