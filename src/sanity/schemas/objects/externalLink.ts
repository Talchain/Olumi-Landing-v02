import { defineField, defineType } from 'sanity'

export default defineType({
  title: 'Link',
  name: 'externalLink',
  type: 'object',
  fields: [
    defineField({
      title: 'Label',
      name: 'label',
      type: 'string',
    }),
    defineField({
      title: 'Url',
      name: 'url',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          allowRelative: true,
          scheme: ['https', 'http', 'mailto', 'tel'],
        }),
    }),
  ],
  options: {
    collapsible: false,
  },
})

export interface ISanityExternalLink {
  label: string
  url: string
  isExternal: boolean
}
