"use client"

import React from "react"
import { Wallet, MapPin, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
// Assuming you've added the new query to your hooks
import { useGetMyAcceptedApplications } from "@/queryandmutation/index" 

export default function MyApplicationsPage() {
  const router = useRouter()
  const { data, isLoading } = useGetMyAcceptedApplications()
  
  const applications = data?.applications ?? []

  if (isLoading) {
    return <div className="p-6 space-y-4"><Skeleton className="h-40 w-full rounded-3xl" /></div>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Accepted Applications</h1>
        <p className="text-sm text-slate-500">Secure your lease by completing the escrow payment.</p>
      </div>

      <div className="grid gap-6">
        {applications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed">
            <p className="text-slate-400">No accepted applications yet.</p>
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
              
              {/* Land Preview */}
              <div className="w-full md:w-64 h-40 md:h-auto relative">
                <img 
                  src={app.land.heroImageUrl} 
                  className="w-full h-full object-cover" 
                  alt="Land" 
                />
                <Badge className="absolute top-3 left-3 bg-emerald-500">Accepted</Badge>
              </div>

              {/* Application Details */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{app.land.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><MapPin size={14}/> {app.land.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={14}/> {app.leaseDurationInMonths} Months</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-black text-slate-400">Agreed Rent</p>
                    <p className="text-lg font-bold text-emerald-600">{app.proposedMonthlyRent.toLocaleString()} NPR /mo</p>
                  </div>
                </div>
              </div>

              {/* Payment Sidebar/Section */}
              <div className="w-full md:w-72 bg-slate-50 p-6 border-l border-slate-100 flex flex-col justify-center gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium">Total Escrow Amount</p>
                  <p className="text-2xl font-black text-slate-900">
                    {(app.proposedMonthlyRent * app.leaseDurationInMonths).toLocaleString()} <span className="text-sm font-normal">NPR</span>
                  </p>
                  <p className="text-[10px] text-slate-400 italic">*Includes 1 month security deposit</p>
                </div>

                <Button 
                  onClick={() => router.push(`/checkout/${app.id}`)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-6 flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all"
                >
                  <Wallet size={18} />
                  Pay Now
                  <ArrowRight size={16} className="ml-auto" />
                </Button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  )
}