import { defineField, defineType } from 'sanity'

import { ISanityRichText } from './richText'
import { ISanityFlexiLink } from './flexiLink'
import { SectionTitles, SectionTypes } from '@/sanity/types/enums'

export default defineType({
  title: SectionTitles.Hero,
  name: SectionTypes.Hero,
  type: 'object',
  fields: [
    defineField({
      title: 'Description',
      name: 'description',
      type: 'richText',
    }),
    defineField({
      title: 'CTA',
      name: 'cta',
      type: 'flexiLink',
    }),
  ],
})

export interface ISanityHero {
  description: ISanityRichText
  cta: ISanityFlexiLink
}
