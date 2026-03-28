// dashboard/agreements/page.tsx
"use client"

import Link from "next/link"
import { useGetAllApplications, useGetMyApplications } from "@/queryandmutation"
import {
  ScrollText, MapPin, CheckCircle2, ExternalLink, FileText
} from "lucide-react"
import { Button }   from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export default function AgreementsPage() {
  const { data, isLoading } = useGetMyApplications({ status: "COMPLETED" })
  const completed = data?.applications ?? []

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Agreements</h1>
          <p className="text-stone-400 text-sm mt-1">Your completed lease agreements and platform terms</p>
        </div>

        {/* Platform terms card */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex items-start gap-4">
          <div className="p-3 bg-stone-50 rounded-xl shrink-0">
            <ScrollText className="w-5 h-5 text-stone-500" />
          </div>
          <div className="flex-1">
            <h2 className="font-extrabold text-stone-800">Platform Terms & Conditions</h2>
            <p className="text-stone-400 text-sm mt-1 leading-relaxed">
              All leases on SajiloKheti are governed by Nepali land lease law (Krishi Bhoomi Act 2021) and
              our platform-specific rules. Please review before submitting any application.
            </p>
            <div className="flex gap-3 mt-4">
              <Link href="/terms">
                <Button variant="outline" size="sm" className="rounded-xl font-bold border-stone-200 gap-1 text-xs">
                  <ExternalLink className="w-3 h-3" /> Read Terms
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="sm" className="rounded-xl font-bold border-stone-200 gap-1 text-xs">
                  <FileText className="w-3 h-3" /> Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Completed leases */}
        <div>
          <h2 className="font-extrabold text-stone-700 text-sm mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            Completed Leases
            {!isLoading && <span className="text-stone-400 font-medium">({completed.length})</span>}
          </h2>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
            </div>
          ) : completed.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-100 py-20 text-center shadow-sm">
              <ScrollText className="w-10 h-10 text-stone-200 mx-auto mb-3" />
              <p className="font-bold text-stone-500">No completed leases yet</p>
              <p className="text-stone-400 text-xs mt-1">Agreements will appear here once leases are fully processed.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completed.map((app: any) => (
                <div key={app.id}
                  className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex items-center gap-4 hover:border-blue-200 hover:shadow-md transition-all"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                    {app.land.heroImageUrl
                      ? <img src={app.land.heroImageUrl} alt="" className="w-full h-full object-cover" />
                      : <MapPin className="w-4 h-4 text-stone-300 m-5" />
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-stone-900 text-sm truncate">{app.land.title}</p>
                    <div className="flex items-center gap-1 text-stone-400 text-xs mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{app.land.location}</span>
                    </div>
                    <div className="flex gap-4 mt-1.5 text-xs text-stone-500 flex-wrap">
                      <span>₨{app.proposedMonthlyRent.toLocaleString()}/mo</span>
                      <span>{app.leaseDurationInMonths} months</span>
                      <span className="text-blue-600 font-semibold">✓ Completed</span>
                    </div>
                  </div>

                  {/* View */}
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/dashboard/lands/${app.land.id}`}>
                      <Button size="sm" variant="outline" className="rounded-xl text-xs font-bold border-stone-200 h-8 gap-1">
                        <ExternalLink className="w-3 h-3" /> View Land
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Note */}
        <div className="bg-stone-50 border border-stone-100 rounded-2xl p-5 text-xs text-stone-500 leading-relaxed">
          <p className="font-bold text-stone-600 mb-1">Legal Notice</p>
          All lease agreements are governed by the laws of Nepal. Signed Malpot documents are verified by our admin
          team and serve as official records. For legal inquiries contact{" "}
          <a href="mailto:legal@sajilokheti.com" className="text-emerald-600 hover:underline font-semibold">
            legal@sajilokheti.com
          </a>
          . SajiloKheti Pvt. Ltd. · Kathmandu, Nepal · Registered under Companies Act, 2063.
        </div>
      </div>
    </div>
  )
}