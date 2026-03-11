// components/blog/PostCard.tsx
'use client'

import Link                from 'next/link'
import { urlFor }          from '@/sanity/lib/image'
import { Calendar, Tag, ThumbsUp } from 'lucide-react'
import { Badge }           from '@/components/ui/badge'

interface PostCardProps {
  post: {
    _id:         string
    title:       string
    slug:        { current: string }
    heroImage?:  any
    excerpt?:    string
    authorName?: string
    authorImage?: string
    publishedAt?: string
    category?:   { title: string; slug: { current: string } }
    tags?:       string[]
    upvotes?:    string[]
  }
}

export default function PostCard({ post }: PostCardProps) {
  const imageUrl = post.heroImage
    ? urlFor(post.heroImage).width(600).height(340).url()
    : null

  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      {/* Hero Image */}
      <div className="relative h-48 bg-slate-100 shrink-0 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
            <span className="text-4xl">🌾</span>
          </div>
        )}
        {post.category && (
          <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            {post.category.title}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-sm text-slate-500 line-clamp-2 flex-1">{post.excerpt}</p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-auto">
          <div className="flex items-center gap-2">
            {post.authorImage ? (
              <img src={post.authorImage} className="h-6 w-6 rounded-full object-cover" alt="" />
            ) : (
              <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700">
                {post.authorName?.[0] ?? '?'}
              </div>
            )}
            <span className="text-xs text-slate-500 font-medium">{post.authorName ?? 'Anonymous'}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {new Date(post.publishedAt).toLocaleDateString('en-NP', { month: 'short', day: 'numeric' })}
              </span>
            )}
            {post.upvotes && post.upvotes.length > 0 && (
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <ThumbsUp size={11} />
                {post.upvotes.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}