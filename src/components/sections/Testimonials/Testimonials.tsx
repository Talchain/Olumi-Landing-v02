'use client'

import { useEffect, useRef } from 'react'
import clsx from 'clsx'

import Container from '@/components/core/Container'
import { BodyCopy, H2 } from '@/components/ui/Text'
import FadeIn from '@/components/motion/FadeIn'
import useStore from '@/context/ui'

import Slider from './Slider'
import { ITestimonials } from './TestimonialsTypes'

import s from './Testimonials.module.scss'

const Testimonials = ({ data }: ITestimonials) => {
  const testimonialsRef = useRef<HTMLElement>(null!)

  const setTestimonialsRef = useStore((s) => s.setTestimonialsRef)

  useEffect(() => {
    setTestimonialsRef(testimonialsRef)
  }, [setTestimonialsRef])

  if (!data) return null

  const { title, subtitle, testimonialsList } = data

  return (
    <Container
      ref={testimonialsRef}
      id="testimonials"
      as="section"
      className={clsx(s.container)}
    >
      <FadeIn className={s.title}>
        <H2>{title}</H2>
        <BodyCopy>{subtitle}</BodyCopy>
      </FadeIn>
      <FadeIn delay={0.4}>
        {testimonialsList.length && <Slider slides={testimonialsList} />}
      </FadeIn>
    </Container>
  )
}

export default Testimonials
