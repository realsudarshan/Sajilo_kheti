'use client'

import Link from 'next/link'
import { MapPin, Landmark, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function LandCard({ land }: { land: any }) {
    const formatNum = (n: number) => n.toLocaleString('en-US');

    return (
        <Card className="group overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 bg-white flex flex-col h-full rounded-3xl">
            <div className="relative aspect-[16/10] overflow-hidden">
                {land.heroImageUrl ? (
                    <img src={land.heroImageUrl} alt={land.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <Landmark className="h-12 w-12 text-slate-200" />
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <Badge className="bg-white/95 backdrop-blur text-slate-900 border-none shadow-sm uppercase text-[10px] font-bold px-3">
                        {land.status.replace('_', ' ')}
                    </Badge>
                </div>
            </div>

            <CardHeader className="space-y-1">
                <div className="flex items-center text-primary text-[11px] font-bold gap-1 uppercase tracking-tighter">
                    <MapPin className="h-3 w-3" /> {land.location}
                </div>
                <CardTitle className="text-lg font-bold text-slate-900 line-clamp-1">{land.title}</CardTitle>
            </CardHeader>

            <CardContent className="flex-grow">
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">{land.description}</p>
                <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-slate-50 rounded-2xl">
                        <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Rent</span>
                        <span className="font-bold text-slate-900 font-mono">Rs {formatNum(land.pricePerMonth)}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl text-right">
                        <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Area</span>
                        <span className="font-bold text-slate-900 font-mono">{formatNum(land.sizeInSqFt)} ft²</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
                <Link href={`/dashboard/lands/${land.id}`} className="w-full">
                    <Button className="w-full rounded-2xl h-12 font-bold shadow-lg shadow-primary/10 transition-all" size="lg">
                        View Details <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}