import { groq } from 'next-sanity'

import { PageTypes } from '@/sanity/types/enums'

// Reusable queries for links
// 'name' needs to match the name of the field in the schema
// Useful when using internal or external links on their own

export const externalLinkQuery = (name = 'externalLink') => groq`
  "label": ${name}.label,
  "url": ${name}.url,
  "linkType": "external"
`

export const internalLinkQuery = (name = 'internalLink') => groq`
  "label": ${name}.label,
  "url": "/" + ${name}.internalPage->slug.current,
  ${name}.internalPage->_type == '${PageTypes.Home}' => {
    "url": "/",
  },
  "linkType": "internal"
`

const splitFlexiLink = groq`
  linkType == "external" => {
    ${externalLinkQuery()}
  },
  linkType == "internal" => {
    ${internalLinkQuery()}
  }
`

export const flexiLinkQuery = (name = '') => {
  if (!name) {
    return splitFlexiLink
  } else {
    return groq`
      ${name} {
        ${splitFlexiLink}
      }
    `
  }
}
