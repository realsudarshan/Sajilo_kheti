"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGetAllUsers } from "@/queryandmutation"
import { ExternalLink } from "lucide-react"

export default function UsersPage() {
  const { data, isLoading, error } = useGetAllUsers()

  // This function builds the EXACT URL to the Clerk Dashboard
  const openClerkDashboard = (clerkId: string) => {
    const appId = "app_37jHtKxWTddp1r6DrsSOXrFn6yA"
    const instanceId = "ins_37jHtLD0ribkOTkVxqIaAZUGI76"
    
    const clerkUrl = `https://dashboard.clerk.com/apps/${appId}/instances/${instanceId}/users/${clerkId}`
    
    // Open in a new tab so your admin panel stays open
    window.open(clerkUrl, "_blank")
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Users</h1>
        <p className="text-muted-foreground text-sm">
          Click a row to manage the user directly in the Clerk Dashboard.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : error ? (
        <div className="text-destructive">Error: {error.message}</div>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">External</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.users?.map((user) => (
                <TableRow 
                  key={user.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  // FIX: This now triggers the external Clerk Dashboard URL
                  onClick={() => openClerkDashboard(user.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={user.imageUrl} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{user.name || 'Unnamed'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.role}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <ExternalLink className="size-3 inline-block ml-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}