import { defineField, defineType } from 'sanity'
import { ArrowDownIcon } from '@sanity/icons'
import { SectionTitles, SectionTypes } from '@/sanity/types/enums'

const sectionsList = Object.keys(SectionTypes).map((key) => ({
  title: SectionTitles[key as keyof typeof SectionTitles],
  value: SectionTypes[key as keyof typeof SectionTypes],
}))

export default defineType({
  title: 'Link',
  name: 'jumpLink',
  description: 'Link to scroll down to section',
  type: 'object',
  icon: ArrowDownIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Link Label',
      type: 'string',
      validation: (Rule) => Rule.required().error('Link label is required'),
    }),
    defineField({
      title: 'Target Section',
      name: 'targetSection',
      type: 'string',
      options: {
        list: sectionsList,
        layout: 'dropdown',
      },
    }),
  ],
})

export interface ISanityJumpLink {
  _type: string
  label: string
  targetSection: string
}
