"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetAllKycDetails, useUpdateKycStatus } from "@/queryandmutation"
import { useMemo, useState } from "react"
import { toast } from "sonner"

type KycStatus = "PENDING" | "APPROVED" | "REJECTED"

interface KycDetail {
  id: string
  userId: string
  status: string
  citizenshipNumber: string
  documentUrl: string
  selfieUrl: string | null
  userName: string
  userEmail: string
}

function KycTable({
  kycDetails,
  showActions = false,
  onStatusUpdate,
}: {
  kycDetails: KycDetail[]
  showActions?: boolean
  onStatusUpdate?: () => void
}) {
  const [imageDialog, setImageDialog] = useState<{
    open: boolean
    url: string
    title: string
  }>({ open: false, url: "", title: "" })

  const updateKycStatus = useUpdateKycStatus()

  const openImage = (url: string, title: string) => {
    setImageDialog({ open: true, url, title })
  }

  const handleStatusUpdate = async (userId: string, status: KycStatus) => {
    try {
      await updateKycStatus.mutateAsync({ userId, status })
      toast.success(`KYC ${status.toLowerCase()} successfully`)
      onStatusUpdate?.()
    } catch (error: any) {
      toast.error(error.message || "Failed to update KYC status")
    }
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
              <TableHead>User</TableHead>
              <TableHead>Citizenship No.</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Status</TableHead>
              {showActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {kycDetails.length > 0 ? (
              kycDetails.map((kyc) => (
                <TableRow key={kyc.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{kyc.userName}</p>
                      <p className="text-sm text-muted-foreground">{kyc.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {kyc.citizenshipNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          openImage(
                            kyc.documentUrl,
                            `${kyc.userName} - Citizenship Document`
                          )
                        }
                      >
                        Document
                      </Button>
                      {kyc.selfieUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            openImage(
                              kyc.selfieUrl!,
                              `${kyc.userName} - Selfie`
                            )
                          }
                        >
                          Selfie
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        kyc.status === "APPROVED"
                          ? "default"
                          : kyc.status === "REJECTED"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {kyc.status}
                    </Badge>
                  </TableCell>
                  {showActions && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(kyc.userId, "APPROVED")}
                          disabled={updateKycStatus.isPending}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusUpdate(kyc.userId, "REJECTED")}
                          disabled={updateKycStatus.isPending}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={showActions ? 5 : 4}
                  className="text-center text-muted-foreground"
                >
                  No applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default function ReviewLandownerPage() {
  const { data, isLoading, error, refetch } = useGetAllKycDetails()

  const kycDetails = data?.kycDetails || []

  // Client-side filtering
  const { pending, approved, rejected } = useMemo(() => {
    return {
      pending: kycDetails.filter((k) => k.status === "PENDING"),
      approved: kycDetails.filter((k) => k.status === "APPROVED"),
      rejected: kycDetails.filter((k) => k.status === "REJECTED"),
    }
  }, [kycDetails])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        <div className="text-destructive">Error: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Review KYC Applications</h1>
        <p className="text-muted-foreground">
          Review and verify landowner KYC applications.
        </p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approved.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejected.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <KycTable kycDetails={pending} showActions onStatusUpdate={() => refetch()} />
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          <KycTable kycDetails={approved} />
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          <KycTable kycDetails={rejected} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
