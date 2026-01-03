import React from 'react'
import { DashboardEssential } from "@/components/dashboard/essential"

export default function FindLand() {
  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardEssential />

      <div className="mt-8">
        <p className="text-sm text-gray-600">No results yet. Use the search above to find available land listings.</p>
      </div>
    </div>
  )
}
