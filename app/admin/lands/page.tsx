"use client"

import React, { useState } from 'react'
import { 
  useAcceptLand, 
  useGetAllLandsAdmin, 
  useRejectLand 
} from '@/queryandmutation'
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
import { Button } from "@/components/ui/button"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { 
  Eye, 
  Check, 
  X, 
  ExternalLink, 
  MapPin, 
  UserCircle 
} from "lucide-react"

const openClerkDashboard = (clerkId: string) => {
  const appId = "app_37jHtKxWTddp1r6DrsSOXrFn6yA"
  const instanceId = "ins_37jHtLD0ribkOTkVxqIaAZUGI76"
  const clerkUrl = `https://dashboard.clerk.com/apps/${appId}/instances/${instanceId}/users/${clerkId}`
  window.open(clerkUrl, "_blank")
}

export default function AdminLandsPage() {
  const [selectedLand, setSelectedLand] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState<string>("UNVERIFIED")
  
  const { data: lands, isLoading } = useGetAllLandsAdmin({
    status: activeTab === "all" ? undefined : (activeTab as any)
  })
  
  const acceptMutation = useAcceptLand()
  const rejectMutation = useRejectLand()

  const handleAction = async (id: string, action: 'accept' | 'reject') => {
    try {
      if (action === 'accept') {
        await acceptMutation.mutateAsync({ landId: id })
        toast.success("Land listing approved!")
      } else {
        await rejectMutation.mutateAsync({ landId: id })
        toast.error("Land listing rejected.")
      }
      setSelectedLand(null)
    } catch (err) {
      toast.error("Action failed.")
    }
  }

  const getStatusVariant = (status: string) => {
    const variants: Record<string, string> = {
      AVAILABLE: "bg-green-100 text-green-700 border-green-200",
      UNVERIFIED: "bg-amber-100 text-amber-700 border-amber-200",
      REJECTED: "bg-red-100 text-red-700 border-red-200",
      LEASED: "bg-blue-100 text-blue-700 border-blue-200",
    }
    return variants[status] || "bg-slate-100 text-slate-700"
  }

  return (
    <div className="flex flex-col gap-6 py-6 px-4 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Land Verification</h1>
          <p className="text-muted-foreground text-sm">Manage property listings for Sajilo Kheti.</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-fit">
          <TabsList className="bg-slate-100">
            <TabsTrigger value="UNVERIFIED">Pending</TabsTrigger>
            <TabsTrigger value="AVAILABLE">Active</TabsTrigger>
            <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="pl-6 py-4">Property</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Owner</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lands?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center text-slate-500">No properties found.</TableCell>
                </TableRow>
              ) : (
                lands?.map((land: any) => (
                  <TableRow key={land.id} className="group hover:bg-slate-50/80 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={land.heroImageUrl} className="h-10 w-10 rounded-lg object-cover border" alt="" />
                        <span className="font-semibold text-slate-900 truncate max-w-[150px]">{land.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {land.location}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">{land.sizeInSqmeter?.toLocaleString()} m²</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-medium shadow-none ${getStatusVariant(land.status)}`}>
                        {land.status}
                      </Badge>
                    </TableCell>
                    
                    {/* --- SMALL ICON REDIRECT --- */}
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-primary transition-colors"
                        onClick={() => openClerkDashboard(land.ownerId)}
                      >
                        <UserCircle className="h-5 w-5" />
                      </Button>
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <Button variant="outline" size="sm" onClick={() => setSelectedLand(land)}>
                        <Eye className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Review</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* --- Detail Panel --- */}
      <Sheet open={!!selectedLand} onOpenChange={() => setSelectedLand(null)}>
        <SheetContent className="sm:max-w-xl overflow-y-auto p-0 bg-white">
          <div className="sr-only">
            <SheetHeader>
              <SheetTitle>Details</SheetTitle>
              <SheetDescription>Verification for {selectedLand?.title}</SheetDescription>
            </SheetHeader>
          </div>

          {selectedLand && (
            <div className="flex flex-col h-full">
              <div className="relative h-64 w-full">
                <img src={selectedLand.heroImageUrl} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <Badge className={`${getStatusVariant(selectedLand.status)} mb-2`}>{selectedLand.status}</Badge>
                  <h2 className="text-2xl font-bold">{selectedLand.title}</h2>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase">Owner Dashboard</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary hover:bg-primary/5 gap-2"
                    onClick={() => openClerkDashboard(selectedLand.ownerId)}
                  >
                    View Profile <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Description</h4>
                  <p className="text-slate-600 text-sm italic">"{selectedLand.description}"</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Documents</h4>
                  <a href={selectedLand.lalpurjaUrl} target="_blank" className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-all">
                    <span className="font-bold text-sm">Lalpurja Certificate</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </a>
                </div>
              </div>

              {selectedLand.status === 'UNVERIFIED' && (
                <div className="mt-auto p-6 border-t flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => handleAction(selectedLand.id, 'reject')}>Reject</Button>
                  <Button className="flex-[2] bg-emerald-600 hover:bg-emerald-700" onClick={() => handleAction(selectedLand.id, 'accept')}>Approve</Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}