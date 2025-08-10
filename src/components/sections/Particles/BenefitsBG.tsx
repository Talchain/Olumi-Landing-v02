import * as THREE from 'three'

import { GradientMaterial } from './GradientMaterial'
import { useTracker } from '@14islands/r3f-scroll-rig'
import useStore from '@/context/ui'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'

const BenefitsBg = ({ ...props }) => {
  const mesh = useRef<THREE.Mesh>(null!)

  const benefitsRef = useStore((s) => s.benefitsRef)

  const tracker = useTracker(benefitsRef as any)

  const [whiteBodyBg, setWhiteBodyBg] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (whiteBodyBg) {
        document.documentElement.classList.add('whiteBg')
      } else {
        document.documentElement.classList.remove('whiteBg')
      }
    }
  }, [whiteBodyBg])

  //   TODO: Dispose the bg plane when outside viewport [Performance improvement]
  useFrame(() => {
    if (tracker.scrollState.viewport > 1) {
      setWhiteBodyBg(true)
    } else {
      setWhiteBodyBg(false)
    }

    mesh.current.position.y = tracker.position.y
    mesh.current.scale.x = tracker.scale.x
    mesh.current.scale.y = tracker.scale.y
    mesh.current.scale.z = tracker.scale.z
  })

  return (
    <mesh {...props} ref={mesh}>
      <planeGeometry />
      {/* @ts-ignore */}
      <gradientMaterial
        key={GradientMaterial.key}
        uTopLeft={new THREE.Color('#052B3E')} // Top-left corner
        uTopRight={new THREE.Color('#012F3A')} // Top-right corner
        uBottomLeft={new THREE.Color('#32124B')} // Bottom-left corner
        uBottomRight={new THREE.Color('#400C45')} // Bottom-right corner
      />
    </mesh>
  )
}

export default BenefitsBg
