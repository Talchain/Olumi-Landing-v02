'use client'
/**
 * This config is used to set up Sanity Studio that's mounted on the `app/(sanity)/studio/[[...tool]]/page.tsx` route
 */
import { visionTool } from '@sanity/vision'
import { PluginOptions, defineConfig } from 'sanity'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { assist } from '@sanity/assist'

import { apiVersion, dataset, projectId, studioUrl } from './src/sanity/lib/api'
import { pageStructure } from '@/sanity/structure'
import { singletonPlugin } from '@/sanity/plugins/singleton'
import siteSettings from '@/sanity/schemas/singletons/siteSettings'
import homePage from '@/sanity/schemas/singletons/page.home'
import schemas from '@/sanity/schemas'

export default defineConfig({
  basePath: studioUrl,
  projectId,
  dataset,
  schema: {
    types: schemas,
  },
  plugins: [
    structureTool({ structure: pageStructure([siteSettings, homePage]) }),
    presentationTool({
      previewUrl: { previewMode: { enable: '/api/draft-mode/enable' } },
    }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    singletonPlugin([siteSettings.name]),
    // Sets up AI Assist
    // https://www.sanity.io/docs/ai-assist
    assist(),
    // Add an image asset source for Unsplash
    unsplashImageAsset(),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    process.env.NODE_ENV === 'development' &&
      visionTool({ defaultApiVersion: apiVersion }),
  ].filter(Boolean) as PluginOptions[],
})
