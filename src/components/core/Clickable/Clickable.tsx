import React from 'react'
import Link from 'next/link'

import { TAnchor, TButton, TClickable } from './ClickableTypes'

const externalProps = { target: '_blank', rel: 'noopener noreferrer' }

const Anchor = ({
  ariaLabel,
  to,
  className,
  style,
  children,
  target,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  ...p
}: TAnchor) => {
  const propsHash = {
    className,
    style,
    target,
    'aria-label': ariaLabel,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
  }
  const props = { ...propsHash, onClick }

  const onClickHash = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const element = document.querySelector(to)

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }

    if (onClick) onClick(event)
  }

  // anchor links
  if (/^[.#]/.test(to)) {
    return (
      // eslint-disable-next-line
      <Link href={to} scroll={false} {...propsHash} onClick={onClickHash}>
        {children}
      </Link>
    )
  }

  /* internal links */
  if (/^(\?|[./])/.test(to)) {
    return (
      <Link href={to} scroll={true} {...props}>
        {children}
      </Link>
    )
  }

  // external links
  if (/^https?:/.test(to)) {
    return (
      <a
        {...p}
        {...props}
        href={to}
        {...externalProps}
        target={target ? target : externalProps.target}
      >
        {children}
      </a>
    )
  }

  // fallback for anything strange
  return (
    <a {...p} {...props} href={to}>
      {children}
    </a>
  )
}

const Clickable = ({ to, ariaLabel, ...props }: TClickable) => {
  if (!to) return <button aria-label={ariaLabel} {...(props as TButton)} />

  return <Anchor {...(props as TAnchor)} ariaLabel={ariaLabel} to={to} />
}

export default Clickable
