"use client"

import React from "react"
import { Landmark, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function LandownerActionButtons() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center p-8 bg-slate-50/50 rounded-3xl">
      
      {/* --- BECOME LANDOWNER (Green & Shiny) --- */}
      <Button 
        onClick={() => router.push("/dashboard/verify-landowner")}
        size="sm"
        className="
          group relative h-12 overflow-hidden rounded-xl 
          bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600
          px-6 text-slate-900 shadow-lg shadow-emerald-500/25
          transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
          hover:shadow-emerald-500/40 border-none
        "
      >
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900/10 backdrop-blur-md">
            <Landmark size={16} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold tracking-tight">
            Become Landowner
          </span>
          <ArrowUpRight 
            size={18} 
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
          />
        </div>

        {/* Shiny Glass Reflection Animation */}
        <div className="
          absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent
          translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out
        " />
      </Button>

    </div>
  )
}