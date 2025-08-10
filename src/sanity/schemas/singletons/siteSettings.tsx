import { CogIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

import { PageTitles, PageTypes } from '@/sanity/types/enums'
import { ISanityHeader } from '../objects/header'
import { ISanityImage } from '@/sanity/types/SanityImage'
import { ISanityFooter } from '../objects/footer'

export default defineType({
  name: PageTypes.SiteSettings,
  title: PageTitles.SiteSettings,
  type: 'document',
  icon: CogIcon,
  groups: [
    {
      title: 'Header',
      name: 'header',
    },
    {
      title: 'Footer',
      name: 'footer',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      description: 'This field is the title of your site.',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      description: 'Used both for the <meta> description tag for SEO',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Displayed on social cards and search engine results.',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        defineField({
          name: 'alt',
          description: 'Important for accessibility and SEO.',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.ogImage as any)?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        }),
        defineField({
          name: 'metadataBase',
          type: 'url',
          description: (
            <a
              href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase"
              rel="noreferrer noopener"
            >
              More information
            </a>
          ),
        }),
      ],
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags', // Enables a tag-like input interface
      },
    }),
    defineField({
      title: 'Header',
      name: 'header',
      description: 'Site header, displayed at the top of every page',
      type: 'header',
      group: 'header',
    }),
    defineField({
      title: 'Footer',
      name: 'footer',
      description: 'Site footer, displayed at the bottom of every page',
      type: 'footer',
      group: 'footer',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'SiteSettings',
      }
    },
  },
})

export interface ISanitySiteSettings {
  _id: string
  _createdAt: string
  _type: string
  header: ISanityHeader
  footer: ISanityFooter
  title?: string
  description?: string
  ogImage?: ISanityImage
  keywords: string[]
}
