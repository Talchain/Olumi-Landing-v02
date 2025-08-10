import { As } from 'reakit-utils/types'

export interface IButton {
  as?: As
  to?: string | ISanityExternalLink
  children?: string
  icon?: 'arrow' | 'user'
  theme?: 'light' | 'dark' | 'gradient'
  onClick?: () => void
  className?: string
}
