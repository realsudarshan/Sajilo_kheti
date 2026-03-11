// app/api/blog/post/route.ts

import { auth, currentUser }         from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { writeClient }               from '@/sanity/lib/client'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await currentUser()
    const { title, slug, excerpt, body, categoryId, tags, heroImageAssetId, heroImageAlt } = await req.json()

    if (!title || !slug || !body) {
      return NextResponse.json({ error: 'title, slug and body are required' }, { status: 400 })
    }

    const post = await writeClient.create({
      _type:       'post',
      title,
      slug:        { _type: 'slug', current: slug },
      excerpt:     excerpt ?? '',
      body,
      tags:        tags ?? [],
      category:    categoryId ? { _type: 'reference', _ref: categoryId } : undefined,
      authorId:    userId,
      authorName:  user?.fullName ?? user?.firstName ?? 'User',
      authorImage: user?.imageUrl ?? '',
      publishedAt: new Date().toISOString(),
      upvotes:     [],
      ...(heroImageAssetId && {
        heroImage: {
          _type: 'image',
          asset: { _type: 'reference', _ref: heroImageAssetId },
          alt:   heroImageAlt ?? title,
        },
      }),
    })

    return NextResponse.json({ success: true, post })
  } catch (err: any) {
    console.error('[blog/post]', err)
    return NextResponse.json({ error: err?.message ?? 'Internal server error' }, { status: 500 })
  }
}