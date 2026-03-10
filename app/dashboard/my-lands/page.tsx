"use client"

import React from "react"
import Link from "next/link"
import { 
  Wallet, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Landmark, 
  Navigation,
  FileText, // Added for verification
  ShieldCheck 
} from "lucide-react"
import { Button }   from "@/components/ui/button"
import { Badge }    from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import {
  useGetMyAcceptedApplications,
  useGetMyEscrows,
} from "@/queryandmutation/index"
import ChatWidget from "@/components/chat/Chatwidget"

export default function MyApplicationsPage() {
  const router = useRouter()

  const { data: appData,    isLoading: appsLoading    } = useGetMyAcceptedApplications()
  const { data: escrowData, isLoading: escrowsLoading } = useGetMyEscrows()

  const applications = appData?.applications ?? []
  const escrows      = escrowData?.escrows   ?? []

  const unpaidApps = applications.filter(
    (app) => !escrows.some((e) => e.applicationId === app.id)
  )

  const isLoading = appsLoading || escrowsLoading
  const isEmpty   = unpaidApps.length === 0 && escrows.length === 0

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full rounded-3xl" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Applications</h1>
        <p className="text-sm text-slate-500">Manage your accepted lands and complete official procedures.</p>
      </div>

      {isEmpty ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400">No accepted applications yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">

          {/* SECTION 1: PAID ESCROWS (Ready for Legal Action) */}
          {escrows.map((escrow) => (
            <div key={escrow.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className="w-full md:w-64 h-56 md:h-auto relative shrink-0">
                <img src={escrow.application.land.heroImageUrl} className="w-full h-full object-cover" alt="Land" />
                <Badge className="absolute top-3 left-3 bg-emerald-500 shadow-lg">Live Agreement</Badge>
                
                <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2">
                   <Link href={`/navigation/land/${escrow.application.land.id}`}>
                      <Button size="sm" className="w-full bg-white/90 backdrop-blur text-blue-600 hover:bg-white text-[10px] h-7 rounded-lg font-bold">
                        <Navigation size={12} className="mr-1" /> View Site Path
                      </Button>
                   </Link>
                </div>
              </div>

              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{escrow.application.land.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {escrow.application.land.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {escrow.application.leaseDurationInMonths} Months</span>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  {/* NEW VERIFY BUTTON */}
                  <Button 
                    onClick={() => router.push(`/verify-agreement/${escrow.id}`)}
                    className="w-full bg-slate-900 hover:bg-black text-white rounded-xl h-11 font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <FileText size={16} className="text-emerald-400" />
                    Verify with Malpot Paper
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Link href={`/navigation/malpot/${escrow.application.land.id}`} className="w-full">
                      <Button variant="outline" className="w-full border-amber-200 text-amber-700 bg-amber-50/50 hover:bg-amber-100 rounded-xl text-[11px] h-10 font-bold">
                        <Landmark size={14} className="mr-1.5" /> Malpot Nav
                      </Button>
                    </Link>
                    <Button
                      onClick={() => {
                        const fab = document.querySelector('[aria-label="Open chat"]') as HTMLElement
                        fab?.click()
                      }}
                      variant="outline"
                      className="w-full rounded-xl h-10 text-[11px] font-bold border-slate-200"
                    >
                      <MessageSquare size={14} className="mr-1.5" /> Chat Owner
                    </Button>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-64 bg-slate-50 p-6 border-l border-slate-100 flex flex-col justify-center shrink-0">
                <div className="text-center md:text-left">
                  <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Escrow Security</p>
                  <p className="text-xl font-black text-emerald-600 mb-2 flex items-center justify-center md:justify-start gap-1">
                    <ShieldCheck size={20} /> PROTECTED
                  </p>
                  <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-100">
                    <p className="text-[10px] text-emerald-700 leading-tight font-bold">
                      NPR {escrow.amount.toLocaleString()} is secured. 
                      Upload the signed Malpot document to finalize.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* SECTION 2: UNPAID APPLICATIONS (Stayed same) */}
          {unpaidApps.map((app) => (
            <div key={app.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row opacity-90">
              <div className="w-full md:w-64 h-48 md:h-auto relative shrink-0">
                <img src={app.land.heroImageUrl} className="w-full h-full object-cover grayscale-[0.3]" alt="Land" />
                <Badge className="absolute top-3 left-3 bg-amber-500">Payment Pending</Badge>
              </div>

              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{app.land.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">Complete escrow to enable chat and legal verification.</p>
                </div>
                
                <div className="mt-4 flex gap-3">
                   <Link href={`/navigation/land/${app.land.id}`}>
                      <Button variant="ghost" size="sm" className="text-blue-600 text-xs font-bold p-0 h-auto hover:bg-transparent">
                        <Navigation size={14} className="mr-1" /> Preview Location
                      </Button>
                   </Link>
                </div>
              </div>

              <div className="w-full md:w-72 bg-indigo-50/30 p-6 border-l border-slate-100 flex flex-col justify-center gap-3 shrink-0">
                <div className="space-y-1">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Initial Deposit</p>
                   <p className="text-2xl font-black text-indigo-600">
                     {(app.proposedMonthlyRent * app.leaseDurationInMonths).toLocaleString()} <span className="text-xs">NPR</span>
                   </p>
                </div>

                <Button
                  onClick={() => router.push(`/checkout/${app.id}`)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-6 font-bold shadow-lg shadow-indigo-100"
                >
                  <Wallet size={18} className="mr-2" />
                  Secure with Escrow
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating chat widgets */}
      {escrows
        .filter((e) => e.chatChannelId)
        .map((e) => (
          <ChatWidget key={e.chatChannelId!} channelId={e.chatChannelId!} />
        ))}
    </div>
  )
}