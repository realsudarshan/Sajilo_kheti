// app/api/blog/upload/route.ts
// Handles image uploads to Sanity CDN — runs server-side so SANITY_API_TOKEN is available

import { auth }                  from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { writeClient }           from '@/sanity/lib/client'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file     = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const asset = await writeClient.assets.upload('image', buffer, {
      filename:    file.name,
      contentType: file.type,
    })

    return NextResponse.json({ assetId: asset._id })
  } catch (err: any) {
    console.error('[blog/upload]', err)
    return NextResponse.json({ error: err?.message ?? 'Upload failed' }, { status: 500 })
  }
}