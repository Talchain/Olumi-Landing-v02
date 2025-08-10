import { invalidate, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useRef } from 'react'
import { lerp } from 'three/src/math/MathUtils.js'

import Model from './Model'

import mobile1 from '@/assets/images/mobile-1.jpg'
import mobile2 from '@/assets/images/mobile-2.jpg'

export const SCALE_FACTOR = 0.023

const Scene = ({ ...props }) => {
  const modelOneRef = useRef<THREE.Group>(null!)
  const modelTwoRef = useRef<THREE.Group>(null!)

  const { viewport } = useThree()

  const scaleMultiplier = viewport.width * SCALE_FACTOR

  const mobile2XPos = -3.5 * scaleMultiplier
  const mobile2YPos = -15 * scaleMultiplier

  useFrame(({ pointer }) => {
    if (!modelOneRef.current || !modelTwoRef.current) return

    ////////////////// Model One //////////////////
    modelOneRef.current.rotation.y = lerp(
      modelOneRef.current.rotation.y,
      pointer.x * 0.1,
      0.06,
    )
    modelOneRef.current.rotation.x = lerp(
      modelOneRef.current.rotation.x,
      pointer.y * 0.1,
      0.06,
    )
    modelOneRef.current.position.x = lerp(
      modelOneRef.current.position.x,
      pointer.x * 0.15,
      0.06,
    )
    modelOneRef.current.position.y = lerp(
      modelOneRef.current.position.y,
      -pointer.y * 0.2,
      0.06,
    )

    ////////////////// Model Two //////////////////
    modelTwoRef.current.rotation.y = lerp(
      modelTwoRef.current.rotation.y,
      -pointer.x * 0.2,
      0.06,
    )
    modelTwoRef.current.rotation.x = lerp(
      modelTwoRef.current.rotation.x,
      pointer.y * 0.2,
      0.06,
    )
    modelTwoRef.current.position.z = lerp(
      modelTwoRef.current.position.z,
      -pointer.x * 0.2,
      0.06,
    )

    modelTwoRef.current.position.y = lerp(
      modelTwoRef.current.position.y,
      pointer.y * 0.2,
      0.06,
    )

    invalidate()
  })

  return (
    <group position={[scaleMultiplier * -1, 0, 0]}>
      <group ref={modelOneRef}>
        <Model
          texture={mobile1}
          position={[0, -5.5 * scaleMultiplier, 0]}
          rotation={[
            THREE.MathUtils.degToRad(-21.46),
            THREE.MathUtils.degToRad(-21.61),
            THREE.MathUtils.degToRad(-7.46),
          ]}
          index={0}
        />
      </group>
      <group ref={modelTwoRef}>
        <Model
          texture={mobile2}
          position={[mobile2XPos, mobile2YPos, -1]}
          rotation={[
            THREE.MathUtils.degToRad(-25.08),
            THREE.MathUtils.degToRad(24.51),
            THREE.MathUtils.degToRad(10.99),
          ]}
          index={1}
        />
      </group>
    </group>
  )
}

export default Scene
