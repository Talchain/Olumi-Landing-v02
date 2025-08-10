import { interpolate } from '@popmotion/popcorn'
import { easeQuadInOut } from 'd3-ease'

export const waveProgressMapper = interpolate([0.3, 0.6], [0, 1], {
  ease: easeQuadInOut,
})

export const getParticleSizeMapper = (isMedium: boolean) =>
  interpolate([0.3, 0.6], [1, isMedium ? 1.3 : 1], {
    ease: easeQuadInOut,
  })

export const modelScaleMapper = interpolate([0.3, 0.6], [1.1, 2], {
  ease: easeQuadInOut,
})

export const modelRotationYMapper = interpolate([0, 0.8], [0, Math.PI], {
  ease: easeQuadInOut,
})

export const modelRotationXMapper = interpolate(
  [0.3, 0.55],
  [0, Math.PI / 1.55],
  {
    ease: easeQuadInOut,
  },
)

export const getModelPositionXMapper = (initPosX: number) =>
  interpolate([0.3, 0.6], [initPosX, 0], {
    ease: easeQuadInOut,
  })

export const modelPositionYMapper = interpolate([0.6, 0.9], [-1, 5], {
  ease: easeQuadInOut,
})

export const getModelPositionZMapper = (finalPosZ: number) =>
  interpolate([0.3, 0.6], [2.2, finalPosZ], {
    ease: easeQuadInOut,
  })
