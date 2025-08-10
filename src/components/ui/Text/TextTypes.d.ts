import { As } from 'reakit-utils/types'

import { SCALES } from './Text'

export interface IScales {
  [key: string]: string
}

export interface IBase {
  as?: As
  scale?: keyof typeof SCALES
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}
