// app/api/blog/upvote/route.ts

import { auth }                      from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { writeClient }               from '@/sanity/lib/client'
import { client }                    from '@/sanity/lib/client'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { postId } = await req.json()
    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 })
    }

    // Get current upvotes
    const post = await client.fetch(
      `*[_type == "post" && _id == $postId][0]{ upvotes }`,
      { postId }
    )

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const upvotes: string[] = post.upvotes ?? []
    const hasUpvoted = upvotes.includes(userId)

    // Toggle — add if not upvoted, remove if already upvoted
    const updatedPost = hasUpvoted
      ? await writeClient
          .patch(postId)
          .unset([`upvotes[@ == "${userId}"]`])
          .commit()
      : await writeClient
          .patch(postId)
          .setIfMissing({ upvotes: [] })
          .append('upvotes', [userId])
          .commit()

    return NextResponse.json({
      success:     true,
      hasUpvoted:  !hasUpvoted,
      upvoteCount: (updatedPost.upvotes ?? []).length,
    })
  } catch (err: any) {
    console.error('[blog/upvote]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}