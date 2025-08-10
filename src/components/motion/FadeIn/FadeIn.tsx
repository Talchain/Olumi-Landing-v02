import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { motion } from 'framer-motion'
import { easeQuadOut } from 'd3-ease'
import clsx from 'clsx'

import { IFadeIn } from './FadeInTypes'

const FadeIn = ({
  children,
  duration = 1,
  delay = 0,
  trigger = true,
  margin = '0%',
  className,
}: IFadeIn) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin })

  return (
    <div className={clsx(className)} ref={ref}>
      <motion.div
        initial={{ opacity: 0.001 }}
        animate={{
          opacity: isInView && trigger ? 1 : 0.001,
        }}
        transition={{
          duration,
          delay,
          ease: easeQuadOut,
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default FadeIn
