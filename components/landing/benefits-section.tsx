"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2 } from "lucide-react"

const benefits = {
    borrowers: [
        "Access to fertile land without purchasing",
        "Learn valuable farming skills from experts",
        "Grow fresh, organic food for your family",
        "Connect with nature and your community",
        "Low startup costs for aspiring farmers"
    ],
    landowners: [
        "Monetize unused or vacant land",
        "Keep your land maintained and fertile",
        "Support local food security",
        "Reduce maintenance costs and effort",
        "Engage with enthusiastic community members"
    ],
    community: [
        "Increase local green spaces",
        "Reduce carbon footprint",
        "Promote sustainable living practices",
        "Strengthen neighborhood bonds",
        "Enhance local food resilience"
    ]
}

export function BenefitsSection() {
    return (
        <section id="benefits" className="py-20 lg:py-32 bg-emerald-50/50">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Join Sajilo Kheti?</h2>
                    <p className="text-lg text-gray-600">
                        Whether you have land to share or want to start growing, everyone benefits from a greener community.
                    </p>
                </div>

                <Tabs defaultValue="borrowers" className="w-full max-w-4xl mx-auto">
                    <TabsList className="grid w-full grid-cols-3 bg-emerald-100/50 p-1 mb-12 rounded-full">
                        <TabsTrigger
                            value="borrowers"
                            className="rounded-full data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-600 font-medium py-3 transition-all"
                        >
                            For Land Borrowers
                        </TabsTrigger>
                        <TabsTrigger
                            value="landowners"
                            className="rounded-full data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-600 font-medium py-3 transition-all"
                        >
                            For Landowners
                        </TabsTrigger>
                        <TabsTrigger
                            value="community"
                            className="rounded-full data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-600 font-medium py-3 transition-all"
                        >
                            For Communities
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="borrowers" className="mt-0 focus-visible:ring-0">
                        <BenefitCard
                            image="https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=1200&auto=format&fit=crop"
                            title="Start Your Farming Journey"
                            items={benefits.borrowers}
                        />
                    </TabsContent>
                    <TabsContent value="landowners" className="mt-0 focus-visible:ring-0">
                        <BenefitCard
                            image="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop"
                            title="Make Your Land Productive"
                            items={benefits.landowners}
                        />
                    </TabsContent>
                    <TabsContent value="community" className="mt-0 focus-visible:ring-0">
                        <BenefitCard
                            image="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=1200&auto=format&fit=crop"
                            title="Build a Greener Future"
                            items={benefits.community}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    )
}

function BenefitCard({ image, title, items }: { image: string, title: string, items: string[] }) {
    return (
        <Card className="border-none shadow-xl bg-white overflow-hidden rounded-3xl">
            <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-64 md:h-auto overflow-hidden">
                    {/* Fallback pattern if image fails or just a nice colored block */}
                    <div className="absolute inset-0 bg-emerald-100" />
                    {/* Using a placeholder SVG pattern or similar to keep it self-contained if needed, but the prompt implies we can make it look good. I'll stick to a nice pattern div if I was strictly offline, but Unsplash is often allowed. Given I can't check 'images.unsplash.com' from here easily, I will use a safe colorful div with text overlay for now to ensure it renders without broken images.*/}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center p-8">
                        <h3 className="text-3xl font-bold text-white/20 rotate-12">{title}</h3>
                    </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8">{title}</h3>
                    <ul className="space-y-4">
                        {items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="text-gray-600 font-medium">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}
