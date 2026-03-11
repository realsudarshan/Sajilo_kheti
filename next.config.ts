// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Required to prevent Sanity studio from being server-rendered
  // which causes "createContext is not a function" with Next.js vendored React
  serverExternalPackages: ['sanity', '@sanity/client', '@sanity/vision'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}

export default nextConfig