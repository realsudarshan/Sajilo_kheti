"use client"

import React from 'react'
import { useGetMe } from "@/queryandmutation/index"
import { 
  Plus, 
  MapPin, 
  Users, 
  Wallet, 
  ArrowUpRight,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LandownerDashboard() {
  const { data: user, isLoading } = useGetMe();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-gray-500">Loading your estate...</p>
        </div>
      </div>
    );
  }

  // Calculate some basic stats from the user data
  const totalLands = user?.lands?.length || 0;
  // Assuming 'applications' exist on your user schema via the getMe hook


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Namaste, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Here's what's happening with your land listings today.
          </p>
        </div>
        <Link href="/landowner-dashboard/my-lands/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 h-12 shadow-lg shadow-emerald-200 transition-all hover:scale-105">
            <Plus className="mr-2 h-5 w-5" />
            List New Land
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Active Listings" 
          value={totalLands} 
          icon={<MapPin className="h-6 w-6" />}
          trend="+1 this month"
          color="emerald"
        />
       
        <StatCard 
          title="Total Earnings" 
          value="Rs. 0" 
          icon={<Wallet className="h-6 w-6" />}
          trend="Last 30 days"
          color="orange"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Land Listings */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Your Recent Listings</h2>
            <Link href="/landowner-dashboard/my-lands" className="text-sm text-emerald-600 font-semibold hover:underline">
              View all
            </Link>
          </div>
          
          <div className="p-6">
            {totalLands > 0 ? (
              <div className="space-y-4">
                {user?.lands?.slice(0, 3).map((land: any) => (
                  <div key={land.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{land.title}</p>
                        <p className="text-xs text-gray-500">{land.location}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-gray-300" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No lands listed yet</h3>
                <p className="text-gray-500 text-sm max-w-xs mb-6">
                  Turn your unused land into a productive farm by listing it for local farmers.
                </p>
                <Link href="/landowner-dashboard/my-lands/new">
                  <Button variant="outline" className="rounded-xl">Start Listing</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity / Notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-600" />
            Recent Activity
          </h2>
          <div className="space-y-6">
            {/* Placeholder for activity logs */}
            <div className="flex gap-4">
              <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">System Verified</p>
                <p className="text-xs text-gray-500">Your account was verified as a Landowner.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-2 w-2 rounded-full bg-gray-200 mt-2 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Welcome to SajiloKheti</p>
                <p className="text-xs text-gray-500">Start browsing farmer requests soon.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, trend, color }: any) {
  const colors: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          {icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded">
          {trend}
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}