import { As } from 'reakit-utils/types'
import type { PortableTextBlock } from '@portabletext/types'

export interface IRichText {
  value: PortableTextBlock[]
  defaultTextComponent?: As
  className?: string
}
