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
        <Link href="/landowner-dashboard/list-land">
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
       <div className="space-y-4">
  {user?.lands?.slice(0, 3).map((land: any) => (
    /* Wrap the card in a Link */
    <Link 
      key={land.id} 
      href={`/landowner-dashboard/my-lands/${land.id}/applications`}
      className="block" // Ensures the link fills the space
    >
      <div className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors group">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
              {land.title}
            </p>
            <p className="text-xs text-gray-500">{land.location}</p>
          </div>
        </div>
        <ArrowUpRight className="h-5 w-5 text-gray-300 group-hover:text-emerald-500 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
      </div>
    </Link>
  ))}
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