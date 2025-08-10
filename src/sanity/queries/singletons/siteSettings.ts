import { PageTypes } from '@/sanity/types/enums'
import { defineQuery } from 'next-sanity'
import defaultFieldsQuery from '../partials/defaultFieldsQuery'
import { externalLinkQuery } from '../partials/linkQuery'

const siteSettingsQuery = defineQuery(
  `*[_type == "${PageTypes.SiteSettings}"][0] {
    ${defaultFieldsQuery},
    title,
    description,
    ogImage,
    keywords,
    header {
      "logo": {
        "asset": logo.asset,
        "dimensions": logo.asset->metadata.dimensions,
      },
      jumpLinks[] {
        label,
        targetSection
      },
      ctaOne {
        ${externalLinkQuery()}
      },
      ctaTwo {
        ${externalLinkQuery()}
      }
    },
    footer {
      "logo": {
        "asset": logo.asset,
        "dimensions": logo.asset->metadata.dimensions,
      },
      signCta {
        ${externalLinkQuery()}
      },
      headline,
      quicklinks[] {
        label,
        url
      },
      contact[] {
        label,
        url
      },
      access,
      rightsCopy,
      privacyPolicy
    }
  }`,
)

export default siteSettingsQuery
