import { defineType, defineField } from 'sanity'
import { HomeIcon } from '@sanity/icons'

import { PageTypes, PageTitles } from '@/sanity/types/enums'
import { ISanityHero } from '../objects/hero'
import { ISanityAccess } from '../objects/access'
import { ISanityBenefits } from '../objects/benefits'
import { ISanityTestimonials } from '../objects/testimonials'

export default defineType({
  name: PageTypes.Home,
  title: PageTitles.Home,
  type: 'document',
  icon: HomeIcon,
  groups: [
    {
      name: 'main',
      title: 'Main',
    },
    {
      name: 'hero',
      title: 'Hero',
    },
    {
      name: 'access',
      title: 'Access',
    },
    {
      name: 'benefits',
      title: 'Benefits',
    },
    {
      name: 'testimonials',
      title: 'Testimonials',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Page title for internal reference',
      description:
        'This title will not be public. Use a descriptive page name so you can easily find this page later in the CMS.',
      type: 'string',
      group: 'main',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'main',
      description: 'Relative URL of the page to be located in the website.',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'hero',
      group: 'hero',
    }),
    defineField({
      name: 'access',
      title: 'Access Section',
      type: 'access',
      group: 'access',
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits Section',
      type: 'benefits',
      group: 'benefits',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials Section',
      type: 'testimonials',
      group: 'testimonials',
    }),
  ],
})

export interface ISanityHomePage {
  _id: string
  _createdAt: string
  _type: string
  title?: string
  slug: string
  hero: ISanityHero
  access: ISanityAccess
  benefits: ISanityBenefits
  testimonials: ISanityTestimonials
}
