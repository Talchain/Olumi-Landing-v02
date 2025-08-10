import clsx from 'clsx'

import { IScales, IBase } from './TextTypes'

import s from './Text.module.scss'

export const SCALES: IScales = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  bodyCopy: 'bodyCopy',
  linkCopy: 'linkCopy',
}

const Base = ({
  as: Component = 'p',
  scale = 'bodyCopy',
  children,
  className,
  ...props
}: IBase) => (
  <Component {...props} className={clsx(s[SCALES[`${scale}`]], className)}>
    {children}
  </Component>
)

export const H1 = (props: IBase) => <Base as="h1" scale="h1" {...props} />
export const H2 = (props: IBase) => <Base as="h2" scale="h2" {...props} />
export const H3 = (props: IBase) => <Base as="h3" scale="h3" {...props} />
export const H4 = (props: IBase) => <Base as="h4" scale="h4" {...props} />
export const H5 = (props: IBase) => <Base as="h5" scale="h5" {...props} />
export const BodyCopy = (props: IBase) => (
  <Base as="p" scale="body" {...props} />
)
export const LinkCopy = (props: IBase) => (
  <Base as="span" scale="linkCopy" {...props} />
)
