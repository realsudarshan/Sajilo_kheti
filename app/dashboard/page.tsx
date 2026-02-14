"use client"

import React, { useState } from "react"
import Link from "next/link"
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  History, 
  TrendingUp, 
  Search,
  ChevronRight,
  ArrowUpRight,
  User,
  Ruler,
  BadgeDollarSign
} from "lucide-react"

// Assuming these are in your project
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// --- MOCK DATA ---
const MOCK_LEASES = [
  {
    id: "LND-001",
    title: "Green Valley Fields",
    location: "Lalitpur, Nepal",
    size: "15 Ropani",
    price: "रू 50,000/year",
    status: "Active",
    owner: "Sita Sharma",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: "LND-002",
    title: "Mountain Side Organic",
    location: "Kavre, Nepal",
    size: "10 Ropani",
    price: "रू 35,000/year",
    status: "Pending",
    owner: "Ram Bahadur",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=500&auto=format&fit=crop"
  }
]

export default function LeaserDashboard() {
  const [activeLand, setActiveLand] = useState(MOCK_LEASES[0])

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* --- TOP NAVIGATION / HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
            <p className="text-slate-500 font-medium">Monitoring your leased land and applications.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl border-slate-200 shadow-sm">
              <History className="mr-2 h-4 w-4" /> History
            </Button>
            <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200">
              <Search className="mr-2 h-4 w-4" /> Find New Land
            </Button>
          </div>
        </header>

        {/* --- STATS GRID --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Active Leases" value="04" trend="+1 this month" icon={<MapIcon className="text-emerald-600"/>} />
          <StatCard label="Pending Apps" value="02" trend="Awaiting owner" icon={<TrendingUp className="text-blue-600"/>} />
          <StatCard label="Total Spent" value="रू 1.2M" trend="Annualized" icon={<BadgeDollarSign className="text-amber-600"/>} />
        </section>

        {/* --- MAIN INTERFACE --- */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-slate-100/50 p-1 rounded-2xl inline-flex border border-slate-200">
            <TabsTrigger value="overview" className="rounded-xl px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
            <TabsTrigger value="applications" className="rounded-xl px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: LIST OF LANDS */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-lg font-bold px-1">Current Leases</h3>
              <div className="grid gap-4">
                {MOCK_LEASES.map((land) => (
                  <div 
                    key={land.id}
                    onClick={() => setActiveLand(land)}
                    className={`group cursor-pointer p-4 rounded-3xl border-2 transition-all flex gap-5 items-center bg-white ${
                      activeLand.id === land.id ? 'border-emerald-500 shadow-xl' : 'border-transparent hover:border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="h-24 w-24 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={land.image} alt={land.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-lg">{land.title}</h4>
                        <Badge variant={land.status === 'Active' ? 'default' : 'secondary'} className={land.status === 'Active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''}>
                          {land.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <MapIcon size={14} /> {land.location}
                      </p>
                    </div>
                    <ChevronRight className={`transition-transform ${activeLand.id === land.id ? 'rotate-90 text-emerald-500' : 'text-slate-300'}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: DETAIL PANE */}
            <aside className="lg:col-span-5 sticky top-6">
              <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white">
                <div className="relative h-48">
                  <img src={activeLand.image} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {activeLand.id}
                  </div>
                </div>
                
                <CardHeader className="pt-8">
                  <CardTitle className="text-2xl font-black italic uppercase tracking-tight">{activeLand.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-8 pb-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Area Size</p>
                      <p className="font-bold flex items-center gap-2"><Ruler size={16} /> {activeLand.size}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Valuation</p>
                      <p className="font-bold flex items-center gap-2 text-emerald-600 font-mono italic">{activeLand.price}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Lease Holder / Owner</p>
                    <div className="flex items-center gap-4 bg-slate-900 text-white p-4 rounded-3xl">
                      <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <span className="font-bold text-sm uppercase tracking-wide">{activeLand.owner}</span>
                      <ArrowUpRight size={18} className="ml-auto text-emerald-400" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <Button className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:scale-[1.02] transition-transform">
                      View Contract
                    </Button>
                    <Button variant="link" className="text-slate-400 hover:text-red-500 font-bold transition-colors">
                      Terminate Request
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </aside>

          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function StatCard({ label, value, trend, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{trend}</span>
      </div>
      <div>
        <h2 className="text-3xl font-black tracking-tight">{value}</h2>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</p>
      </div>
    </div>
  )
}