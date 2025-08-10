import { useState, useEffect } from 'react'

import variables from '@/styles/exports/exports.module.scss'

type TBreakpoint = 'medium' | 'desktop' | 'large'
type TCheck = 'above' | 'under'

const useBreakpoint = (key: TBreakpoint, check: TCheck = 'above') => {
  const [isMatching, setIsMatching] = useState<boolean>(false)
  const breakpoints: { [key: string]: number } = {}

  for (let value in variables) {
    if (value.includes('breakpoint')) {
      const key = value.replace('breakpoint-', '')
      const breakpointNumber = parseInt(variables[value].replace('px', ''))
      breakpoints[key] = breakpointNumber
    }
  }

  const breakpoint = breakpoints[key]
  const breakpointTested = check === 'above' ? breakpoint : breakpoint - 1
  const limit = check === 'above' ? 'min' : 'max'

  useEffect(() => {
    const getMatchMedia = () => {
      const mq = window.matchMedia(`(${limit}-width: ${breakpointTested}px)`)

      setIsMatching(mq.matches)
    }

    getMatchMedia()

    window.addEventListener('resize', getMatchMedia)

    return () => window.removeEventListener('resize', getMatchMedia)
  }, [breakpointTested, limit])

  return isMatching
}

export default useBreakpoint
