import React, { useRef, useMemo, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useScrollbar, useTracker } from '@14islands/r3f-scroll-rig'
import { animate } from 'framer-motion'
//@ts-ignore
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import * as THREE from 'three'
import { useControls } from 'leva'
import { lerp, mapLinear } from 'three/src/math/MathUtils.js'

import BenefitsBg from './BenefitsBG'
import useStore from '@/context/ui'
import useBreakpoint from '@/components/hooks/useBreakpoint'

import brain from '@/assets/models/brain.glb'

import {
  getModelPositionXMapper,
  getModelPositionZMapper,
  modelPositionYMapper,
  modelRotationXMapper,
  modelRotationYMapper,
  modelScaleMapper,
  getParticleSizeMapper,
  waveProgressMapper,
} from './utils'

const PARTICLES_NUMBER = 5570
const PARTICLES_SCALE = 1.2
const PARTICLE_SIZE = 3.5
const WAVE_HEIGHT = 0.6
const MODEL_WOBBLE_STRENGTH = 0.06
const MODEL_WOBBLE_FREQUENCY = 1
const MODEL_WOBBLE_SPEED = 1
const PLANE_WAVE_STRENGTH = 0.3
const PLANE_WAVE_FREQUENCY = 1
const PLANE_WAVE_SPEED = 1
const VELOCITY_THRESHOLD = 15

const Particles = (props: any) => {
  const pointsRef = useRef<THREE.Points>(null!)

  //@ts-ignore
  const { scene } = useGLTF(brain)

  const { viewport } = useThree()

  const testimonialsRef = useStore((s) => s.testimonialsRef)
  const loaded = useStore((s) => s.loaded)

  const tracker = useTracker(testimonialsRef as any)

  const { scroll } = useScrollbar()

  const isMedium = useBreakpoint('medium')

  const {
    count,
    size,
    scale,
    color1,
    color2,
    color3,
    modelWobbleStrength,
    modelWobbleFrequency,
    modelWobbleSpeed,
  } = useControls('Particles', {
    count: {
      min: 5000,
      max: 100000,
      value: PARTICLES_NUMBER,
      step: 10,
    },
    size: {
      min: 0.1,
      max: 50,
      value: PARTICLE_SIZE,
      step: 0.1,
    },
    scale: {
      min: 0.1,
      max: 10,
      value: PARTICLES_SCALE,
      step: 0.1,
    },
    color1: '#6e00fe',
    color2: '#00fcf3',
    color3: '#ff00d0',
    modelWobbleStrength: {
      min: 0,
      max: 10,
      value: MODEL_WOBBLE_STRENGTH,
      step: 0.1,
    },
    modelWobbleFrequency: {
      min: 0,
      max: 10,
      value: MODEL_WOBBLE_FREQUENCY,
      step: 0.1,
    },
    modelWobbleSpeed: {
      min: 0,
      max: 10,
      value: MODEL_WOBBLE_SPEED,
      step: 0.1,
    },
  })

  const { planeWaveStrength, planeWaveFrequency, planeWaveSpeed } = useControls(
    'Wave',
    {
      planeWaveStrength: {
        min: 0,
        max: 10,
        value: PLANE_WAVE_STRENGTH,
        step: 0.1,
      },
      planeWaveFrequency: {
        min: 0,
        max: 10,
        value: PLANE_WAVE_FREQUENCY,
        step: 0.1,
      },
      planeWaveSpeed: {
        min: 0,
        max: 10,
        value: PLANE_WAVE_SPEED,
        step: 0.1,
      },
    },
  )

  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color() },
        uColor2: { value: new THREE.Color() },
        uColor3: { value: new THREE.Color() },
        uSize: { value: 10 },
        // Plane wave parameters
        uPlaneWaveStrength: { value: PLANE_WAVE_STRENGTH },
        uPlaneWaveFrequency: { value: PLANE_WAVE_FREQUENCY },
        uPlaneWaveSpeed: { value: PLANE_WAVE_SPEED },
        // Brain wobble parameters (separated from plane)
        uModelWobbleStrength: { value: MODEL_WOBBLE_STRENGTH },
        uModelWobbleFrequency: { value: MODEL_WOBBLE_FREQUENCY },
        uModelWobbleSpeed: { value: MODEL_WOBBLE_SPEED },
        // Zone definitions
        uZone1Center: { value: new THREE.Vector3(-1.0, 1.0, 0.0) },
        uZone2Center: { value: new THREE.Vector3(1.0, 0.0, 0.0) },
        uZone3Center: { value: new THREE.Vector3(0.0, -1.0, 0.0) },
        uZoneScale: { value: 2.5 },
        uWavePosition: { value: -2 },
        uWaveHeight: { value: WAVE_HEIGHT },
        uVelocity: { value: 1 },
      },
      vertexShader: `
        uniform float uProgress;
        uniform float uTime;
        uniform float uSize;
        uniform float uPlaneWaveStrength;
        uniform float uPlaneWaveFrequency;
        uniform float uPlaneWaveSpeed;
        uniform float uModelWobbleStrength;
        uniform float uModelWobbleFrequency;
        uniform float uModelWobbleSpeed;
        uniform vec3 uZone1Center;
        uniform vec3 uZone2Center;
        uniform vec3 uZone3Center;
        uniform float uZoneScale;
        uniform float uWavePosition;
        uniform float uWaveHeight;
        
        attribute vec3 originalPosition;
        attribute vec3 planePosition;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying float vWaveEffect;
        
        void main() {
          vUv = uv;
          
          // Calculate wave function for the plane
          float planeWaveX = sin(planePosition.x * uPlaneWaveFrequency + uTime * uPlaneWaveSpeed) * uPlaneWaveStrength;
          float planeWaveY = cos(planePosition.y * uPlaneWaveFrequency + uTime * uPlaneWaveSpeed) * uPlaneWaveStrength;
          vec3 wavePosition = vec3(
            planePosition.x,
            planePosition.y,
            planeWaveX + planeWaveY // Apply wave effect to z-coordinate
          );
          
          // Use a different frequency and phase for each dimension for more organic movement
          float brainWobbleX = sin(originalPosition.x * uModelWobbleFrequency + uTime * uModelWobbleSpeed) * uModelWobbleStrength;
          float brainWobbleY = cos(originalPosition.y * uModelWobbleFrequency + uTime * uModelWobbleSpeed * 0.7) * uModelWobbleStrength;
          float brainWobbleZ = sin(originalPosition.z * uModelWobbleFrequency + uTime * uModelWobbleSpeed * 1.3) * uModelWobbleStrength;
          
          // Apply wobble to the brain position
          vec3 wobbledBrainPosition = vec3(
            originalPosition.x + brainWobbleX,
            originalPosition.y + brainWobbleY,
            originalPosition.z + brainWobbleZ
          );
          
          // Interpolate between wobbled brain and plane positions based on progress
          vec3 finalPosition = mix(wobbledBrainPosition, wavePosition, uProgress);
          
          // Animation in effect
          float normalizedY = originalPosition.y * 0.5;
          
          // Calculate distance from wave position
          float distanceFromWave = normalizedY - uWavePosition;
          
          // Calculate wave effect using a smooth gaussian-like curve
          float waveEffect = exp(-(distanceFromWave * distanceFromWave) / (2.0 * uWaveHeight * uWaveHeight));
          
          // Pass wave effect to fragment shader
          vWaveEffect = waveEffect;
          
          // Pass the final position to fragment shader for zone calculations
          vPosition = finalPosition;
          
          // Apply a slight vertical displacement based on wave effect
          finalPosition.y += waveEffect * uWaveHeight * 0.2; 
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPosition, 1.0);
          
          // Calculate particle size based on distance from wave
          float sizeMultiplier;
          
          // If wave has passed, particle is at full size
          if (distanceFromWave < -uWaveHeight * 2.0) {
            sizeMultiplier = 1.0;
          }
          // If wave is approaching or passing, use wave effect for smooth transition
          else if (distanceFromWave < uWaveHeight * 3.0) {
            sizeMultiplier = 1.0 - smoothstep(-uWaveHeight * 2.0, uWaveHeight * 3.0, distanceFromWave);
          }
          // If wave hasn't reached yet, particle is hidden
          else {
            sizeMultiplier = 0.0;
          }
          
          gl_PointSize = uSize * sizeMultiplier;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec3 uZone1Center;
        uniform vec3 uZone2Center;
        uniform vec3 uZone3Center;
        uniform float uZoneScale;
        uniform float uVelocity;

        varying vec2 vUv;
        varying vec3 vPosition;
        varying float vWaveEffect;
  
        // Function to calculate influence factor based on distance to zone center
        float calculateInfluence(vec3 position, vec3 zoneCenter) {
          float distance = length((position - zoneCenter) * uZoneScale);
          return 1.0 / (1.0 + distance * distance); // Inverse square falloff
        }
        
        void main() {

          vec2 center = vec2(0.5, 0.5);
          float radius = 0.5;
          float distanceFromCenter = length(gl_PointCoord - center);

          // Discard fragments outside the circle
          if (distanceFromCenter > radius) {
              discard;
          }
          
          // Calculate influence factors for each zone
          float influence1 = calculateInfluence(vPosition, uZone1Center);
          float influence2 = calculateInfluence(vPosition, uZone2Center);
          float influence3 = calculateInfluence(vPosition, uZone3Center);
          
          // Normalize influences for proper blending
          float totalInfluence = influence1 + influence2 + influence3;
          influence1 /= totalInfluence;
          influence2 /= totalInfluence;
          influence3 /= totalInfluence;
          
          // Blend colors based on normalized influences
          vec3 finalColor = 
            uColor1 * influence1 +
            uColor2 * influence2 +
            uColor3 * influence3;
          
          // Brighten color slightly during wave pass
          finalColor = mix(finalColor, finalColor * 2.5, vWaveEffect);
          finalColor *= uVelocity;

          // Apply color and alpha
          gl_FragColor = vec4(finalColor, 1.);
        }
      `,
      transparent: true,
      depthWrite: false,
    })
  }, [])

  useEffect(() => {
    particleMaterial.uniforms.uColor1.value = new THREE.Color(color1)
    particleMaterial.uniforms.uColor2.value = new THREE.Color(color2)
    particleMaterial.uniforms.uColor3.value = new THREE.Color(color3)
    particleMaterial.uniforms.uSize.value = size
    particleMaterial.uniforms.uModelWobbleStrength.value = modelWobbleStrength
    particleMaterial.uniforms.uModelWobbleFrequency.value = modelWobbleFrequency
    particleMaterial.uniforms.uModelWobbleSpeed.value = modelWobbleSpeed
    particleMaterial.uniforms.uPlaneWaveStrength.value = planeWaveStrength
    particleMaterial.uniforms.uPlaneWaveFrequency.value = planeWaveFrequency
    particleMaterial.uniforms.uPlaneWaveSpeed.value = planeWaveSpeed
  }, [
    color1,
    color2,
    color3,
    size,
    modelWobbleStrength,
    modelWobbleFrequency,
    modelWobbleSpeed,
    planeWaveStrength,
    planeWaveFrequency,
    planeWaveSpeed,
  ])

  const pointsGeometry = useMemo(() => {
    if (!scene) return null

    let sampler: MeshSurfaceSampler
    const vertices = []
    const originalPositions = []
    const planePositions = []
    const tempPosition = new THREE.Vector3()

    // Traverse the model to find meshes
    scene.traverse((obj: any) => {
      if (obj.isMesh) {
        sampler = new MeshSurfaceSampler(obj).build()
      }
    })

    if (!sampler) return null

    // Sample points from the mesh surface
    for (let i = 0; i < count; i++) {
      sampler.sample(tempPosition)

      // Store original position
      originalPositions.push(tempPosition.x, tempPosition.y, tempPosition.z)

      // Create corresponding position on a waving plane
      // Distribute points evenly in a grid-like structure
      const gridSize = Math.sqrt(count)
      const u = (i % gridSize) / gridSize - 0.5
      const v = Math.floor(i / gridSize) / gridSize - 0.5

      planePositions.push(
        u * viewport.width, // Width of the plane
        v * viewport.height, // Height of the plane
        0, // Initial z position, will be animated in the shader
      )

      // Initial position (skull)
      vertices.push(tempPosition.x, tempPosition.y, tempPosition.z)
    }

    // Create geometry and add attributes
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3),
    )

    // Add original positions as attribute
    geometry.setAttribute(
      'originalPosition',
      new THREE.Float32BufferAttribute(originalPositions, 3),
    )

    // Add plane positions as attribute
    geometry.setAttribute(
      'planePosition',
      new THREE.Float32BufferAttribute(planePositions, 3),
    )

    return geometry
  }, [scene, viewport, count])

  useEffect(() => {
    if (loaded) {
      const controls = animate(-2, 2, {
        duration: 2,
        delay: 3,
        type: 'spring',
        onUpdate: (v) => {
          particleMaterial.uniforms.uWavePosition.value = v
        },
      })

      return () => controls.stop()
    }
  }, [loaded])

  const modelPositionXMapper = useMemo(
    () => getModelPositionXMapper(isMedium ? -viewport.width * 0.25 : 0),
    [viewport.width, isMedium],
  )

  const modelPositionZMapper = useMemo(
    () => getModelPositionZMapper(-viewport.height * 2),
    [viewport.height],
  )

  const particleSizeMapper = useMemo(
    () => getParticleSizeMapper(isMedium),
    [isMedium],
  )

  // Animation frame hook
  useFrame(({ clock }) => {
    if (!pointsRef.current) return

    const tProgress = tracker.scrollState.progress
    const globalProgress = scroll.progress
    const elapsedTime = clock.getElapsedTime()
    const velocity = Math.abs(scroll.velocity)

    particleMaterial.uniforms.uTime.value = elapsedTime

    particleMaterial.uniforms.uProgress.value = waveProgressMapper(tProgress)
    particleMaterial.uniforms.uSize.value = particleSizeMapper(tProgress)
    particleMaterial.uniforms.uSize.value *= size

    if (velocity > 0.1) {
      particleMaterial.uniforms.uVelocity.value = lerp(
        particleMaterial.uniforms.uVelocity.value,
        mapLinear(velocity, 0, VELOCITY_THRESHOLD, 1, 4),
        0.08,
      )
      particleMaterial.uniforms.uSize.value = lerp(
        particleMaterial.uniforms.uSize.value,
        mapLinear(
          velocity,
          0,
          VELOCITY_THRESHOLD,
          particleMaterial.uniforms.uSize.value,
          particleMaterial.uniforms.uSize.value * 5,
        ),
        0.08,
      )
    }

    pointsRef.current.rotation.y = modelRotationYMapper(
      globalProgress,
    ) as number
    pointsRef.current.rotation.x = modelRotationXMapper(tProgress) as number
    pointsRef.current.position.x = modelPositionXMapper(tProgress) as number
    pointsRef.current.position.y = modelPositionYMapper(tProgress) as number
    pointsRef.current.position.z = modelPositionZMapper(tProgress) as number
    pointsRef.current.scale.setScalar(
      Number(scale) * Number(modelScaleMapper(tProgress)),
    )
  })

  // If we don't have geometry yet, don't render anything
  if (!pointsGeometry) return null

  return (
    <>
      <BenefitsBg />
      <points
        ref={pointsRef}
        geometry={pointsGeometry}
        material={particleMaterial}
        {...props}
      />
    </>
  )
}

export default Particles
