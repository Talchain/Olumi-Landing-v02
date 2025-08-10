'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useControls } from 'leva'

import { Row, Column } from '@/components/core/Grid'

import s from './GridOverlay.module.scss'

const GridOverlay = () => {
  const [showOverlay, setShowOverlay] = useState(false)

  const { showGrid } = useControls('Grid', {
    showGrid: true,
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryString = window.location.search
      setShowOverlay(queryString === '?guide' && showGrid)
    }
  }, [showGrid])

  if (showOverlay)
    return (
      <section>
        <Row className={clsx(s.row)}>
          {/* 6 column base */}
          <Column initial={1} className={s.col} />
          <Column initial={1} className={s.col} />
          <Column initial={1} className={s.col} />
          <Column initial={1} className={s.col} />
          <Column initial={1} className={s.col} />
          <Column initial={1} className={s.col} />
          {/* 12 column medium */}
          <Column initial={0} medium={1} className={s.col} />
          <Column initial={0} medium={1} className={s.col} />
          {/* 12 column desktop */}
          <Column initial={0} medium={1} className={s.col} />
          <Column initial={0} medium={1} className={s.col} />
          <Column initial={0} medium={1} className={s.col} />
          <Column initial={0} medium={1} className={s.col} />
        </Row>
      </section>
    )
}

export default GridOverlay
