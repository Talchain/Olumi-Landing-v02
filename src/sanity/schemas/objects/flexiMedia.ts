import { defineField, defineType } from 'sanity'
import { ISanityImage } from '@/sanity/types/SanityImage'

export default defineType({
  name: 'flexiMedia',
  title: 'Flexible Media - image or video',
  type: 'object',
  fields: [
    defineField({
      name: 'mediaType',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
      },
      initialValue: 'image',
    }),
    defineField({
      name: 'videoSource',
      type: 'string',
      options: {
        list: [
          { title: 'File Upload', value: 'upload' },
          { title: 'Vimeo Link', value: 'vimeo' },
        ],
      },
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text (for screen readers)',
        },
      ],
      hidden: ({ parent }) => parent?.mediaType !== 'image',
    }),
    defineField({
      name: 'video',
      type: 'file',
      options: { accept: '.mp4' },
      hidden: ({ parent }) =>
        parent?.mediaType !== 'video' || parent?.videoSource !== 'upload',
    }),
    defineField({
      name: 'vimeoLink',
      type: 'url',
      title: 'Vimeo Link',
      hidden: ({ parent }) =>
        parent?.mediaType !== 'video' || parent?.videoSource !== 'vimeo',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
          allowRelative: false,
        }).warning('Must be a valid Vimeo URL'),
    }),
  ],
})

export interface ISanityFlexiMedia {
  mediaType: 'image' | 'video'
  videoSource?: 'upload' | 'vimeo'
  image?: ISanityImage
  video?: {
    asset: string
  }
  vimeoLink?: string
}
