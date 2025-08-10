import { useEffect, useMemo, useRef, useState } from 'react'
import { animate } from 'framer-motion'
import { easeExpOut } from 'd3-ease'
import { useGLTF, useTexture } from '@react-three/drei'
import { invalidate, useFrame, useThree } from '@react-three/fiber'
import { useScrollbar } from '@14islands/r3f-scroll-rig'
import * as THREE from 'three'

import useStore from '@/context/ui'
import { ScreenMaterial } from './ScreenMaterial'
import { SCALE_FACTOR } from './Scene'

import model from '@/assets/models/iphone_16.glb'

import {
  getModelPositionYMapper,
  getModelRotationYMapper,
  getModelRotationXMapper,
} from './utils'

const MOBILE_ANIM_DELAY = 0.4

const Model = ({ texture, index, ...props }: any) => {
  const group = useRef<THREE.Group>(null!)
  //@ts-ignore
  const { nodes, materials } = useGLTF(model)

  const map = useTexture(texture.src)

  const { viewport } = useThree()
  const scaleMultiplier = viewport.width * SCALE_FACTOR

  const loaded = useStore((s) => s.loaded)
  const scrollEnabled = useStore((s) => s.scrollEnabled)
  const setScrollEnabled = useStore((s) => s.setScrollEnabled)

  useEffect(() => {
    if (!group.current) return

    group.current.position.y = -25
    group.current.rotation.x = 0
    group.current.rotation.y = 0

    if (loaded) {
      animate(-25, props.position[1], {
        onUpdate(v) {
          if (!group.current) return

          group.current.position.y = v

          invalidate()
        },

        duration: 1,
        delay: MOBILE_ANIM_DELAY + index * 0.1,
        ease: easeExpOut,
      })
      animate(0, props.rotation[0], {
        onUpdate(v) {
          if (!group.current) return

          group.current.rotation.x = v

          invalidate()
        },
        onComplete() {
          setScrollEnabled(true)
        },

        duration: 1.6,
        delay: MOBILE_ANIM_DELAY + 0.2,
        ease: easeExpOut,
      })
      animate(0, props.rotation[1], {
        onUpdate(v) {
          if (!group.current) return

          group.current.rotation.y = v

          invalidate()
        },

        duration: 1.4,
        delay: MOBILE_ANIM_DELAY + 0.2,
        ease: easeExpOut,
      })
    }
  }, [loaded])

  ///////////////////////////////  Model Parallax //////////////////////////////////////////

  const { scroll } = useScrollbar()

  const modelPositionYMapper = useMemo(
    () => getModelPositionYMapper(props.position[1]),
    [props.position],
  )

  const modelRotatioYMapper = useMemo(
    () => getModelRotationYMapper(props.rotation[1]),
    [props.rotation],
  )

  const modelRotatioXMapper = useMemo(
    () => getModelRotationXMapper(props.rotation[0]),
    [props.rotation],
  )

  useFrame(() => {
    if (!group.current) return
    const progress = scroll.y / viewport.height / 100

    if (scrollEnabled) {
      group.current.position.y = modelPositionYMapper(
        index === 0 ? progress / 0.8 : progress,
      ) as number
      group.current.rotation.x = Number(modelRotatioXMapper(progress))
      group.current.rotation.y = Number(modelRotatioYMapper(progress))
    }
  })
  /////////////////////////////////////////////////////////////////////////

  return (
    <group ref={group} scale={scaleMultiplier} {...props} dispose={null}>
      {/* Case */}
      <mesh
        geometry={nodes.Object_12.geometry}
        material={materials.PaletteMaterial001}
        material-color={0x3c3c3d} // Black Titanium
        material-metalness={1}
        material-roughness={0.5}
      />
      <mesh
        geometry={nodes.Object_14.geometry}
        material={materials.PaletteMaterial002}
      />
      <mesh
        geometry={nodes.Object_16.geometry}
        material={materials.PaletteMaterial003}
      />
      {/* Behind Screen */}
      <mesh geometry={nodes.Object_18.geometry}>
        <meshBasicMaterial color="white" toneMapped={false} />
      </mesh>
      {/* Screen */}
      <mesh
        geometry={new THREE.PlaneGeometry(6.53, 13.29)}
        position={[0, -0.4, 0.4]}
      >
        {/* @ts-ignore */}
        <screenMaterial
          key={ScreenMaterial.key}
          uTexture={map}
          uResolution={new THREE.Vector2(6.53, 13.29)}
          uRadius={0.9}
        />
      </mesh>

      <mesh
        geometry={nodes.Object_25.geometry}
        material={materials.PaletteMaterial005}
      />
      <mesh
        geometry={nodes.Object_38.geometry}
        material={materials.PaletteMaterial006}
      />
      <mesh
        geometry={nodes.Object_40.geometry}
        material={materials.PaletteMaterial007}
      />
      <mesh
        geometry={nodes.Object_42.geometry}
        material={materials.PaletteMaterial008}
      />
      {/* Buttons */}
      <mesh
        geometry={nodes.Object_62.geometry}
        material={materials.PaletteMaterial010}
        material-color={0x3c3c3d}
      />
      <mesh
        geometry={nodes.Object_77.geometry}
        material={materials.PaletteMaterial011}
      />
      <mesh
        geometry={nodes.Object_96.geometry}
        material={materials.PaletteMaterial012}
      />
    </group>
  )
}

export default Model

useGLTF.preload(model)
