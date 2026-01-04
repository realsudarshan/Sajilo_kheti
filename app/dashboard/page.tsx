"use client"

import { LandCard } from "@/components/dashboard/LandCard"
import { MessageBox } from "@/components/dashboard/MessageBox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    activeLeasersMessage,
    applicationSentMessage,
    pendingRequestMessage,
} from "@/data/dashboardMessageBoxes"
import type { LandType } from "@/types/land.types"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { lands as findLands } from "@/data/lands"

export default function Dashboard() {
    const [selectedLandApplication, setSelectedLandApplication] = useState<LandType | null>(null)
    const [selectedLandActive, setSelectedLandActive] = useState<LandType | null>(null)
    const [selectedLandSaved, setSelectedLandSaved] = useState<LandType | null>(null)

    // Get first 3 lands for display
    const firstThree = findLands.slice(0, 3)

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div>
                <h1 className="text-3xl font-bold">Overview — Land Leasing Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">For people who want to lease land</p>
            </div>

            {/* ===== SECTION 1: CREATE LAND (ALONE, IN MIDDLE) ===== */}
            <div className="flex justify-center">
                <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md text-center">
                    <h2 className="text-2xl font-semibold mb-2">Create Land</h2>
                    <p className="text-sm text-gray-600">Start leasing your first land today</p>
                </div>
            </div>

            {/* ===== SECTION 2: THREE TABS (APPLICATION SENT, ACTIVE LEASERS, PENDING REQUEST) ===== */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <Tabs defaultValue="applications" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="applications">Application Sent</TabsTrigger>
                        <TabsTrigger value="active">Active Leases</TabsTrigger>
                        <TabsTrigger value="pending">Pending Request</TabsTrigger>
                    </TabsList>

                    <TabsContent value="applications" className="mt-6">
                        <div>
                            <MessageBox messageBox={applicationSentMessage} />
                            <div>
                                <LandCard lands={firstThree} />
                            </div>
                            <div className="mt-6 flex justify-center">
                                <Link href="/dashboard/find-land" className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 hover:bg-blue-50 px-4 py-2 rounded transition-all duration-200">
                                    View More <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="active" className="mt-6">
                        <div>
                            <MessageBox messageBox={activeLeasersMessage} />
                            <div>
                                <LandCard lands={firstThree} />
                            </div>
                            <div className="mt-6 flex justify-center">
                                <Link href="/dashboard/find-land" className="flex items-center gap-2 text-green-600 font-medium hover:text-green-800 hover:bg-green-50 px-4 py-2 rounded transition-all duration-200">
                                    View More <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="pending" className="mt-6">
                        <div>
                            <MessageBox messageBox={pendingRequestMessage} />
                            <div>
                                <LandCard lands={firstThree} />
                            </div>
                            <div className="mt-6 flex justify-center">
                                <button disabled className="flex items-center gap-2 text-gray-400 font-medium cursor-not-allowed opacity-50 px-4 py-2 rounded">
                                    View More <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* ===== SECTION 3: MY APPLICATION, ACTIVE LAND, SAVED LAND WITH NESTED DETAILS ===== */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <Tabs defaultValue="myapp" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="myapp">My Application</TabsTrigger>
                        <TabsTrigger value="activeland">Active Land</TabsTrigger>
                        <TabsTrigger value="saved">Saved Land</TabsTrigger>
                    </TabsList>

                    {/* ===== TAB 1: MY APPLICATION ===== */}
                    <TabsContent value="myapp" className="mt-6">
                        <div className="space-y-6">
                            {/* Land Cards Section */}
                            <div>
                                <p className="text-sm text-gray-600 mb-4">Your submitted applications. Click on a land to view details below.</p>
                                <div
                                    onClick={() => setSelectedLandApplication(firstThree[0] || null)}
                                    className="cursor-pointer"
                                >
                                    <LandCard lands={firstThree} />
                                </div>
                            </div>

                            {/* Details Section - Shown below when land is selected */}
                            {selectedLandApplication && (
                                <div className="bg-gray-50 p-6 rounded-lg border">
                                    <h3 className="text-lg font-semibold mb-4">Application Details</h3>
                                    <Tabs defaultValue="details">
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="details">Details</TabsTrigger>
                                            <TabsTrigger value="timeline">Timeline</TabsTrigger>
                                            <TabsTrigger value="documents">Documents</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="details" className="mt-4">
                                            <div className="text-sm space-y-3">
                                                <p><strong>Land:</strong> {selectedLandApplication.landtitle}</p>
                                                <p><strong>Owner:</strong> {selectedLandApplication.landownername}</p>
                                                <p><strong>Location:</strong> {selectedLandApplication.landlocation}</p>
                                                <p><strong>Size:</strong> {selectedLandApplication.size}</p>
                                                <p><strong>Price:</strong> {selectedLandApplication.pricing}</p>
                                                <p><strong>Status:</strong> <span className="text-yellow-600 font-semibold">Pending</span></p>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="timeline" className="mt-4">
                                            <ul className="text-sm space-y-3">
                                                <li className="flex items-start gap-3">
                                                    <span className="text-green-600">✓</span>
                                                    <span>Application submitted</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <span className="text-blue-600">→</span>
                                                    <span>Awaiting owner review</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <span className="text-gray-400">-</span>
                                                    <span>Documents verification</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <span className="text-gray-400">-</span>
                                                    <span>Final approval</span>
                                                </li>
                                            </ul>
                                        </TabsContent>

                                        <TabsContent value="documents" className="mt-4">
                                            <p className="text-sm text-gray-600">No documents uploaded yet. Upload required documents to proceed.</p>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* ===== TAB 2: ACTIVE LAND ===== */}
                    <TabsContent value="activeland" className="mt-6">
                        <div className="space-y-6">
                            {/* Land Cards Section */}
                            <div>
                                <p className="text-sm text-gray-600 mb-4">All active lands you are currently leasing. Click on a land to view details below.</p>
                                <div
                                    onClick={() => setSelectedLandActive(findLands[0] || null)}
                                    className="cursor-pointer"
                                >
                                    <LandCard lands={findLands} />
                                </div>
                            </div>

                            {/* Details Section - Shown below when land is selected */}
                            {selectedLandActive && (
                                <div className="bg-gray-50 p-6 rounded-lg border">
                                    <h3 className="text-lg font-semibold mb-4">Land Overview</h3>
                                    <Tabs defaultValue="overview">
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="overview">Overview</TabsTrigger>
                                            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                                            <TabsTrigger value="payments">Payments</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="overview" className="mt-4">
                                            <div className="text-sm space-y-3">
                                                <p><strong>Land:</strong> {selectedLandActive.landtitle}</p>
                                                <p><strong>Owner:</strong> {selectedLandActive.landownername}</p>
                                                <p><strong>Location:</strong> {selectedLandActive.landlocation}</p>
                                                <p><strong>Size:</strong> {selectedLandActive.size}</p>
                                                <p><strong>Price:</strong> {selectedLandActive.pricing}</p>
                                                <p><strong>Status:</strong> <span className="text-green-600 font-semibold">Active</span></p>
                                                <p><strong>Lease Start:</strong> Jan 1, 2026</p>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="maintenance" className="mt-4">
                                            <ul className="text-sm space-y-2">
                                                <li>• Irrigation scheduled: Next Tuesday</li>
                                                <li>• Soil testing: Pending</li>
                                                <li>• Fertilizer application: 2 weeks ago</li>
                                                <li>• Pest control: Completed</li>
                                            </ul>
                                        </TabsContent>

                                        <TabsContent value="payments" className="mt-4">
                                            <div className="text-sm space-y-3">
                                                <p><strong>Next payment:</strong> Due in 5 days</p>
                                                <p><strong>Amount:</strong> {selectedLandActive.pricing}</p>
                                                <p><strong>Status:</strong> <span className="text-blue-600 font-semibold">Pending</span></p>
                                                <p><strong>Payment method:</strong> Bank Transfer</p>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* ===== TAB 3: SAVED LAND ===== */}
                    <TabsContent value="saved" className="mt-6">
                        <div className="space-y-6">
                            {/* Land Cards Section */}
                            <div>
                                <p className="text-sm text-gray-600 mb-4">Lands you have saved for later. Click on a land to view details below.</p>
                                <div
                                    onClick={() => setSelectedLandSaved(firstThree[1] || null)}
                                    className="cursor-pointer"
                                >
                                    <LandCard lands={firstThree} />
                                </div>
                            </div>

                            {/* Details Section - Shown below when land is selected */}
                            {selectedLandSaved && (
                                <div className="bg-gray-50 p-6 rounded-lg border">
                                    <h3 className="text-lg font-semibold mb-4">Saved Land Information</h3>
                                    <Tabs defaultValue="list">
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="list">List</TabsTrigger>
                                            <TabsTrigger value="shared">Shared</TabsTrigger>
                                            <TabsTrigger value="archived">Archived</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="list" className="mt-4">
                                            <div className="text-sm space-y-3">
                                                <p><strong>Land:</strong> {selectedLandSaved.landtitle}</p>
                                                <p><strong>Owner:</strong> {selectedLandSaved.landownername}</p>
                                                <p><strong>Location:</strong> {selectedLandSaved.landlocation}</p>
                                                <p><strong>Size:</strong> {selectedLandSaved.size}</p>
                                                <p><strong>Price:</strong> {selectedLandSaved.pricing}</p>
                                                <p><strong>Saved on:</strong> Jan 3, 2026</p>
                                                <p><strong>Notes:</strong> Good location for rice farming</p>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="shared" className="mt-4">
                                            <p className="text-sm text-gray-600">Not shared with anyone yet. You can share this land with family members or partners.</p>
                                        </TabsContent>

                                        <TabsContent value="archived" className="mt-4">
                                            <p className="text-sm text-gray-600">This land is not archived. Archive it to hide from your saved list.</p>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
