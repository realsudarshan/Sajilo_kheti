// components/landing/ELearningPreview.tsx
import { Badge }   from "@/components/ui/badge"
import { Button }  from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ArrowRight, Clock } from "lucide-react"
import Link        from "next/link"
import { client }  from "@/sanity/lib/client"
import { urlFor }  from "@/sanity/lib/image"
import { LATEST_POSTS_QUERY } from "@/sanity/lib/queries"

export async function ELearningPreview() {
  const posts = await client.fetch(LATEST_POSTS_QUERY)

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
          <Link href="/blog">
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              View All Blogs
            </Button>
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No blog posts yet. Be the first to write one!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => {
              const imageUrl = post.heroImage
                ? urlFor(post.heroImage).width(800).height(400).url()
                : null

              return (
                <Link key={post._id} href={`/blog/${post.slug.current}`}>
                  <Card className="group overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />

                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-emerald-800 flex items-center justify-center">
                          <span className="text-5xl">🌾</span>
                        </div>
                      )}

                      {post.category && (
                        <Badge className="absolute top-4 right-4 z-20 bg-white/90 text-emerald-800 hover:bg-white">
                          {post.category.title}
                        </Badge>
                      )}
                    </div>

                    <CardHeader className="p-6 pb-4 flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {post.excerpt ?? "Read the full article to learn more."}
                      </p>
                    </CardHeader>

                    <CardContent className="p-6 pt-0 mt-auto">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime ?? "3 min read"}</span>
                        </div>
                        {post.authorName && (
                          <span className="text-gray-400">by {post.authorName}</span>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="p-6 pt-0">
                      <div className="w-full flex justify-between items-center p-0 text-emerald-700 font-semibold group-hover:text-emerald-600 transition-colors">
                        Read Article
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}