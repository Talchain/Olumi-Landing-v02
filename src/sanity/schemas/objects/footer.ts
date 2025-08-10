import { ISanityImage } from '@/sanity/types/SanityImage'
import { defineField, defineType } from 'sanity'

import { ISanityFooterLink } from './footerLink'
import { ISanityFlexiLink } from './flexiLink'
import { ISanityAccessCardFooter } from './accessCardFooter'

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'object',
  fields: [
    defineField({
      title: 'Logo',
      name: 'logo',
      description: 'Site Footer Logo',
      type: 'image',
    }),
    defineField({
      title: 'Sign CTA',
      name: 'signCta',
      type: 'flexiLink',
      description: 'Dark theme button (Sign in)',
    }),

    defineField({
      title: 'Headline',
      name: 'headline',
      type: 'string',
    }),
    defineField({
      title: 'Quicklinks',
      name: 'quicklinks',
      type: 'array',
      of: [{ type: 'footerLink' }],
    }),
    defineField({
      title: 'Contact',
      name: 'contact',
      type: 'array',
      of: [{ type: 'footerLink' }],
    }),
    defineField({
      title: 'Access',
      name: 'access',
      type: 'accessCardFooter',
    }),
    defineField({
      title: 'Rights Copy',
      name: 'rightsCopy',
      type: 'string',
    }),
    defineField({
      title: 'Privacy Policy',
      name: 'privacyPolicy',
      type: 'footerLink',
    }),
  ],
})

export interface ISanityFooter {
  _id: string
  _createdAt: string
  _type: string
  logo: ISanityImage
  signCta: ISanityFlexiLink
  headline: string
  quicklinks: ISanityFooterLink[]
  contact: ISanityFooterLink[]
  access: ISanityAccessCardFooter
  rightsCopy: string
  privacyPolicy: ISanityFooterLink
}
