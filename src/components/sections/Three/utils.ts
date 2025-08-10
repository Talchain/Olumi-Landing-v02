import { interpolate } from '@popmotion/popcorn'
import { easeQuadInOut } from 'd3-ease'

export const getModelPositionYMapper = (initPosY: number) =>
  interpolate([0, 1], [initPosY, initPosY + 10], {
    ease: easeQuadInOut,
  })

export const getModelRotationYMapper = (initRotY: number) =>
  interpolate([0, 1], [initRotY, initRotY - Math.PI / 3], {
    ease: easeQuadInOut,
  })

export const getModelRotationXMapper = (initRotX: number) =>
  interpolate([0, 1], [initRotX, initRotX + Math.PI / 3], {
    ease: easeQuadInOut,
  })
