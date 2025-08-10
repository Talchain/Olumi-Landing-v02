import { ISanityImage } from '@/sanity/types/SanityImage'
import { MotionValue } from 'framer-motion'

export interface IFadeIn {
  children: React.ReactNode
  duration?: number
  delay?: number
  trigger?: boolean
  margin?: any
  className?: string
}
