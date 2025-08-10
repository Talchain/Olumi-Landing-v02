import { defineField, defineType } from 'sanity'

import { SectionTitles, SectionTypes } from '@/sanity/types/enums'
import { ISanityAccessCard } from './accessCard'

export default defineType({
  title: SectionTitles.Access,
  name: SectionTypes.Access,
  type: 'object',
  fields: [
    defineField({
      title: 'Title Dark',
      name: 'titleDark',
      type: 'string',
    }),
    defineField({
      title: 'Title Light',
      name: 'titleLight',
      type: 'string',
    }),
    defineField({
      title: 'Description',
      name: 'description',
      type: 'text',
    }),
    defineField({
      title: 'Cards',
      name: 'cards',
      type: 'array',
      of: [{ type: 'accessCard' }],
    }),
  ],
})

export interface ISanityAccess {
  titleDark: string
  titleLight: string
  description: string
  cards: ISanityAccessCard[]
}
