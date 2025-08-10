'use client'

// import { useRef, useState } from 'react'
// import { useMotionValueEvent, useScroll } from 'framer-motion'
import { useState } from 'react'
import clsx from 'clsx'
import { useScrollbar } from '@14islands/r3f-scroll-rig'
import Link from 'next/link'

import Button from '@/components/ui/Button'
import { LinkCopy } from '@/components/ui/Text'
import Container from '@/components/core/Container'
import NextImage from '@/components/ui/NextImage'
import useStore from '@/context/ui'
import FadeIn from '@/components/motion/FadeIn'
import useBreakpoint from '@/components/hooks/useBreakpoint'

import BurgerMenu from '../BurgerMenu'
import { IHeader } from './HeaderTypes'

import s from './Header.module.scss'

const Header = ({ data }: IHeader) => {
  const { scrollTo } = useScrollbar()

  const loaded = useStore((s) => s.loaded)

  const [openMenu, setOpenMenu] = useState(false)

  const isDesktop = useBreakpoint('desktop')

  // const [isScrollingDown, setIsScrollingDown] = useState(false)
  // const [isAtTop, setIsAtTop] = useState(true)

  // const { scrollY } = useScroll()

  // const scrollHistory = useRef({ lastY: 0 }).current

  // useMotionValueEvent(scrollY, 'change', (value) => {
  //   const velocity = value - scrollHistory.lastY

  //   if (velocity > 0 && value > 0 && !isScrollingDown) {
  //     setIsScrollingDown(true)
  //   } else if (velocity < 0 && isScrollingDown) {
  //     setIsScrollingDown(false)
  //   }

  //   scrollHistory.lastY = value

  //   value < 5 ? setIsAtTop(true) : setIsAtTop(false)
  // })

  if (!data) return null

  const { logo, jumpLinks, ctaOne, ctaTwo } = data

  return (
    <Container
      as="header"
      className={clsx(
        s.header,
        openMenu && s.openMenu,
        // isScrollingDown && s.isScrollingDown,
        // isAtTop && s.isAtTop,
      )}
    >
      <FadeIn className={s.burgerMenuWrapper}>
        <BurgerMenu openMenu={openMenu} setOpenMenu={setOpenMenu} />
      </FadeIn>
      <FadeIn margin="0%" trigger={loaded} duration={0.8}>
        <Link href="/" className={s.logoWrapper}>
          {!!logo?.asset && <NextImage image={logo} alt="Site Logo" priority />}
        </Link>
      </FadeIn>
      <div className={s.jumpLinks}>
        {jumpLinks.map((jumpLink, i) => (
          <FadeIn
            margin="0%"
            trigger={isDesktop ? loaded : openMenu}
            key={i}
            delay={isDesktop ? i * 0.09 : 0.6 + i * 0.09}
          >
            <Link
              href={`#${jumpLink.targetSection}`}
              onClick={(e) => {
                e.preventDefault()
                scrollTo(`#${jumpLink.targetSection}`)
                !isDesktop && setOpenMenu(false)
              }}
              key={i}
              className={s.jumpLink}
            >
              <LinkCopy>{jumpLink.label}</LinkCopy>
            </Link>
          </FadeIn>
        ))}
      </div>
      <div className={s.ctas}>
        <FadeIn margin="0%" trigger={loaded} delay={0.35}>
          <Button to={ctaOne.externalLink} theme="light">
            {ctaOne?.label}
          </Button>
        </FadeIn>

        <FadeIn margin="0%" delay={0.4} className={s.signCta}>
          <Button to={ctaTwo.externalLink} theme="dark" icon="user">
            {ctaTwo?.label}
          </Button>
        </FadeIn>
      </div>
    </Container>
  )
}

export default Header
