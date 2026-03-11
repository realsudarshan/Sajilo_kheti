// app/admin/studio/[[...tool]]/layout.tsx
// Required by Next.js 15+ to set correct viewport/metadata for Sanity Studio

import { metadata, viewport } from 'next-sanity/studio'
import type { Metadata, Viewport } from 'next'

export { metadata, viewport }

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}