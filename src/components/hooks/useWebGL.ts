import { useEffect, useState } from 'react'
import { useCanvasStore } from '@14islands/r3f-scroll-rig'

import breakpoints from '@/styles/exports/exports.module.scss'

export function checkDevice() {
  if (typeof window === 'undefined') return false

  const isDesktop = !!window.matchMedia(
    `(min-width: ${breakpoints['breakpoint-medium']})`,
  ).matches
  const isPointer = window.matchMedia(
    '(hover: hover) and (pointer: fine)',
  ).matches
  const wantsReduceMotion = !!window.matchMedia(
    '(prefers-reduced-motion: reduce',
  ).matches

  return isDesktop && isPointer && !wantsReduceMotion
}

const useWebGL = () => {
  // don't use `useScrollRig()` here to avoid Suspense interrupted hydration error
  const isCanvasAvailable = useCanvasStore((state) => state.isCanvasAvailable)

  const [isAllowed, setIsAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    function checkAllowedState() {
      const isAllowed = checkDevice()
      setIsAllowed(isAllowed)
    }
    checkAllowedState()
    window.addEventListener('resize', checkAllowedState)
    return () => window.removeEventListener('resize', checkAllowedState)
  }, [setIsAllowed])

  return isAllowed && isCanvasAvailable // isCanvasAvailable will be false if WebGL throws error
}

export default useWebGL
