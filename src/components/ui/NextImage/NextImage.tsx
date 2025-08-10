import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'
import type { INextImage } from './NextImageTypes'

const NextImage = ({
  forwardedRef,
  image,
  alt,
  height: inputHeight,
  width: inputWidth,
  fill,
  ratio,
  onLoadingComplete,
  ...props
}: INextImage) => {
  let height = Number(inputHeight || image?.dimensions?.height)
  let width = Number(inputWidth || image?.dimensions?.width)

  const loader = (): string => {
    try {
      if (!ratio) {
        return urlForImage(image)?.url() || ''
      } else {
        // Landscape image – adjust height if needed
        if (ratio > 1) {
          height = Number((width / ratio).toFixed(0))
        }

        // Portrait image – adjust width if needed
        if (ratio < 1) {
          width = Number((height * ratio).toFixed(0))
        }

        return urlForImage(image)?.width(width).height(height).url() || ''
      }
    } catch (err) {
      return ''
    }
  }

  return (
    <Image
      ref={forwardedRef}
      src={loader()}
      height={height}
      width={width}
      alt={alt}
      onLoadingComplete={onLoadingComplete || undefined}
      {...props}
    />
  )
}

export default NextImage
