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
  SheetFooter
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Eye, Check, X, ExternalLink, MapPin, Ruler, Banknote } from "lucide-react"

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
    // REMOVED: max-w-7xl and mx-auto
    // ADDED: w-full and px-4 (minimal padding for edge safety)
    <div className="flex flex-col gap-6 py-6 px-4 w-full">
      
      {/* Header Section - Now spans full width */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Land Verification</h1>
          <p className="text-muted-foreground text-sm">Manage property listings for Sajilo Kheti across the platform.</p>
        </div>
        
        <Tabs defaultValue="UNVERIFIED" onValueChange={setActiveTab} className="w-fit">
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
        // Table container is now fluid
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="pl-6 py-4 min-w-[300px]">Property Details</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lands?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-slate-500">
                    No properties found.
                  </TableCell>
                </TableRow>
              ) : (
                lands?.map((land: any) => (
                  <TableRow key={land.id} className="group hover:bg-slate-50/80 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={land.heroImageUrl} 
                          className="h-12 w-12 rounded-lg object-cover flex-shrink-0 border" 
                          alt=""
                        />
                        <span className="font-semibold text-slate-900 truncate">
                          {land.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {land.location}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium whitespace-nowrap">
                      {land.sizeInSqmeter} m²
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-medium shadow-none ${getStatusVariant(land.status)}`}>
                        {land.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedLand(land)}
                        className="bg-white hover:bg-slate-100 border-slate-200"
                      >
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

      {/* Side Detail Panel */}
   <Sheet open={!!selectedLand} onOpenChange={() => setSelectedLand(null)}>
  <SheetContent className="sm:max-w-xl overflow-y-auto p-0 bg-white">
    {/* This satisfies the accessibility error without hiding your UI */}
    <div className="sr-only">
      <SheetHeader>
        <SheetTitle>Land Details</SheetTitle>
        <SheetDescription>Verification details for {selectedLand?.title}</SheetDescription>
      </SheetHeader>
    </div>

    {selectedLand && (
      <div className="flex flex-col h-full animate-in fade-in duration-300">
        {/* 1. Hero Image Header */}
        <div className="relative h-72 w-full">
          <img 
            src={selectedLand.heroImageUrl} 
            className="w-full h-full object-cover" 
            alt="Land" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <Badge className={`${getStatusVariant(selectedLand.status)} mb-3 border-none shadow-lg px-3 py-1 text-xs uppercase font-bold`}>
              {selectedLand.status}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight leading-tight">{selectedLand.title}</h2>
            <p className="flex items-center gap-1 text-white/90 text-sm mt-2 font-medium">
              <MapPin className="h-4 w-4 text-emerald-400" /> {selectedLand.location}
            </p>
          </div>
        </div>

        {/* 2. Content Body */}
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-600 mb-2 font-bold text-[10px] uppercase tracking-widest">
                <Banknote className="h-4 w-4" /> Monthly Rent
              </div>
              <p className="text-2xl font-black text-emerald-700">
                Rs. {selectedLand.pricePerMonth?.toLocaleString()}
              </p>
            </div>
            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-2 text-blue-600 mb-2 font-bold text-[10px] uppercase tracking-widest">
                <Ruler className="h-4 w-4" /> Area Size
              </div>
              <p className="text-2xl font-black text-blue-700">
                {selectedLand.sizeInSqmeter} <span className="text-sm font-medium opacity-70">m²</span>
              </p>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Property Description
            </h4>
            <div className="text-slate-600 leading-relaxed text-base bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
              "{selectedLand.description}"
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Verification Documents</h4>
            <a 
              href={selectedLand.lalpurjaUrl} 
              target="_blank" 
              className="flex items-center justify-between p-5 bg-white border-2 border-slate-100 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <ExternalLink className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Lalpurja (Certificate)</p>
                  <p className="text-xs text-slate-500">Official land ownership PDF</p>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <Check className="h-4 w-4 text-slate-300 group-hover:text-emerald-600" />
              </div>
            </a>
          </div>
        </div>

        {/* 3. Action Footer */}
        {selectedLand.status === 'UNVERIFIED' && (
          <div className="mt-auto p-6 border-t bg-white sticky bottom-0">
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1 h-14 rounded-xl border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all font-bold"
                disabled={acceptMutation.isPending || rejectMutation.isPending}
                onClick={() => handleAction(selectedLand.id, 'reject')}
              >
                <X className="mr-2 h-5 w-5" /> Reject
              </Button>
              <Button 
                className="flex-[2] h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all font-bold text-lg"
                disabled={acceptMutation.isPending || rejectMutation.isPending}
                onClick={() => handleAction(selectedLand.id, 'accept')}
              >
                <Check className="mr-2 h-5 w-5" /> Approve Listing
              </Button>
            </div>
          </div>
        )}
      </div>
    )}
  </SheetContent>
</Sheet>
    </div>
  )
}