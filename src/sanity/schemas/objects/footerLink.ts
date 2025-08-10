import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'footerLink',
  title: 'Footer Link',
  type: 'object',
  fields: [
    defineField({
      title: 'Label',
      name: 'label',
      type: 'string',
    }),
    defineField({
      title: 'URL',
      name: 'url',
      type: 'string',
    }),
  ],
})

export interface ISanityFooterLink {
  label: string
  url: string
}
