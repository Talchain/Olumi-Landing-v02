'use client'

import { useEffect, useRef } from 'react'
import clsx from 'clsx'

import { Row, Column } from '@/components/core/Grid'
import Container from '@/components/core/Container'
import { BodyCopy, H1, H3, H4 } from '@/components/ui/Text'
import FadeIn from '@/components/motion/FadeIn'
import NextImage from '@/components/ui/NextImage'
import Button from '@/components/ui/Button'
import useStore from '@/context/ui'

import { IBenefits } from './BenefitsTypes'
import { ISanityBenefitsItem } from '@/sanity/schemas/objects/benefits'

import s from './Benefits.module.scss'

// TODO: Fix benefit card icon bug

const Benefits = ({ data }: IBenefits) => {
  const benefitsRef = useRef<HTMLElement>(null!)

  const setBenefitsRef = useStore((s) => s.setBenefitsRef)

  useEffect(() => {
    setBenefitsRef(benefitsRef)
  }, [setBenefitsRef])

  if (!data) return null

  const { title, subtitle, benefitsList, banner } = data

  const isOddLength = benefitsList.length % 2 == 1

  return (
    <>
      <Container
        id="benefits"
        ref={benefitsRef}
        as="section"
        className={clsx(s.container)}
      >
        <FadeIn className={s.title}>
          <H1>{title}</H1>
          <H3>{subtitle}</H3>
        </FadeIn>
        <Row className={s.row}>
          <Column
            initial={6}
            medium={12}
            desktop={6}
            large={5}
            className={s.benefitsList}
          >
            {benefitsList.map((benefit: ISanityBenefitsItem, index: number) => (
              <FadeIn
                key={index}
                delay={index * 0.1}
                className={clsx(isOddLength && s.isOddLength)}
              >
                <div className={s.benefit}>
                  {!!benefit.icon?.asset && (
                    <div className={s.icon}>
                      <NextImage
                        image={benefit.icon}
                        alt={`${benefit.title} Icon`}
                      />
                    </div>
                  )}
                  <div className={s.benefitCopy}>
                    <H4>{benefit.title}</H4>
                    <BodyCopy>{benefit.description}</BodyCopy>
                  </div>
                </div>
              </FadeIn>
            ))}
          </Column>

          <Column
            initial={6}
            medium={12}
            desktop={6}
            large={7}
            className={s.bannerContainer}
          >
            <div className={s.banner}>
              {!!banner?.asset && (
                <NextImage image={banner} alt={banner?.alt || ''} />
              )}
            </div>
            <div className={s.bannerCopy}>
              <H3>Ready to Get Started?</H3>
              <BodyCopy>
                If you already have your early access code, enter it here to get
                started making better decisions.
              </BodyCopy>
              <Button className={s.cta} to={'https://decisionguide.ai/login'}>
                Join the Waitlist
              </Button>
            </div>
          </Column>
        </Row>
      </Container>
    </>
  )
}

export default Benefits
