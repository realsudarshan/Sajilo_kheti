'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useSearchLands } from '@/queryandmutation'
import { DollarSign, MapPin, Maximize2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Lands() {
    const [location, setLocation] = useState('')
    const [minPrice, setMinPrice] = useState<number | undefined>()
    const [maxPrice, setMaxPrice] = useState<number | undefined>()
    const [minSize, setMinSize] = useState<number | undefined>()
    const [maxSize, setMaxSize] = useState<number | undefined>()

    const { data, isLoading, error, refetch } = useSearchLands({
        location: location || undefined,
        minPrice,
        maxPrice,
        minSize,
        maxSize,
    })

    const handleFilter = () => {
        refetch()
    }

    const handleReset = () => {
        setLocation('')
        setMinPrice(undefined)
        setMaxPrice(undefined)
        setMinSize(undefined)
        setMaxSize(undefined)
    }

    return (
        <div className="flex flex-col gap-6 py-6 px-4 lg:px-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Available Lands</h1>
                <p className="text-muted-foreground">Browse and filter available lands for lease</p>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Location Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Location</label>
                            <Input
                                placeholder="e.g., Kathmandu"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        {/* Price Range */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Min Price (NPR/month)</label>
                            <Input
                                type="number"
                                placeholder="Min price"
                                value={minPrice || ''}
                                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Max Price (NPR/month)</label>
                            <Input
                                type="number"
                                placeholder="Max price"
                                value={maxPrice || ''}
                                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                            />
                        </div>

                        {/* Size Range */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Min Size (sq ft)</label>
                            <Input
                                type="number"
                                placeholder="Min size"
                                value={minSize || ''}
                                onChange={(e) => setMinSize(e.target.value ? Number(e.target.value) : undefined)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Max Size (sq ft)</label>
                            <Input
                                type="number"
                                placeholder="Max size"
                                value={maxSize || ''}
                                onChange={(e) => setMaxSize(e.target.value ? Number(e.target.value) : undefined)}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                    <Button onClick={handleFilter}>Apply Filters</Button>
                    <Button variant="outline" onClick={handleReset}>Reset</Button>
                </CardFooter>
            </Card>

            {/* Results */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i}>
                            <Skeleton className="h-48 w-full rounded-t-lg" />
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-2/3" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-12">
                    <p className="text-destructive">Error loading lands: {error.message}</p>
                </div>
            ) : data?.lands && data.lands.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.lands.map((land) => (
                        <Card key={land.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Land Image */}
                            <div className="relative h-48 bg-muted">
                                {land.heroImageUrl ? (
                                    <img
                                        src={land.heroImageUrl}
                                        alt={land.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Maximize2 className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                )}
                                <Badge className="absolute top-2 right-2" variant={
                                    land.status === 'AVAILABLE' ? 'default' :
                                        land.status === 'LEASED' ? 'destructive' : 'secondary'
                                }>
                                    {land.status}
                                </Badge>
                            </div>

                            <CardHeader>
                                <CardTitle className="line-clamp-1">{land.title}</CardTitle>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span className="line-clamp-1">{land.location}</span>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-2">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {land.description}
                                </p>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-semibold">NPR {land.pricePerMonth.toLocaleString()}/mo</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Maximize2 className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{land.sizeInSqFt.toLocaleString()} sq ft</span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Link href={`/dashboard/lands/${land.id}`} className="w-full">
                                    <Button className="w-full">View Details</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No lands found matching your criteria.</p>
                    <Button variant="outline" onClick={handleReset} className="mt-4">
                        Clear Filters
                    </Button>
                </div>
            )}
        </div>
    )
}
