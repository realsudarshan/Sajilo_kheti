// app/blog/new/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter }           from 'next/navigation'
import { useUser }             from '@clerk/nextjs'
import { Button }              from '@/components/ui/button'
import { Input }               from '@/components/ui/input'
import { Textarea }            from '@/components/ui/textarea'
import { Loader2, ImagePlus, X, Tag } from 'lucide-react'
import { client }              from '@/sanity/lib/client'
import { ALL_CATEGORIES_QUERY } from '@/sanity/lib/queries'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 96)
}

export default function NewBlogPostPage() {
  const { isSignedIn, isLoaded, user } = useUser()
  const router = useRouter()

  const [title,        setTitle]        = useState('')
  const [slug,         setSlug]         = useState('')
  const [excerpt,      setExcerpt]      = useState('')
  const [body,         setBody]         = useState('')
  const [categoryId,   setCategoryId]   = useState('')
  const [categories,   setCategories]   = useState<any[]>([])
  const [tagInput,     setTagInput]     = useState('')
  const [tags,         setTags]         = useState<string[]>([])
  const [heroFile,     setHeroFile]     = useState<File | null>(null)
  const [heroPreview,  setHeroPreview]  = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error,        setError]        = useState('')

  useEffect(() => {
    client.fetch(ALL_CATEGORIES_QUERY).then(setCategories)
  }, [])

  useEffect(() => { setSlug(slugify(title)) }, [title])

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/sign-in')
  }, [isLoaded, isSignedIn, router])

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setHeroFile(file)
    setHeroPreview(URL.createObjectURL(file))
  }

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (t && !tags.includes(t) && tags.length < 10) setTags([...tags, t])
    setTagInput('')
  }

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag))

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      setError('Title and body are required.')
      return
    }
    setIsSubmitting(true)
    setError('')

    try {
      // 1. Upload hero image via Sanity CDN (asset upload uses token server-side via API route)
      let heroImageAssetId: string | null = null
      if (heroFile) {
        const formData = new FormData()
        formData.append('file', heroFile)
        const uploadRes = await fetch('/api/blog/upload', {
          method: 'POST',
          body: formData,
        })
        if (!uploadRes.ok) throw new Error('Image upload failed')
        const { assetId } = await uploadRes.json()
        heroImageAssetId = assetId
      }

      // 2. Build portable text body from plain text
      const portableBody = body
        .split('\n\n')
        .filter(Boolean)
        .map((para) => ({
          _type:    'block',
          _key:     crypto.randomUUID(),
          style:    'normal',
          children: [{ _type: 'span', _key: crypto.randomUUID(), text: para.trim(), marks: [] }],
          markDefs: [],
        }))

      // 3. POST to API route — writeClient runs server-side with token
      const res = await fetch('/api/blog/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title:            title.trim(),
          slug,
          excerpt:          excerpt.trim(),
          body:             portableBody,
          categoryId:       categoryId || null,
          tags,
          heroImageAssetId,
          heroImageAlt:     title.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to publish')

      router.push(`/blog/${slug}`)
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded || !isSignedIn) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Write a Blog Post</h1>
        <p className="text-sm text-slate-500 mt-1">Share your farming knowledge with the community</p>
      </div>

      {/* Hero image */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Hero Image</label>
        {heroPreview ? (
          <div className="relative rounded-2xl overflow-hidden h-48">
            <img src={heroPreview} className="w-full h-full object-cover" alt="Hero preview" />
            <button
              onClick={() => { setHeroFile(null); setHeroPreview(null) }}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50"
            >
              <X size={14} className="text-red-500" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-emerald-400 transition-colors bg-slate-50">
            <ImagePlus size={24} className="text-slate-400" />
            <span className="text-xs text-slate-400 mt-1">Click to upload cover image</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleHeroChange} />
          </label>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Title *</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Best crops for hilly terrain in Nepal" className="rounded-xl" />
        {slug && <p className="text-xs text-slate-400 mt-1">Slug: /blog/{slug}</p>}
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Short Excerpt</label>
        <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="A brief summary (max 200 chars)" rows={2} maxLength={200} className="rounded-xl resize-none" />
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Content *</label>
        <p className="text-xs text-slate-400 mb-1">Separate paragraphs with a blank line</p>
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your post here..." rows={12} className="rounded-xl resize-none font-mono text-sm" />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="">— Select a category —</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.title}</option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Tags</label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
            placeholder="Add a tag and press Enter"
            className="rounded-xl flex-1"
          />
          <Button type="button" variant="outline" onClick={addTag} className="rounded-xl gap-1">
            <Tag size={14} /> Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 bg-teal-50 text-teal-700 text-xs px-2.5 py-1 rounded-full font-medium border border-teal-100">
                #{tag}
                <button onClick={() => removeTag(tag)} className="hover:text-red-500 ml-0.5">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">{error}</p>}

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl py-5 font-bold gap-2"
      >
        {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Publishing…</> : '🌾 Publish Post'}
      </Button>
    </div>
  )
}