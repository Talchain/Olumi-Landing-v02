import React, { useEffect, useCallback, useState } from 'react'
import clsx from 'clsx'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

import { BodyCopy } from '@/components/ui/Text'
import NextImage from '@/components/ui/NextImage'
import useBreakpoint from '@/components/hooks/useBreakpoint'

import { ISanityTestimonialsItem } from '@/sanity/schemas/objects/testimonials'

import Quotes from '@/assets/svg/quotes.svg'

import s from './Testimonials.module.scss'

const Slider = ({ slides }: { slides: ISanityTestimonialsItem[] }) => {
  const isMedium = useBreakpoint('medium')
  const isDesktop = useBreakpoint('desktop')

  const [slidePerView, setSlidePerView] = useState(
    isMedium ? 2 : isDesktop ? 3 : 1,
  )

  // TODO: Manage slidePerView update on window resize

  // useEffect(() => {
  //   if (isMedium) {
  //     setSlidePerView(2)
  //   } else if (isDesktop) {
  //     setSlidePerView(3)
  //   } else {
  //     setSlidePerView(1)
  //   }

  // }, [isMedium, isDesktop])

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: slidePerView },
    [Autoplay({ delay: 10000, stopOnInteraction: false })],
  )

  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    onSelect()

    emblaApi.on('select', onSelect)

    return () => {
      if (emblaApi) {
        emblaApi.off('select', onSelect)
      }
    }
  }, [emblaApi, onSelect])

  return (
    <div className={s.slider}>
      {slides.length > 1 && (
        <div className={s.sliderDots}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={clsx(
                s.sliderDot,
                index === selectedIndex && s.isSelected,
              )}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      )}

      <div className={s.sliderContainer} ref={emblaRef}>
        <div className={s.sliderWrapper}>
          {slides.map((slide, index) => (
            <div className={s.sliderSlider} key={index}>
              <BodyCopy>{slide.description}</BodyCopy>
              <div className={s.author}>
                <div className={s.info}>
                  <Quotes />
                  <div>
                    <BodyCopy>{slide.name}</BodyCopy>
                    <BodyCopy className={s.role}>{slide.role}</BodyCopy>
                  </div>
                </div>

                {!!slide.avatar?.asset && (
                  <div className={s.avatar}>
                    <NextImage
                      image={slide.avatar}
                      alt={`${slide.name} Avatar`}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Slider
