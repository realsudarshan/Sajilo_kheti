import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin } from "lucide-react"

export function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0fdf4_1px,transparent_1px),linear-gradient(to_bottom,#f0fdf4_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 text-emerald-700 text-sm font-medium mb-6 animate-fade-in-up">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Connecting Landowners & Urban Farmers
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                            Grow Your Own <span className="text-emerald-600">Fresh Food</span>, <br className="hidden lg:block" /> Even Without Land.
                        </h1>

                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Find unused land in your community to start farming today. From small plots to larger fields, connect with landowners and grow healthy, organic produce.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 h-12 text-base">
                                Find Land Near Me
                                <MapPin className="ml-2 h-4 w-4" />
                            </Button>
                            <Button size="lg" variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-full px-8 h-12 text-base">
                                List Your Land
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>

                        <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-gray-200" />
                                    ))}
                                </div>
                                <span className="font-medium text-gray-700">500+ Farmers</span>
                            </div>
                            <div className="h-4 w-px bg-gray-300" />
                            <div>
                                <span className="font-bold text-gray-900">120+</span> Acres Available
                            </div>
                        </div>
                    </div>

                    {/* Hero Image / Visual */}
                    <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
                        <div className="relative aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-gray-100 ring-1 ring-gray-900/10">
                            {/* Using a placeholder service or gradient since I can't generate and host images directly easily without creating artifacts first. I'll use a nice colored placeholder for now or an Unsplash URL if permitted, but standard is keep it local or generate. I will use a solid color graphic or SVG pattern for safety/speed, or an <img> with an external placeholder mostly used for dev. 
               Actually, I'll use a gradient div with some SVG patterns to look like a farm/illustration.
               */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-emerald-50 to-amber-50 flex items-center justify-center">
                                <div className="text-emerald-900/10">
                                    {/* Abstract Illustration Placeholder */}
                                    <svg viewBox="0 0 200 200" className="w-full h-full opacity-20" fill="currentColor">
                                        <path d="M40 120 Q 60 40 100 80 T 160 120" stroke="currentColor" strokeWidth="2" fill="none" />
                                        <circle cx="100" cy="180" r="80" fill="currentColor" />
                                    </svg>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-emerald-800/40 font-bold text-2xl">[Hero Image: Diverse group farming together]</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating Cards */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100 animate-bounce-slow hidden lg:block">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    🌱
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">New Listing</p>
                                    <p className="text-sm font-bold text-gray-900">0.5 Acres in Lalitpur</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
