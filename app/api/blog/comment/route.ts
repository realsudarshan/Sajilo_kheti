// app/api/blog/comment/route.ts

import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await currentUser()
    const { postId, body } = await req.json()

    if (!postId || !body?.trim()) {
      return NextResponse.json({ error: 'postId and body are required' }, { status: 400 })
    }
    if (body.length > 500) {
      return NextResponse.json({ error: 'Comment too long (max 500 chars)' }, { status: 400 })
    }

    const comment = await writeClient.create({
      _type:       'comment',
      post:        { _type: 'reference', _ref: postId },
      authorId:    userId,
      authorName:  user?.fullName ?? user?.firstName ?? 'User',
      authorImage: user?.imageUrl ?? '',
      body:        body.trim(),
      createdAt:   new Date().toISOString(),
    })

    return NextResponse.json({ success: true, comment })
  } catch (err: any) {
    console.error('[blog/comment]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}