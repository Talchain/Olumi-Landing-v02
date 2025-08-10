import { defineField, defineType } from 'sanity'

import { ISanityFlexiLink } from './flexiLink'
import { ISanityJumpLink } from './jumpLink'
import { ISanityImage } from '@/sanity/types/SanityImage'

export default defineType({
  title: 'Header',
  name: 'header',
  type: 'object',
  fields: [
    defineField({
      title: 'Logo',
      name: 'logo',
      description: 'Site Header Logo',
      type: 'image',
    }),
    defineField({
      title: 'Jump Links',
      name: 'jumpLinks',
      type: 'array',
      description:
        'List of jump link that will be displayed in the center of the header',
      of: [
        defineField({
          title: 'Link',
          name: 'link',
          type: 'jumpLink',
        }),
      ],
    }),
    defineField({
      title: 'CTA One',
      name: 'ctaOne',
      type: 'flexiLink',
      description: 'Light theme button',
    }),
    defineField({
      title: 'CTA Two',
      name: 'ctaTwo',
      type: 'flexiLink',
      description: 'Dark theme button (Sign in)',
    }),
  ],
})

export interface ISanityHeader {
  logo: ISanityImage
  jumpLinks: ISanityJumpLink[]
  ctaOne: ISanityFlexiLink
  ctaTwo: ISanityFlexiLink
}
