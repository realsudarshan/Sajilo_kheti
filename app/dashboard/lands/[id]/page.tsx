'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
    MapPin, Maximize2, Landmark, ArrowLeft, 
    Calendar, DollarSign, FileText, CheckCircle2 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetLandById } from '@/queryandmutation'

export default function LandDetailPage() {
    const params = useParams()
    const router = useRouter()
    const landId = params.id as string

    const { data: land, isLoading, error } = useGetLandById(landId)

    if (isLoading) return <LandDetailSkeleton />
    if (error || !land) return <ErrorState message={error?.message || "Land not found"} />

    const formatNum = (n: number) => n.toLocaleString('en-US')

    return (
        <div className="min-h-screen bg-white">
            {/* Top Navigation */}
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 text-slate-500">
                    <ArrowLeft className="h-4 w-4" /> Back to Listings
                </Button>
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                    ID: {land.id.slice(-8).toUpperCase()}
                </Badge>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Left Side: Visuals */}
                <div className="space-y-6">
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 shadow-2xl">
                        {land.heroImageUrl ? (
                            <img 
                                src={land.heroImageUrl} 
                                alt={land.title} 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Landmark className="h-20 w-20 text-slate-200" />
                            </div>
                        )}
                        <div className="absolute top-6 left-6">
                            <Badge className="bg-white/95 text-slate-900 px-4 py-1.5 shadow-xl border-none font-bold uppercase tracking-wider">
                                {land.status}
                            </Badge>
                        </div>
                    </div>

                    {/* Mini Gallery (if exists) */}
                    {land.galleryUrls && land.galleryUrls.length > 0 && (
                        <div className="grid grid-cols-4 gap-4">
                            {land.galleryUrls.map((url, i) => (
                                <div key={i} className="aspect-square rounded-2xl overflow-hidden border-2 border-slate-50">
                                    <img src={url} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side: Details */}
                <div className="flex flex-col space-y-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                            <MapPin className="h-3 w-3" /> {land.location}
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                            {land.title}
                        </h1>
                        <p className="text-slate-500 leading-relaxed max-w-lg">
                            {land.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <SpecBox 
                            icon={<DollarSign className="text-green-600" />} 
                            label="Monthly Rent" 
                            value={`NPR ${formatNum(land.pricePerMonth)}`} 
                        />
                        <SpecBox 
                            icon={<Maximize2 className="text-blue-600" />} 
                            label="Total Size" 
                            value={`${formatNum(land.sizeInSqFt)} Sq Ft`} 
                        />
                        <SpecBox 
                            icon={<FileText className="text-orange-600" />} 
                            label="Land Type" 
                            value={land.area || "N/A"} 
                        />
                        <SpecBox 
                            icon={<Calendar className="text-purple-600" />} 
                            label="Listed On" 
                            value={new Date(land.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} 
                        />
                    </div>

                    <Separator className="bg-slate-100" />

                    <div className="bg-slate-50 p-6 rounded-3xl space-y-4 border border-slate-100">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary" /> Verified Documents
                        </h3>
                        <p className="text-xs text-slate-500">
                            The Lalpurja and ownership documents for this plot have been officially verified by our system.
                        </p>
                        {land.lalpurjaUrl && (
                            <Button variant="outline" className="w-full bg-white rounded-xl shadow-sm border-slate-200">
                                View Lalpurja Document
                            </Button>
                        )}
                    </div>

                    <Button className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
                        Inquire About This Land
                    </Button>
                </div>
            </main>
        </div>
    )
}