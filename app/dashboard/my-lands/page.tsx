"use client"

import React from "react"
import { FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function NoLeasesPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
      {/* Icon Circle */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-400">
        <FileText size={40} strokeWidth={1.5} />
      </div>

      {/* Text Content */}
      <h3 className="mb-2 text-xl font-bold text-slate-900">
        No Active Land Leases
      </h3>
      <p className="mb-8 max-w-[280px] text-sm text-slate-500">
        You don't have any active lease agreements at the moment. Explore available lands to get started.
      </p>

      {/* Action Button */}
      <Button 
        onClick={() => router.push("/dashboard/lands")} // Or your marketplace route
        className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-6 font-semibold hover:bg-emerald-700 transition-all shadow-md hover:shadow-emerald-200"
      >
        <Plus size={18} />
        Browse Available Lands
      </Button>
    </div>
  )
}