import { defineField, defineType } from 'sanity'
import { ISanityRichText } from './richText'
import { EnvelopeIcon } from '@sanity/icons'

export default defineType({
  title: 'Access Card',
  name: 'accessCardFooter',
  type: 'object',
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'richText',
      description: 'Apply emphasis style to make text gradient',
    }),
    defineField({
      title: 'Description',
      name: 'description',
      type: 'text',
    }),
    defineField({
      title: 'Input Placeholder',
      name: 'placeholder',
      type: 'string',
    }),
    defineField({
      title: 'CTA',
      name: 'cta',
      type: 'flexiLink',
    }),
  ],
  preview: {
    select: {
      placeholder: 'placeholder',
    },
    prepare({ placeholder }) {
      return {
        title: placeholder || 'No placeholder set',
        media: EnvelopeIcon,
      }
    },
  },
})

export interface ISanityAccessCardFooter {
  title: ISanityRichText
  description: string
  placeholder: string
  cta: any
}
