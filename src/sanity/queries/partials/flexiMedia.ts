import { groq } from 'next-sanity'

const flexiMediaQuery = (name: string) => groq`
  ${name} {
    mediaType == 'image' => {
      "image": {
        "asset": image.asset,
        "dimensions": image.asset->metadata.dimensions,
        "alt": image.alt,
      }
    },
    mediaType == 'video' => {
      videoSource == 'upload' => {
        "video": {
          "asset": video.asset->url,
        }
      },
      videoSource == 'vimeo' => {
        "vimeoLink": vimeoLink,
      },
    },
  }
`
export default flexiMediaQuery
