import { client } from '@/sanity/lib/client'

import siteSettingsQuery from '@/sanity/queries/singletons/siteSettings'
import homePageQuery from '@/sanity/queries/singletons/page.home'

import Home from './Home'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const [siteSettings, homeData] = await Promise.all([
    client.fetch(siteSettingsQuery),
    client.fetch(homePageQuery),
  ])

  return <Home siteSettings={siteSettings} homeData={homeData} />
}
