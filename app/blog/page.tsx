// app/blog/page.tsx
import { client }         from '@/sanity/lib/client'
import { ALL_POSTS_QUERY, ALL_CATEGORIES_QUERY } from '@/sanity/lib/queries'
import PostCard           from '@/components/blog/PostCard'
import Link              from 'next/link'
import { PenSquare }     from 'lucide-react'
import { Button }        from '@/components/ui/button'
import { auth }          from '@clerk/nextjs/server'

export const revalidate = 30

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string }>
}) {
  const { userId }  = await auth()
  const params      = await searchParams

  const [posts, categories] = await Promise.all([
    client.fetch(ALL_POSTS_QUERY),
    client.fetch(ALL_CATEGORIES_QUERY),
  ])

  // Filter by category or tag
  const filtered = posts.filter((p: any) => {
    if (params.category) return p.category?.slug?.current === params.category
    if (params.tag)      return p.tags?.includes(params.tag)
    return true
  })

  // Collect all unique tags across all posts
  const allTags: string[] = Array.from(
    new Set(posts.flatMap((p: any) => p.tags ?? []))
  ).slice(0, 20) as string[]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Community Blog</h1>
          <p className="text-slate-500 mt-1 text-sm">Farming tips, land stories, and lease insights from our community</p>
        </div>
        {userId && (
          <Link href="/blog/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2 rounded-xl">
              <PenSquare size={16} /> Write Post
            </Button>
          </Link>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
            !params.category && !params.tag
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'
          }`}
        >
          All
        </Link>
        {categories.map((cat: any) => (
          <Link
            key={cat._id}
            href={`/blog?category=${cat.slug.current}`}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              params.category === cat.slug.current
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'
            }`}
          >
            {cat.title}
          </Link>
        ))}
      </div>

      {/* Tag cloud */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${tag}`}
              className={`text-xs px-2.5 py-1 rounded-full font-medium border transition-colors ${
                params.tag === tag
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-teal-400'
              }`}
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Posts grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">No posts found.</p>
          {userId && (
            <Link href="/blog/new" className="mt-4 inline-block">
              <Button variant="outline" className="gap-2 mt-4">
                <PenSquare size={14} /> Be the first to write one
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post: any) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}