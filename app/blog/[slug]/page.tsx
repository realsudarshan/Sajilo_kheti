// app/blog/[slug]/page.tsx
import { client }          from '@/sanity/lib/client'
import { POST_BY_SLUG_QUERY, COMMENTS_BY_POST_QUERY } from '@/sanity/lib/queries'
import { urlFor }          from '@/sanity/lib/image'
import { PortableText }    from '@portabletext/react'
import { auth }            from '@clerk/nextjs/server'
import { notFound }        from 'next/navigation'
import { Calendar, ArrowLeft } from 'lucide-react'
import Link                from 'next/link'
import CommentSection      from '@/components/blog/CommentSection'

export const revalidate = 30

const ptComponents = {
  types: {
    image: ({ value }: any) => {
      const url = urlFor(value).width(800).url()
      return (
        <figure className="my-8">
          <img src={url} alt={value.alt ?? ''} className="w-full rounded-2xl object-cover" />
          {value.caption && (
            <figcaption className="text-center text-sm text-slate-400 mt-2">{value.caption}</figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    h1: ({ children }: any) => <h1 className="text-3xl font-black mt-8 mb-4 text-slate-900">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold mt-6 mb-3 text-slate-900">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold mt-5 mb-2 text-slate-800">{children}</h3>,
    normal: ({ children }: any) => <p className="text-slate-700 leading-relaxed mb-4">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-emerald-400 pl-4 italic text-slate-600 my-6">{children}</blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-bold text-slate-900">{children}</strong>,
    code:   ({ children }: any) => <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-emerald-700">{children}</code>,
    link:   ({ value, children }: any) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline hover:text-emerald-700">
        {children}
      </a>
    ),
  },
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug }   = await params
  const { userId } = await auth()

  const post = await client.fetch(POST_BY_SLUG_QUERY, { slug })
  if (!post) notFound()

  const comments = await client.fetch(COMMENTS_BY_POST_QUERY, { postId: post._id })

  const heroUrl = post.heroImage ? urlFor(post.heroImage).width(1200).height(600).url() : null

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">

      {/* Back */}
      <Link href="/blog" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 font-medium transition-colors">
        <ArrowLeft size={14} /> Back to Blog
      </Link>

      {/* Hero */}
      <article>
        {heroUrl && (
          <img src={heroUrl} alt={post.title} className="w-full h-72 object-cover rounded-3xl mb-8" />
        )}

        {/* Category + Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {post.category && (
            <Link href={`/blog?category=${post.category.slug.current}`}>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {post.category.title}
              </span>
            </Link>
          )}
          {post.tags?.map((tag: string) => (
            <Link key={tag} href={`/blog?tag=${tag}`}>
              <span className="bg-slate-100 text-slate-500 text-xs px-2.5 py-1 rounded-full font-medium hover:bg-teal-50 hover:text-teal-600 transition-colors">
                #{tag}
              </span>
            </Link>
          ))}
        </div>

        <h1 className="text-3xl font-black text-slate-900 leading-tight mb-4">{post.title}</h1>

        {/* Author + date */}
        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-slate-100">
          {post.authorImage ? (
            <img src={post.authorImage} className="h-10 w-10 rounded-full object-cover" alt="" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
              {post.authorName?.[0] ?? '?'}
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-slate-800">{post.authorName ?? 'Anonymous'}</p>
            {post.publishedAt && (
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar size={11} />
                {new Date(post.publishedAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="prose-like">
          <PortableText value={post.body} components={ptComponents} />
        </div>
      </article>

      {/* Comments + Upvote */}
      <CommentSection
        postId={post._id}
        postSlug={slug}
        initialComments={comments}
        initialUpvotes={post.upvotes ?? []}
        currentUserId={userId}
      />
    </div>
  )
}