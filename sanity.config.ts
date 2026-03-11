// sanity.config.ts — root of Next.js project
// Replace the entire file with this

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'

// These come from sanity init — keep using your env file if it exists
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  name:    'sajilokheti-blog',
  title:   'Sajilo Kheti Blog',
basePath: '/admin/studio', // Access Sanity Studio at /admin
  projectId,
  dataset,

  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})