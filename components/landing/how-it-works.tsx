import { Search, Sprout, UserCheck } from "lucide-react"

const steps = [
    {
        icon: Search,
        title: "Browse Available Lands",
        description: "Explore listings in your local area. Filter by size, location, and soil type to find the perfect plot for your needs."
    },
    {
        icon: UserCheck,
        title: "Connect & Request",
        description: "Send a request to the landowner. Once matched, agree on terms and start your farming journey."
    },
    {
        icon: Sprout,
        title: "Start Growing",
        description: "Get access to the land, receive guidance if needed, and enjoy the harvest of your hard work."
    }
]

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 lg:py-32 bg-white">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                    <p className="text-lg text-gray-600">
                        Farming shouldn't be complicated. We've made it simple to find land and start growing in just three steps.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-100 -z-10" />

                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm ring-4 ring-white">
                                <step.icon className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                            <p className="text-gray-500 leading-relaxed px-4">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
