"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAgreements } from "@/lib/api"

interface LeaseAgreement {
  landowner_id: string
  landowner_name: string
  landowner_certificate_url: string
  landleaser_id: string
  landleaser_name: string
  landleaser_doc_url: string
  status: "accepted" | "rejected" | "pending"
  total_amount: number
  amount_for_admin: number
  duration_months: number
}

const statusColors = {
  accepted: "bg-green-500/10 text-green-500",
  rejected: "bg-red-500/10 text-red-500",
  pending: "bg-yellow-500/10 text-yellow-500",
}

function AgreementTable({
  agreements,
  showActions = false,
}: {
  agreements: LeaseAgreement[]
  showActions?: boolean
}) {
  const [imageDialog, setImageDialog] = useState<{
    open: boolean
    url: string
    title: string
  }>({ open: false, url: "", title: "" })

  const openImage = (url: string, title: string) => {
    setImageDialog({ open: true, url, title })
  }

  return (
    <>
      <Dialog
        open={imageDialog.open}
        onOpenChange={(open) => setImageDialog({ ...imageDialog, open })}
      >
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{imageDialog.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-[4/3] bg-muted rounded-md overflow-hidden">
            <img
              src={imageDialog.url}
              alt={imageDialog.title}
              className="w-full h-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Landowner</TableHead>
              <TableHead>Landleaser</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              {showActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {agreements.length > 0 ? (
              agreements.map((agreement) => (
                <TableRow key={`${agreement.landowner_id}-${agreement.landleaser_id}`}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{agreement.landowner_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {agreement.landowner_id}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{agreement.landleaser_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {agreement.landleaser_id}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          openImage(
                            agreement.landowner_certificate_url,
                            `${agreement.landowner_name} - Land Certificate`
                          )
                        }
                      >
                        Owner Doc
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          openImage(
                            agreement.landleaser_doc_url,
                            `${agreement.landleaser_name} - Leaser Document`
                          )
                        }
                      >
                        Leaser Doc
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        ${agreement.total_amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Admin: ${agreement.amount_for_admin}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{agreement.duration_months} months</TableCell>
                  <TableCell>
                    <Badge
                      className={statusColors[agreement.status]}
                      variant="secondary"
                    >
                      {agreement.status.charAt(0).toUpperCase() +
                        agreement.status.slice(1)}
                    </Badge>
                  </TableCell>
                  {showActions && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm">Accept</Button>
                        <Button size="sm" variant="destructive">
                          Decline
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={showActions ? 7 : 6}
                  className="text-center text-muted-foreground"
                >
                  No agreements found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default function ReviewCertificatePage() {
  const { data: agreements = [], isLoading } = useQuery<LeaseAgreement[]>({
    queryKey: ["agreements"],
    queryFn: getAgreements,
  })

  const acceptedAgreements = agreements.filter(
    (a) => a.status === "accepted"
  )
  const rejectedAgreements = agreements.filter(
    (a) => a.status === "rejected"
  )
  const pendingAgreements = agreements.filter((a) => a.status === "pending")

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Review Land Certificate</h1>
          <p className="text-muted-foreground">Loading agreements...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Review Land Certificate</h1>
        <p className="text-muted-foreground">
          Review and approve lease agreements between landowners and landleasers.
        </p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="accepted">
            Accepted ({acceptedAgreements.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedAgreements.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingAgreements.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accepted" className="mt-4">
          <AgreementTable agreements={acceptedAgreements} />
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          <AgreementTable agreements={rejectedAgreements} />
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <AgreementTable agreements={pendingAgreements} showActions />
        </TabsContent>
      </Tabs>
    </div>
  )
}
