"use client"

import React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DashboardEssential } from "@/components/dashboard/essential"
import { LandCard } from "@/components/dashboard/LandCard"
import type { Landtype } from "@/types/landstype"
import { lands as findLands } from "./find-land/page"

export default function Dashboard() {
	const leaserName = "You (Leaser)"

	const myListings: Landtype[] = findLands.filter((l) => l.landownername === leaserName)
	const available: Landtype[] = findLands

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Overview</h1>
					<p className="text-sm text-gray-600">Quick summary for land leasers and everyone.</p>
				</div>
			</div>

			<Tabs defaultValue="for-leasers">
				<TabsList>
					<TabsTrigger value="for-leasers">For Land Leasers</TabsTrigger>
					<TabsTrigger value="for-people">For Common People</TabsTrigger>
				</TabsList>

				<TabsContent value="for-leasers">
					<section className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div className="bg-white p-4 rounded-lg shadow-sm">
							<p className="text-sm text-muted-foreground">Your Listings</p>
							<p className="text-2xl font-semibold">{myListings.length}</p>
						</div>
						<div className="bg-white p-4 rounded-lg shadow-sm">
							<p className="text-sm text-muted-foreground">Active Leases</p>
							<p className="text-2xl font-semibold">{Math.max(0, myListings.length - 0)}</p>
						</div>
						<div className="bg-white p-4 rounded-lg shadow-sm">
							<p className="text-sm text-muted-foreground">Pending Requests</p>
							<p className="text-2xl font-semibold">0</p>
						</div>
					</section>

					<section className="mt-6">
						<h2 className="text-lg font-medium">Your Land Listings</h2>
						<LandCard lands={myListings} />
					</section>
				</TabsContent>

				<TabsContent value="for-people">
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
						<div className="lg:col-span-1">
							<DashboardEssential />
						</div>

						<div className="lg:col-span-2">
							<h2 className="text-lg font-medium">Available Lands</h2>
							<LandCard lands={available} />
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
