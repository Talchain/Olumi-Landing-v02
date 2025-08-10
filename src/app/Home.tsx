'use client'

import React, { useEffect, useRef, useState } from 'react'
import { SmoothScrollbar } from '@14islands/r3f-scroll-rig'
import { Leva } from 'leva'
import { Stats } from '@react-three/drei'

import Hero from '@/components/sections/Hero'
import Access from '@/components/sections/Access'
import Benefits from '@/components/sections/Benefits'
import Testimonials from '@/components/sections/Testimonials'
import GridOverlay from '@/components/core/GridOverlay'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Three from '@/components/sections/Three'
import useStore from '@/context/ui'
import useWebGL from '@/components/hooks/useWebGL'
import useBreakpoint from '@/components/hooks/useBreakpoint'

import { ISanitySiteSettings } from '@/sanity/schemas/singletons/siteSettings'
import { ISanityHomePage } from '@/sanity/schemas/singletons/page.home'

import '@14islands/r3f-scroll-rig/css'

const Home = ({
  siteSettings,
  homeData,
}: {
  siteSettings: ISanitySiteSettings
  homeData: ISanityHomePage
}) => {
  const eventSource = useRef<HTMLDivElement>(null!)

  const [isGuide, setIsGuide] = useState(false)

  const scrollEnabled = useStore((s) => s.scrollEnabled)
  const setLoaded = useStore((s) => s.setLoaded)

  const allowDesktopWebGL = useWebGL()
  const isMedium = useBreakpoint('medium')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)

      const queryString = window.location.search
      setIsGuide(queryString === '?guide')
    }
  }, [])

  useEffect(() => {
    !isMedium && setLoaded(true)
  }, [isMedium, setLoaded])

  return (
    <div ref={eventSource}>
      {isMedium && <Three eventSource={eventSource} />}
      <SmoothScrollbar
        locked={(allowDesktopWebGL && !scrollEnabled) as boolean}
        config={{ syncTouch: true }}
        enabled={allowDesktopWebGL as boolean}
      />
      <>
        <Header data={siteSettings?.header} />
        <main>
          <Hero data={homeData?.hero} />
          <Access data={homeData?.access} />
          <Benefits data={homeData?.benefits} />
          <Testimonials data={homeData?.testimonials} />
          <GridOverlay />
        </main>
        <Footer data={siteSettings?.footer} />
        <Leva hidden={!isGuide} collapsed />
        {isGuide && <Stats />}
      </>
    </div>
  )
}

export default Home
