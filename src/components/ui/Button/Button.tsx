import clsx from 'clsx'

import { LinkCopy } from '@/components/ui/Text'
import Clickable from '@/components/core/Clickable'

import { IButton } from './ButtonTypes'

import User from '@/assets/svg/user.svg'
import Arrow from '@/assets/svg/arrow.svg'
import ArrowGrad from '@/assets/svg/arrow-grad.svg'

import s from './Button.module.scss'

const Button = ({
  as: Component = Clickable,
  to,
  children,
  theme = 'gradient',
  icon = 'arrow',
  onClick,
  className,
  ...props
}: IButton) => {
  return (
    <Component
      to={to}
      onClick={onClick}
      className={clsx(s.link, className, [s[theme]], [s[icon]])}
      {...props}
    >
      {icon == 'arrow' && (theme == 'light' ? <ArrowGrad /> : <Arrow />)}
      {icon == 'user' && <User />}

      <LinkCopy className={s.label}>{children}</LinkCopy>
    </Component>
  )
}

export default Button
