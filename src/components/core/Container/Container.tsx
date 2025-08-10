import clsx from 'clsx'

import { IContainer } from './ContainerTypes'

import s from './Container.module.scss'

const Container: IContainer = ({
  as: Component = 'div',
  className,
  children,
  ...props
}) => (
  <Component {...props} className={clsx(s.container, className)}>
    {children}
  </Component>
)

export default Container
