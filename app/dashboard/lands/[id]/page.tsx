// FILE: app/dashboard/lands/[id]/page.tsx
"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useGetLandById, useGetMyLeaserApplications } from "@/queryandmutation"
import {
  ArrowLeft, MapPin, Ruler, DollarSign,
  CheckCircle2, Image as ImageIcon, FileText, BadgeCheck,
  Clock, XCircle, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge }  from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export default function LandDetailPage() {
  const { id } = useParams() as { id: string }
  const router  = useRouter()

  const { data: land, isLoading, error } = useGetLandById(id)

  // Only this user's own applications, filtered by this land
  const { data: appData, isLoading: appsLoading } = useGetMyLeaserApplications({
    landId: id,
  })

  if (isLoading) return <DetailSkeleton />
  if (error || !land) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <p className="text-stone-500 font-medium">Land not found or unavailable.</p>
        <Button variant="outline" onClick={() => router.back()} className="rounded-xl">Go back</Button>
      </div>
    </div>
  )

  const isAvailable = land.status === "AVAILABLE"

  // Most recent application this user sent for this land
  const existingApp = appData?.applications?.[0] ?? null
  const appStatus   = existingApp?.status as string | undefined

  const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
    PENDING: {
      label:     "Application Sent — Awaiting Response",
      icon:      <Clock className="w-4 h-4 shrink-0" />,
      className: "bg-amber-50 border-amber-200 text-amber-700",
    },
    ACCEPTED: {
      label:     "Application Accepted! Proceed to escrow payment.",
      icon:      <CheckCircle2 className="w-4 h-4 shrink-0" />,
      className: "bg-emerald-50 border-emerald-200 text-emerald-700",
    },
    REJECTED: {
      label:     "Your previous application was rejected. You may apply again.",
      icon:      <XCircle className="w-4 h-4 shrink-0" />,
      className: "bg-red-50 border-red-200 text-red-600",
    },
  }

  const appBanner = appStatus ? statusConfig[appStatus] : null

  // Can apply only if no active application, or the previous one was rejected
  const canApply = isAvailable && (!existingApp || appStatus === "REJECTED")

  return (
    <div className="min-h-screen pb-20">
      {/* Top bar */}
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 text-stone-500 rounded-xl">
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </Button>
        <Badge variant="outline" className="font-mono text-xs">
          #{land.id.slice(-8).toUpperCase()}
        </Badge>
      </div>

      <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Left – visuals */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 shadow-lg">
            {land.heroImageUrl
              ? <img src={land.heroImageUrl} alt={land.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-16 h-16 text-stone-200" /></div>
            }
            <div className={cn(
              "absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm",
              isAvailable ? "bg-emerald-500 text-white" : "bg-stone-700 text-stone-100"
            )}>
              {land.status}
            </div>
          </div>

          {land.galleryUrls?.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {land.galleryUrls.map((url: string, i: number) => (
                <div key={i} className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-stone-100 border border-stone-100">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right – details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">{land.title}</h1>
            <div className="flex items-center gap-1.5 mt-2 text-stone-500 text-sm">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
              {land.location}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-50 rounded-xl p-4">
              <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest mb-1">Area</p>
              <p className="font-black text-stone-800 flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-stone-400" />
                {land.sizeInSqmeter?.toFixed(1)} m²
              </p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest mb-1">Monthly Rent</p>
              <p className="font-black text-emerald-700 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" />
                ₨ {land.pricePerMonth?.toLocaleString()}
              </p>
            </div>
          </div>

          {land.owner && (
            <div className="bg-stone-900 rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {land.owner.name?.charAt(0) ?? "O"}
              </div>
              <div>
                <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest">Landowner</p>
                <p className="text-white font-bold text-sm">{land.owner.name ?? "Anonymous"}</p>
              </div>
              <BadgeCheck className="w-4 h-4 text-emerald-400 ml-auto" />
            </div>
          )}

          <Separator />

          <div>
            <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest mb-2">Description</p>
            <p className="text-stone-600 text-sm leading-relaxed">{land.description}</p>
          </div>

          {land.lalpurjaUrl && (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="text-blue-700 text-sm font-medium">Lalpurja / ownership document verified</span>
            </div>
          )}

          {/* Application status banner */}
          {appsLoading ? (
            <div className="flex items-center gap-2 text-stone-400 text-sm py-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              Checking your application status…
            </div>
          ) : appBanner && (
            <div className={cn(
              "flex items-center gap-2 border rounded-xl px-4 py-3 text-sm font-medium",
              appBanner.className
            )}>
              {appBanner.icon}
              <span className="flex-1">{appBanner.label}</span>
              {appStatus === "ACCEPTED" && existingApp && (
                <Link
                  href={`/checkout/${existingApp.id}`}
                  className="text-xs font-bold underline underline-offset-2 shrink-0"
                >
                  Pay Escrow →
                </Link>
              )}
            </div>
          )}

          {/* CTA button */}
          {appsLoading ? (
            <Button disabled className="w-full h-12 rounded-2xl font-bold text-base">
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading…
            </Button>
          ) : canApply ? (
            <Link href={`/dashboard/lands/${land.id}/send-application`}>
              <Button className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base gap-2 shadow-md shadow-emerald-100">
                <FileText className="w-4 h-4" /> Apply to Lease This Land
              </Button>
            </Link>
          ) : !isAvailable ? (
            <Button disabled className="w-full h-12 rounded-2xl font-bold text-base">
              Not Available
            </Button>
          ) : null /* PENDING or ACCEPTED: banner above is sufficient */}

        </div>
      </main>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <Skeleton className="aspect-[4/3] rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4 rounded-xl" />
        <Skeleton className="h-4 w-1/2 rounded-xl" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-12 rounded-2xl" />
      </div>
    </div>
  )
}