import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ArrowRight, Clock } from "lucide-react"

const articles = [
    {
        title: "Urban Gardening Basics",
        excerpt: "Master the essentials of growing food in small spaces, balconies, and rooftops.",
        readTime: "5 min read",
        category: "Guides",
        image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Soil Health Masterclass",
        excerpt: "Learn how to build and maintain healthy soil for maximum yield and sustainability.",
        readTime: "8 min read",
        category: "Soil Health",
        image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&auto=format&fit=crop"
    },
    {
        title: "Organic Pest Control",
        excerpt: "Protect your crops naturally without harmful chemicals using integrated pest management.",
        readTime: "6 min read",
        category: "Tips & Tricks",
        image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=800&auto=format&fit=crop"
    }
]

export function ELearningPreview() {
    return (
        <section className="py-20 lg:py-32 bg-emerald-50/50">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Farming Resources & Guides</h2>
                        <p className="text-lg text-gray-600">
                            Read our latest articles and expert guides to help you get the most out of your urban farming journey.
                        </p>
                    </div>
                    <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                        View All Articles
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article, index) => (
                        <Card key={index} className="group overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                            <div className="relative h-48 overflow-hidden">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                                {/* Image placeholder handling */}
                                <div className="absolute inset-0 bg-gray-200">
                                    <div className="w-full h-full bg-emerald-800 flex items-center justify-center text-emerald-100/30 font-bold text-2xl">
                                        {article.title}
                                    </div>
                                </div>

                                <Badge className="absolute top-4 right-4 z-20 bg-white/90 text-emerald-800 hover:bg-white">
                                    {article.category}
                                </Badge>
                            </div>
                            <CardHeader className="p-6 pb-4 flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-3">
                                    {article.excerpt}
                                </p>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 mt-auto">
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        <span>{article.readTime}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-6 pt-0">
                                <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent hover:text-emerald-600 text-emerald-700 font-semibold transition-colors">
                                    Read Article
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
