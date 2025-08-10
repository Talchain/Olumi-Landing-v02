import { defineField, defineType } from 'sanity'

import { SectionTitles, SectionTypes } from '@/sanity/types/enums'
import { ISanityImage } from '@/sanity/types/SanityImage'

export default defineType({
  title: SectionTitles.Benefits,
  name: SectionTypes.Benefits,
  type: 'object',
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
    }),
    defineField({
      title: 'Subtitle',
      name: 'subtitle',
      type: 'string',
    }),
    defineField({
      title: 'Benefits List',
      name: 'benefitsList',
      type: 'array',
      of: [
        defineField({
          title: 'Benefit',
          name: 'benefit',
          type: 'object',
          fields: [
            defineField({
              title: 'Icon',
              name: 'icon',
              type: 'image',
              description:
                'If you upload an SVG and it is not displaying try optimize it first!',
            }),
            defineField({
              title: 'Title',
              name: 'title',
              type: 'string',
            }),
            defineField({
              title: 'Description',
              name: 'description',
              type: 'text',
            }),
          ],
        }),
      ],
    }),
    defineField({
      title: 'Banner',
      name: 'banner',
      type: 'image',
      description: 'Image displayed on the right of the screen (desktop)',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text (for screen readers)',
        },
      ],
    }),
  ],
})

export interface ISanityBenefitsItem {
  icon: ISanityImage
  title: string
  description: string
}

export interface ISanityBenefits {
  title: string
  subtitle: string
  benefitsList: ISanityBenefitsItem[]
  banner: ISanityImage
}
