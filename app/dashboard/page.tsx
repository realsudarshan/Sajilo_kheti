"use client"

import React, { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { LandCard } from "@/components/dashboard/LandCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Landtype } from "@/types/landstype"
import { lands as findLands } from "./find-land/page"

export default function Dashboard() {
  const [selectedLandApplication, setSelectedLandApplication] = useState<Landtype | null>(null)
  const [selectedLandActive, setSelectedLandActive] = useState<Landtype | null>(null)
  const [selectedLandSaved, setSelectedLandSaved] = useState<Landtype | null>(null)

  // Get first 3 lands for display
  const firstThree = findLands.slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold">Overview — Land Leasing Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">For people who want to lease land</p>
      </div>

      {/* ===== SECTION 1: CREATE LAND & FIRST 3 TABS ===== */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {/* Create Land Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <h2 className="text-xl font-semibold">Create Land</h2>
          <Link href="/dashboard/find-land">
            <Button variant="outline">Go to Find Land</Button>
          </Link>
        </div>

        {/* Three tabs: Application Sent, Active Leasers, Pending Request */}
        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications">Application Sent</TabsTrigger>
            <TabsTrigger value="active">Active Leasers</TabsTrigger>
            <TabsTrigger value="pending">Pending Request</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="mt-6">
            <div>
              <p className="text-sm text-gray-600 mb-4">Applications you have sent to land owners.</p>
              <div>
                <LandCard lands={firstThree} />
              </div>
              <div className="mt-6 flex justify-end">
                <Link href="/dashboard/find-land">
                  <Button>View More</Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <div>
              <p className="text-sm text-gray-600 mb-4">Active leasers currently leasing lands.</p>
              <div>
                <LandCard lands={firstThree} />
              </div>
              <div className="mt-6 flex justify-end">
                <Link href="/dashboard/find-land">
                  <Button>View More</Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <div>
              <p className="text-sm text-gray-600 mb-4">Requests pending approval.</p>
              <div>
                <LandCard lands={firstThree} />
              </div>
              <div className="mt-6 flex justify-end">
                <Link href="/dashboard/find-land">
                  <Button>View More</Button>
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ===== SECTION 2: MY APPLICATION, ACTIVE LAND, SAVED LAND ===== */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <Tabs defaultValue="myapp" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="myapp">My Application</TabsTrigger>
            <TabsTrigger value="activeland">Active Land</TabsTrigger>
            <TabsTrigger value="saved">Saved Land</TabsTrigger>
          </TabsList>

          {/* ===== TAB 1: MY APPLICATION ===== */}
          <TabsContent value="myapp" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Land Cards */}
              <div className="lg:col-span-2">
                <p className="text-sm text-gray-600 mb-4">Your submitted applications.</p>
                <div
                  onClick={() => setSelectedLandApplication(firstThree[0] || null)}
                  className="cursor-pointer"
                >
                  <LandCard lands={firstThree} />
                </div>
              </div>

              {/* Right: Details of selected application */}
              <div className="lg:col-span-1">
                {selectedLandApplication ? (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-semibold mb-4">Application Details</h3>
                    <Tabs defaultValue="details">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="details" className="text-xs">Details</TabsTrigger>
                        <TabsTrigger value="timeline" className="text-xs">Timeline</TabsTrigger>
                        <TabsTrigger value="documents" className="text-xs">Documents</TabsTrigger>
                      </TabsList>

                      <TabsContent value="details" className="mt-3">
                        <div className="text-sm space-y-2">
                          <p><strong>Land:</strong> {selectedLandApplication.landtitle}</p>
                          <p><strong>Owner:</strong> {selectedLandApplication.landownername}</p>
                          <p><strong>Size:</strong> {selectedLandApplication.size}</p>
                          <p><strong>Price:</strong> {selectedLandApplication.pricing}</p>
                          <p><strong>Status:</strong> <span className="text-yellow-600">Pending</span></p>
                        </div>
                      </TabsContent>

                      <TabsContent value="timeline" className="mt-3">
                        <ul className="text-sm space-y-2">
                          <li>✓ Application submitted</li>
                          <li>→ Awaiting owner review</li>
                          <li>- Documents verification</li>
                          <li>- Final approval</li>
                        </ul>
                      </TabsContent>

                      <TabsContent value="documents" className="mt-3">
                        <p className="text-sm text-gray-600">No documents uploaded yet.</p>
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg border text-center">
                    <p className="text-sm text-gray-600">Click on a land card to see details</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ===== TAB 2: ACTIVE LAND ===== */}
          <TabsContent value="activeland" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Land Cards */}
              <div className="lg:col-span-2">
                <p className="text-sm text-gray-600 mb-4">All active lands you are currently leasing.</p>
                <div
                  onClick={() => setSelectedLandActive(findLands[0] || null)}
                  className="cursor-pointer"
                >
                  <LandCard lands={findLands} />
                </div>
              </div>

              {/* Right: Details of selected active land */}
              <div className="lg:col-span-1">
                {selectedLandActive ? (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-semibold mb-4">Land Overview</h3>
                    <Tabs defaultValue="overview">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                        <TabsTrigger value="maintenance" className="text-xs">Maintenance</TabsTrigger>
                        <TabsTrigger value="payments" className="text-xs">Payments</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="mt-3">
                        <div className="text-sm space-y-2">
                          <p><strong>Land:</strong> {selectedLandActive.landtitle}</p>
                          <p><strong>Owner:</strong> {selectedLandActive.landownername}</p>
                          <p><strong>Size:</strong> {selectedLandActive.size}</p>
                          <p><strong>Price:</strong> {selectedLandActive.pricing}</p>
                          <p><strong>Status:</strong> <span className="text-green-600">Active</span></p>
                        </div>
                      </TabsContent>

                      <TabsContent value="maintenance" className="mt-3">
                        <ul className="text-sm space-y-2">
                          <li>• Irrigation scheduled: Next Tuesday</li>
                          <li>• Soil testing: Pending</li>
                          <li>• Fertilizer application: 2 weeks ago</li>
                        </ul>
                      </TabsContent>

                      <TabsContent value="payments" className="mt-3">
                        <div className="text-sm space-y-2">
                          <p><strong>Next payment:</strong> Due in 5 days</p>
                          <p><strong>Amount:</strong> {selectedLandActive.pricing}</p>
                          <p><strong>Status:</strong> <span className="text-blue-600">Pending</span></p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg border text-center">
                    <p className="text-sm text-gray-600">Click on a land card to see details</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ===== TAB 3: SAVED LAND ===== */}
          <TabsContent value="saved" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Land Cards */}
              <div className="lg:col-span-2">
                <p className="text-sm text-gray-600 mb-4">Lands you have saved for later.</p>
                <div
                  onClick={() => setSelectedLandSaved(firstThree[1] || null)}
                  className="cursor-pointer"
                >
                  <LandCard lands={firstThree} />
                </div>
              </div>

              {/* Right: Details of selected saved land */}
              <div className="lg:col-span-1">
                {selectedLandSaved ? (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-semibold mb-4">Saved Land Info</h3>
                    <Tabs defaultValue="list">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="list" className="text-xs">List</TabsTrigger>
                        <TabsTrigger value="shared" className="text-xs">Shared</TabsTrigger>
                        <TabsTrigger value="archived" className="text-xs">Archived</TabsTrigger>
                      </TabsList>

                      <TabsContent value="list" className="mt-3">
                        <div className="text-sm space-y-2">
                          <p><strong>Land:</strong> {selectedLandSaved.landtitle}</p>
                          <p><strong>Owner:</strong> {selectedLandSaved.landownername}</p>
                          <p><strong>Size:</strong> {selectedLandSaved.size}</p>
                          <p><strong>Price:</strong> {selectedLandSaved.pricing}</p>
                          <p><strong>Saved on:</strong> Jan 3, 2026</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="shared" className="mt-3">
                        <p className="text-sm text-gray-600">Not shared with anyone yet.</p>
                      </TabsContent>

                      <TabsContent value="archived" className="mt-3">
                        <p className="text-sm text-gray-600">This land is not archived.</p>
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg border text-center">
                    <p className="text-sm text-gray-600">Click on a land card to see details</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
