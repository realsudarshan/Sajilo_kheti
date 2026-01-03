"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function DashboardEssential() {
  const [location, setLocation] = React.useState("")
  const [area, setArea] = React.useState("")
  const [price, setPrice] = React.useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // For now, just log the values. Replace with API call / search logic later.
    console.log({ location, area, price })
  }

  return (
    <section className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900">Find Land</h2>
      <p className="text-sm text-gray-600 mt-1">Search available land by location, area, and price.</p>

      <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4 md:items-end">
        <div className="md:col-span-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City or district" />
        </div>

        <div>
          <Label htmlFor="area">Area (Ropani or Aana)</Label>
          <Input id="area" value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. 5" />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-full">
            <Label htmlFor="price">Max Price</Label>
            <Input id="price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 5,00,000" />
          </div>
        </div>

        <div className="md:col-span-4">
          <div className="flex justify-end">
            <Button type="submit">Search</Button>
          </div>
        </div>
      </form>
    </section>
  )
}
