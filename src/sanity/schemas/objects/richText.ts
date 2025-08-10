import { BlockContentIcon } from '@sanity/icons'
import { PortableTextBlock } from 'next-sanity'
import { defineField, defineType } from 'sanity'

export default defineField({
  name: 'richText',
  title: 'Rich Text',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    {
      name: 'body',
      title: ' ',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [],
          lists: [],
          // Marks let you mark up inline text in the Portable Text Editor
          marks: {
            // Decorators usually describe a single property – e.g. a typographic
            // preference or highlighting
            decorators: [
              //   { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            // Annotations can be any object structure – e.g. a link or a footnote.
            annotations: [],
          },
        },
      ],
    },
  ],
})

export interface ISanityRichText {
  _type: 'richText'
  _key: string
  body: PortableTextBlock[]
}
