import type { ImageProps } from 'next/image'
import type { ISanityImage } from '@/sanity/types/image'

export interface INextImage extends Omit<ImageProps, 'src' | 'loader'> {
  forwardedRef?: MutableRefObject<never>
  image: ISanityImage
  ratio?: number
  onLoadingComplete?: () => void
}
