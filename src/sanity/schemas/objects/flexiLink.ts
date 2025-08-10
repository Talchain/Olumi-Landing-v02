import { defineField, defineType } from 'sanity'
import { LinkIcon } from '@sanity/icons'
import { ISanityExternalLink } from './externalLink'

// Modified the flexiLink to support only externalLink for now (maybe internalLink will come up later)

export default defineType({
  title: 'Link',
  name: 'flexiLink',
  description: 'Link external page or scroll to contact form',
  type: 'object',
  icon: LinkIcon,
  fields: [
    // defineField({
    //   name: 'label',
    //   title: 'Button Label',
    //   type: 'string',
    //   validation: (Rule) => Rule.required().error('Button label is required'),
    // }),
    // defineField({
    //   name: 'linkType',
    //   title: 'Link Type',
    //   type: 'string',
    //   options: {
    //     list: [
    //       { title: 'External Link', value: 'external' },
    //       { title: 'Internal Link', value: 'internal' },
    //     ],
    //     layout: 'radio',
    //   },
    //   initialValue: 'external',
    //   validation: (Rule) => Rule.required().error('Link type is required'),
    // }),
    // defineField({
    //   title: 'Internal Link',
    //   name: 'internalLink',
    //   description: 'Internal Page',
    //   type: 'internalLink',
    //   hidden: ({ parent }) => parent?.linkType == 'external',
    // }),
    defineField({
      title: 'External Link',
      name: 'externalLink',
      description: 'URL to an external link',
      type: 'externalLink',
      // hidden: ({ parent }) => parent?.linkType == 'internal',
    }),
  ],
  preview: {
    select: {
      label: 'externalLink.label',
      externalLink: 'externalLink.url',
    },
    prepare({ label, externalLink }) {
      const title = label
      const subtitle = `External Link: ${externalLink}`
      return {
        title,
        subtitle,
      }
    },
  },
})

export interface ISanityFlexiLink {
  _type: string
  label: string
  linkType: string
  externalLink?: ISanityExternalLink
  // internalLink?: string
}
