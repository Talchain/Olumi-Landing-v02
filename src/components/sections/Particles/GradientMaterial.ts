import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

import * as THREE from 'three'

export const GradientMaterial = shaderMaterial(
  {
    uTopLeft: new THREE.Color('#052B3E'),
    uTopRight: new THREE.Color('#012F3A'),
    uBottomLeft: new THREE.Color('#32124B'),
    uBottomRight: new THREE.Color('#3C0E47'),
  },
  // Vertex Shader
  /*glsl*/ `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  /*glsl*/ `
    uniform vec3 uTopLeft;
    uniform vec3 uTopRight;
    uniform vec3 uBottomLeft;
    uniform vec3 uBottomRight;

    varying vec2 vUv;

    void main() {
      // Interpolate horizontally for top edge (left to right)
      vec3 top = mix(uTopLeft, uTopRight, vUv.x);

      // Interpolate horizontally for bottom edge (left to right)
      vec3 bottom = mix(uBottomLeft, uBottomRight, vUv.x);

      // Interpolate vertically between bottom and top
      vec3 color = mix(bottom, top, vUv.y);

      gl_FragColor = vec4(color, 1.0);

      #include <colorspace_fragment>
    }
  `,
)

extend({ GradientMaterial })
