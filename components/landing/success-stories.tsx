import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
    {
        name: "Sita Sharma",
        role: "Urban Farmer",
        content: "I always wanted to grow my own vegetables but didn't have space. Sajilo Kheti connected me with a neighbor who had a vacant lot. Now I harvest fresh spinach every week!",
        rating: 5,
        image: "/avatars/sita.png"
    },
    {
        name: "Ramesh Adhikari",
        role: "Landowner",
        content: "My land was sitting empty and collecting weeds. Now it's a beautiful garden maintained by enthusiastic young farmers. It's a win-win for everyone.",
        rating: 5,
        image: "/avatars/ramesh.png"
    },
    {
        name: "Anita Gurung",
        role: "Community Leader",
        content: "This platform has transformed our neighborhood. People are sharing produce, tips, and connecting in ways they never did before. Highly recommended!",
        rating: 5,
        image: "/avatars/anita.png"
    }
]

export function SuccessStories() {
    return (
        <section id="stories" className="py-20 lg:py-32 bg-white">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Stories from the Field</h2>
                    <p className="text-lg text-gray-600">
                        Hear from our community of growers and landowners who are making a difference.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((story, index) => (
                        <Card key={index} className="border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardContent className="p-8">
                                <div className="flex gap-1 mb-6">
                                    {[...Array(story.rating)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-emerald-500 text-emerald-500" />
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-8 leading-relaxed italic">
                                    "{story.content}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12 border-2 border-emerald-100">
                                        <AvatarImage src={story.image} alt={story.name} />
                                        <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                                            {story.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{story.name}</h4>
                                        <p className="text-sm text-emerald-600 font-medium">{story.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
