'use client'

import { Suspense, useState, useEffect } from 'react'
import { GlobalCanvas } from '@14islands/r3f-scroll-rig'
import { useThree } from '@react-three/fiber'
import {
  Environment,
  Html,
  OrbitControls,
  useProgress,
  Preload,
} from '@react-three/drei'

import BgCanvas from './BgCanvas'
import useStore from '@/context/ui'

import hdri from '@/assets/hdri/studio_small_03_0.256k.hdr'

import s from './Three.module.scss'

// Define Loader props
interface LoaderProps {
  progress: number
}

const Loader: React.FC<LoaderProps> = ({ progress }) => {
  return (
    <Html className={s.loader} center>
      {progress} % loaded
    </Html>
  )
}

const Three = ({ eventSource }: { eventSource: any }) => {
  const [displayProgress, setDisplayProgress] = useState<number>(0)
  const [cameraPosZ, setCameraPosZ] = useState<number>(25.635670130447387)

  const { progress } = useProgress()

  const setLoaded = useStore((s) => s.setLoaded)

  useEffect(() => {
    if (progress == 100) setLoaded(true)
  }, [progress, setLoaded])

  useEffect(() => {
    setDisplayProgress(Math.round(progress))
  }, [progress])

  return (
    <>
      <GlobalCanvas
        debug={false}
        scaleMultiplier={0.01}
        eventSource={eventSource}
        eventPrefix="client"
        flat
        frameloop="demand"
        camera={{ fov: 15 }}
        className={s.canvas}
      >
        {(globalChildren) => (
          <Suspense fallback={<Loader progress={displayProgress} />}>
            {globalChildren}
            <Environment files={hdri} />
            <Preload all />
            <UpdateCameraPosition setCameraPosZ={setCameraPosZ} />
          </Suspense>
        )}
      </GlobalCanvas>
      {/* Canvas for Particles + Benefits Bg */}
      <BgCanvas cameraPosZ={cameraPosZ} />
    </>
  )
}

export default Three

const UpdateCameraPosition = ({
  setCameraPosZ,
}: {
  setCameraPosZ: (z: number) => void
}) => {
  const { camera, viewport } = useThree()

  useEffect(() => {
    setCameraPosZ(camera.position.z)
  }, [viewport])

  return null
}
