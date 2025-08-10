import { groq } from 'next-sanity'

const defaultFieldsQuery = groq`
  _id,
  _createdAt,
  _type,
  title,
  "slug": slug.current
`

export default defaultFieldsQuery
