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

// 1. Updated Type to match your API response exactly
export type Land = {
  id: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  status: "AVAILABLE" | "IN_NEGOTIATION" | "LEASED" | "HIDDEN";
  ownerId: string;
  title: string;
  location: string;
  lalpurjaUrl: string | null;
  area: string | null;
  sizeInSqFt: number;
  pricePerMonth: number;
  heroImageUrl: string;
  galleryUrls: string[];
}

export default function LandsPage() {
  const { data: lands, isLoading, error } = useLands()

  // 2. Updated to match ALL_CAPS status strings
  const getStatusVariant = (status: Land["status"]) => {
    switch (status) {
      case "LEASED":
        return "default"
      case "AVAILABLE":
        return "secondary"
      case "IN_NEGOTIATION":
        return "outline"
      case "HIDDEN":
        return "destructive"
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
        </div>
      ) : error ? (
        <div className="text-destructive">Failed to load lands: {error instanceof Error ? error.message : 'Unknown error'}</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Area/Size</TableHead>
                <TableHead>Price/Month</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lands && lands.length > 0 ? (
                lands.map((land: Land) => (
                  <TableRow key={land.id}>
                    <TableCell className="font-medium">{land.title}</TableCell>
                    <TableCell>{land.location}</TableCell>
                    <TableCell>
                      {/* Using sizeInSqFt or area from your provided schema */}
                      {land.area || `${land.sizeInSqFt} Sq Ft`}
                    </TableCell>
                    <TableCell>Rs. {land.pricePerMonth.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(land.status)}>
                        {land.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
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