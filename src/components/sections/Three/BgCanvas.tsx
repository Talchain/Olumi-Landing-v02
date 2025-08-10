'use client'

import { useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'

import Particles from '../Particles'

import s from './Three.module.scss'

const BgCanvas = ({ cameraPosZ }: { cameraPosZ: number }) => {
  return (
    <div className={s.bgCanvas}>
      <Canvas
        camera={{ fov: 15, position: [0, 0, cameraPosZ] }}
        frameloop="demand"
      >
        <Particles />
        <UpdateBgCamera cameraPosZ={cameraPosZ} />
      </Canvas>
    </div>
  )
}

export default BgCanvas

const UpdateBgCamera = ({ cameraPosZ }: { cameraPosZ: number }) => {
  const { camera, viewport } = useThree()

  useEffect(() => {
    camera.position.z = cameraPosZ
    camera.updateProjectionMatrix() // Ensure changes take effect
  }, [viewport])

  return null
}
