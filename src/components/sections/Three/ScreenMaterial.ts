import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

import * as THREE from 'three'

export const ScreenMaterial = shaderMaterial(
  {
    uRadius: 0,
    uResolution: new THREE.Vector2(2, 1),
    uTexture: null,
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
      uniform vec3 uColor;
      uniform float uRadius;
      uniform vec2 uResolution;
      uniform sampler2D uTexture;

      varying vec2 vUv;
  
      float roundedBox(vec2 p, vec2 b, float r) {
        vec2 q = abs(p) - b + r;
        return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
      }
  
      void main() {
        vec2 uv = vUv - 0.5;
        vec2 size = uResolution * 0.5;
        float dist = roundedBox(uv * uResolution, size, uRadius);


        vec4 texColor = texture2D(uTexture, vUv);
  
        // Discard fragments outside the rounded area
        if (dist > 0.0) discard;
  
        gl_FragColor = texColor;
      }
    `,
)

extend({ ScreenMaterial })
