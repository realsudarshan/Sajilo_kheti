"use client"

import { useLands } from "@/queryandmutation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { Land } from "@/types/land.types"

export default function LandsPage() {
  const { data: lands, isLoading, error } = useLands()

  const getStatusVariant = (status: Land["status"]) => {
    switch (status) {
      case "leased":
        return "default"
      case "on marketplace":
        return "secondary"
      case "agreement pending":
        return "outline"
      default:
        return "destructive"
    }
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">List Lands</h1>
        <p className="text-muted-foreground">
          View and manage all registered land properties.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : error ? (
        <div className="text-destructive">Failed to load lands: {error.message}</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Owner Name</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lands?.length > 0 ? (
                lands.map((land: Land) => (
                  <TableRow key={land.id}>
                    <TableCell className="font-medium">{land.id}</TableCell>
                    <TableCell>{land.location}</TableCell>
                    <TableCell>{land.size}</TableCell>
                    <TableCell>{land.ownername}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(land.status)}>
                        {land.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No lands found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
