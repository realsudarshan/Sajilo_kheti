'use client'

import React, { useEffect, useState } from 'react'
import { Search, X, Landmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useSearchLands } from '@/queryandmutation'

// Import our new components
import { DescriptiveSlider } from '@/components/lands/Descriptiveslider'
import { LandCard } from '@/components/lands/LandCard'

export default function LandsPage() {
    const [location, setLocation] = useState('')
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
    const [sizeRange, setSizeRange] = useState<[number, number]>([0, 100000])

    const [debouncedParams, setDebouncedParams] = useState({
        location: '',
        minPrice: 0,
        maxPrice: 100000,
        minSize: 0,
        maxSize: 100000
    })

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedParams({
                location,
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
                minSize: sizeRange[0],
                maxSize: sizeRange[1]
            })
        }, 400)
        return () => clearTimeout(timer)
    }, [location, priceRange, sizeRange])

    const { data, isLoading, error } = useSearchLands({
        location: debouncedParams.location || undefined,
        minPrice: debouncedParams.minPrice,
        maxPrice: debouncedParams.maxPrice,
        minSize: debouncedParams.minSize,
        maxSize: debouncedParams.maxSize,
    })

    const handleReset = () => {
        setLocation('')
        setPriceRange([0, 100000])
        setSizeRange([0, 100000])
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">
                <header className="space-y-2 text-center md:text-left">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                        Explore <span className="text-primary">Lands</span>
                    </h1>
                    <p className="text-slate-500 text-lg">Find premium plots with 10k increment precision.</p>
                </header>

                <Card className="shadow-2xl shadow-slate-200 border-none bg-white rounded-3xl overflow-hidden sticky top-6 z-40">
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            <div className="lg:col-span-4 space-y-3">
                                <Label className="text-[11px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-2">Search Region</Label>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input 
                                        placeholder="City or district..." 
                                        className="pl-12 h-14 bg-slate-50 border-none rounded-2xl text-base shadow-inner focus-visible:ring-primary"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="lg:col-span-3">
                                <DescriptiveSlider label="Rent Per Month" min={0} max={100000} step={10000} unit="NPR" value={priceRange} onValueChange={setPriceRange} />
                            </div>

                            <div className="lg:col-span-3">
                                <DescriptiveSlider label="Land Area" min={0} max={100000} step={1000} unit="SQFT" value={sizeRange} onValueChange={setSizeRange} />
                            </div>

                            <div className="lg:col-span-2 flex items-end">
                                <Button variant="outline" onClick={handleReset} className="w-full h-14 rounded-2xl border-dashed border-slate-300 gap-2 hover:bg-red-50 hover:text-red-600 transition-colors">
                                    <X className="h-4 w-4" /> Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-slate-800">{isLoading ? "Syncing..." : `Found ${data?.lands?.length || 0} Listings`}</h2>
                    
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => <Skeleton key={i} className="aspect-[16/10] w-full rounded-3xl" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {data?.lands?.map((land: any) => <LandCard key={land.id} land={land} />)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}