import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { motion } from 'framer-motion'
import { easeQuadOut } from 'd3-ease'
import clsx from 'clsx'
import { IStaggerText } from './StaggerTextTypes'

const StaggerText = ({
  text,
  duration = 0.4,
  delay = 0,
  trigger = true,
  className,
}: IStaggerText) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div className={clsx(className)} ref={ref}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 25 }}
          animate={{
            opacity: isInView && trigger ? 1 : 0,
            y: isInView && trigger ? 0 : 25,
          }}
          transition={{
            duration,
            delay: delay + index * 0.04,
            ease: easeQuadOut,
          }}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  )
}

export default StaggerText
