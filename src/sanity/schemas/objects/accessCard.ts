import { defineField, defineType } from 'sanity'
import { ISanityRichText } from './richText'
import { EnvelopeIcon, LockIcon } from '@sanity/icons'

export default defineType({
  title: 'Access Card',
  name: 'accessCard',
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
      title: 'Input Label',
      name: 'label',
      type: 'string',
    }),
    defineField({
      title: 'Input Placeholder',
      name: 'placeholder',
      type: 'string',
    }),
    defineField({
      title: 'Is Password Field?',
      name: 'isPassword',
      type: 'boolean',
      initialValue: false,
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
      isPassword: 'isPassword',
    },
    prepare({ placeholder, isPassword }) {
      return {
        title: placeholder || 'No placeholder set',
        media: isPassword ? LockIcon : EnvelopeIcon,
      }
    },
  },
})

export interface ISanityAccessCard {
  title: ISanityRichText
  description: string
  label: string
  placeholder: string
  isPassword: boolean
  cta: any
}
