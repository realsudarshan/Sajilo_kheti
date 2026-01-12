"use client"

import { useState } from "react"
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

interface LandownerApplication {
  ownerid: string
  ownername: string
  application: {
    "front-page-url": string
    "back-page-url": string
  }
  status: "accepted" | "rejected" | "pending"
}

// Mock data - replace with actual API call
const mockLandowners: LandownerApplication[] = [
  {
    ownerid: "USR-101",
    ownername: "Alice Vance",
    application: {
      "front-page-url": "https://i.ibb.co/sample1/front.jpg",
      "back-page-url": "https://i.ibb.co/sample1/back.jpg",
    },
    status: "accepted",
  },
  {
    ownerid: "USR-102",
    ownername: "Bob Smith",
    application: {
      "front-page-url": "https://i.ibb.co/sample2/front.jpg",
      "back-page-url": "https://i.ibb.co/sample2/back.jpg",
    },
    status: "rejected",
  },
  {
    ownerid: "USR-103",
    ownername: "Charlie Brown",
    application: {
      "front-page-url": "https://i.ibb.co/sample3/front.jpg",
      "back-page-url": "https://i.ibb.co/sample3/back.jpg",
    },
    status: "pending",
  },
  {
    ownerid: "USR-104",
    ownername: "Diana Ross",
    application: {
      "front-page-url": "https://i.ibb.co/sample4/front.jpg",
      "back-page-url": "https://i.ibb.co/sample4/back.jpg",
    },
    status: "pending",
  },
]

const statusColors = {
  accepted: "bg-green-500/10 text-green-500",
  rejected: "bg-red-500/10 text-red-500",
  pending: "bg-yellow-500/10 text-yellow-500",
}

function LandownerTable({
  landowners,
  showActions = false,
}: {
  landowners: LandownerApplication[]
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
              <TableHead>Owner ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Status</TableHead>
              {showActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {landowners.length > 0 ? (
              landowners.map((landowner) => (
                <TableRow key={landowner.ownerid}>
                  <TableCell className="font-medium">
                    {landowner.ownerid}
                  </TableCell>
                  <TableCell>{landowner.ownername}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          openImage(
                            landowner.application["front-page-url"],
                            `${landowner.ownername} - Front Page`
                          )
                        }
                      >
                        Show Front
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          openImage(
                            landowner.application["back-page-url"],
                            `${landowner.ownername} - Back Page`
                          )
                        }
                      >
                        Show Back
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={statusColors[landowner.status]}
                      variant="secondary"
                    >
                      {landowner.status.charAt(0).toUpperCase() +
                        landowner.status.slice(1)}
                    </Badge>
                  </TableCell>
                  {showActions && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm">Accept</Button>
                        <Button size="sm" variant="destructive">
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
                  No landowners found.
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
  const acceptedLandowners = mockLandowners.filter(
    (l) => l.status === "accepted"
  )
  const rejectedLandowners = mockLandowners.filter(
    (l) => l.status === "rejected"
  )
  const pendingLandowners = mockLandowners.filter((l) => l.status === "pending")

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Review Landowner</h1>
        <p className="text-muted-foreground">
          Review and verify landowner applications and profiles.
        </p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="accepted">
            Accepted ({acceptedLandowners.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedLandowners.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingLandowners.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accepted" className="mt-4">
          <LandownerTable landowners={acceptedLandowners} />
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          <LandownerTable landowners={rejectedLandowners} />
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <LandownerTable landowners={pendingLandowners} showActions />
        </TabsContent>
      </Tabs>
    </div>
  )
}
