'use client'

import clsx from 'clsx'

import { Row, Column } from '@/components/core/Grid'
import Container from '@/components/core/Container'
import { BodyCopy, H2 } from '@/components/ui/Text'
import FadeIn from '@/components/motion/FadeIn'

import AccessCard from './AccessCard'
import { IAccess } from './AccessTypes'
import { ISanityAccessCard } from '@/sanity/schemas/objects/accessCard'

import s from './Access.module.scss'

const Access = ({ data }: IAccess) => {
  if (!data) return null

  const { titleDark, titleLight, description, cards } = data

  return (
    <Container id="access" as="section" className={clsx(s.container)}>
      <Row className={s.row}>
        <Column initial={0} medium={6} />
        <Column initial={6} medium={6}>
          <FadeIn>
            <H2>{titleDark}</H2>
            <H2 className={s.titleLight}>{titleLight}</H2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <BodyCopy>{description}</BodyCopy>
          </FadeIn>
        </Column>

        <Column initial={0} medium={1} />
        <Column initial={6} medium={10} className={s.cards}>
          {cards?.map((card: ISanityAccessCard, index: number) => (
            <AccessCard key={index} card={card} index={index} />
          ))}
        </Column>

        <Column initial={0} medium={1} />
      </Row>
    </Container>
  )
}

export default Access
