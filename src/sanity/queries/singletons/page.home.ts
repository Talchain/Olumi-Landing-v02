import { defineQuery } from 'next-sanity'

import defaultFieldsQuery from '../partials/defaultFieldsQuery'

import { PageTypes } from '@/sanity/types/enums'

const homePageQuery = defineQuery(`
  *[_type == "${PageTypes.Home}"][0] {
    ${defaultFieldsQuery},
    hero,
    access,
    benefits {
      title,
      subtitle,
      benefitsList[] {
          "icon": {
            "asset": icon.asset,
            "dimensions": icon.asset->metadata.dimensions,
          },
          title,
          description
      },
      "banner": {
        "asset": banner.asset,
        "dimensions": banner.asset->metadata.dimensions,
        "alt": banner.alt,
      }
    },
    testimonials {
      title,
      subtitle,
      testimonialsList[] {
          description,
          name,
          role,
          "avatar": {
            "asset": avatar.asset,
            "dimensions": avatar.asset->metadata.dimensions,
          },
      },
    },
  }
`)

export default homePageQuery
