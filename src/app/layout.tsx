import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity'
import type { Metadata } from 'next'
import { resolveOpenGraphImage } from '@/sanity/lib/utils'
import { sanityFetch } from '@/sanity/lib/fetch'
import siteSettingsQuery from '@/sanity/queries/singletons/siteSettings'
import localFont from 'next/font/local'

import favicon16 from '@/assets/favicons/Favicon_16x16.png'
import favicon32 from '@/assets/favicons/Favicon_32x32.png'

// Define the font once
const ppneuemontreal = localFont({
  src: [
    {
      path: '../assets/fonts/PPNeueMontreal-Variable.woff',
      weight: '400 500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/PPNeueMontreal-Variable.woff2',
      weight: '400 500',
      style: 'normal',
    },
  ],
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await sanityFetch({
    query: siteSettingsQuery,
    // Metadata should never contain stega
    stega: false,
  })
  const title = siteSettings?.title
  const description = siteSettings?.description

  const ogImage = resolveOpenGraphImage(siteSettings?.ogImage)
  let metadataBase: URL | undefined = undefined
  try {
    metadataBase = siteSettings?.ogImage?.metadataBase
      ? new URL(siteSettings.ogImage.metadataBase)
      : undefined
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: 'website',
      siteName: 'Decision AI',
      images: ogImage ? [ogImage] : [],
      url: 'https://decisionguide.ai',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: ogImage ? [ogImage] : [],
    },
    alternates: {
      canonical: 'https://decisionguide.ai',
    },
    keywords: siteSettings?.keywords?.join(', '),
  }
}

import '@/styles/styles.scss'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isEnabled: isDraftMode } = await draftMode()

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href={favicon32.src} />
        <link rel="icon" type="image/png" sizes="16x16" href={favicon16.src} />
      </head>
      <body className={ppneuemontreal.className}>
        {isDraftMode && <VisualEditing />}
        {children}
      </body>
    </html>
  )
}
