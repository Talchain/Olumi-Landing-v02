import { defineField, defineType } from 'sanity'

import { SectionTitles, SectionTypes } from '@/sanity/types/enums'
import { ISanityImage } from '@/sanity/types/SanityImage'

export default defineType({
  title: SectionTitles.Testimonials,
  name: SectionTypes.Testimonials,
  type: 'object',
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
    }),
    defineField({
      title: 'Subtitle',
      name: 'subtitle',
      type: 'string',
    }),
    defineField({
      title: 'Testimonials List',
      name: 'testimonialsList',
      type: 'array',
      of: [
        defineField({
          title: 'Testimonial',
          name: 'testimonial',
          type: 'object',
          fields: [
            defineField({
              title: 'Description',
              name: 'description',
              type: 'text',
            }),
            defineField({
              title: 'Name',
              name: 'name',
              type: 'string',
            }),
            defineField({
              title: 'Role',
              name: 'role',
              type: 'string',
            }),
            defineField({
              title: 'Avatar',
              name: 'avatar',
              type: 'image',
            }),
          ],
        }),
      ],
    }),
  ],
})

export interface ISanityTestimonialsItem {
  name: string
  role: string
  description: string
  avatar: ISanityImage
}

export interface ISanityTestimonials {
  title: string
  subtitle: string
  testimonialsList: ISanityTestimonialsItem[]
}
