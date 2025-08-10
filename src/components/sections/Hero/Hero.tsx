'use client'

import { useRef } from 'react'
import clsx from 'clsx'
import { ScrollScene, UseCanvas, useScrollRig } from '@14islands/r3f-scroll-rig'
import Image from 'next/image'

import { Row, Column } from '@/components/core/Grid'
import Container from '@/components/core/Container'
import RichText from '@/components/ui/RichText'

import Button from '@/components/ui/Button'
import { H1, H4 } from '@/components/ui/Text'
import useStore from '@/context/ui'
import FadeIn from '@/components/motion/FadeIn'
import StaggerText from '@/components/motion/StaggerText'
import Scene from '@/components/sections/Three/Scene'
import useBreakpoint from '@/components/hooks/useBreakpoint'

import { IHero } from './HeroTypes'

import iphones from '@/assets/images/iphones.png'

import s from './Hero.module.scss'

const Hero = ({ data }: IHero) => {
  const mobilesScene = useRef(null!)

  const loaded = useStore((s) => s.loaded)

  const { hasSmoothScrollbar } = useScrollRig()

  const isMedium = useBreakpoint('medium')

  if (!data) return null

  const { description, cta } = data

  return (
    <Container
      id="hero"
      as="section"
      className={clsx(s.container, loaded && s.loaded)}
    >
      <Row as={H1} className={s.headline}>
        <Column initial={6} medium={4} className={s.better}>
          <StaggerText text="Better" trigger={loaded} delay={1.2} />
        </Column>
        <Column
          ref={mobilesScene}
          initial={0}
          medium={2}
          className={s.mobilesScene}
        />
        {hasSmoothScrollbar && (
          <UseCanvas>
            <ScrollScene track={mobilesScene} hideOffscreen={false}>
              {(props) => <Scene {...props} />}
            </ScrollScene>
          </UseCanvas>
        )}
        <Column initial={6} medium={6}>
          <StaggerText text="Decisions" trigger={loaded} delay={1.4} />
        </Column>
        <Column initial={0} medium={6} />
        <Column initial={6} medium={4} className={s.faster}>
          <StaggerText text="Faster" trigger={loaded} delay={1.6} />
        </Column>
      </Row>
      <div className={s.mobileMobiles}>
        <Image src={iphones} alt={'Two floating iPhones'} priority />
      </div>
      <Row className={s.copyRow}>
        <Column initial={0} medium={6} />
        <Column initial={5} medium={4} desktop={4} large={3} className={s.copy}>
          <FadeIn trigger={loaded} delay={isMedium ? 2 : 0.5}>
            <RichText
              value={description.body}
              className={s.description}
              defaultTextComponent={H4}
            />
          </FadeIn>
          <FadeIn trigger={loaded} delay={isMedium ? 2.2 : 0.8}>
            <Button to={cta?.externalLink?.url} theme="light">
              {cta?.externalLink?.label}
            </Button>
          </FadeIn>
        </Column>
        <Column initial={0} medium={3} />
      </Row>
    </Container>
  )
}

export default Hero
