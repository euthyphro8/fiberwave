import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// Tutorial: https://www.youtube.com/watch?v=f4s1h2YETNY
const GridMaterial = shaderMaterial(
  // THREE.UniformsUtils.merge([
  //   {
  //     time: 0,
  //     resolution: new THREE.Vector2(),
  //     pointer: new THREE.Vector2(),
  //   },
  //   THREE.UniformsLib['lights'],
  // ]),
  {
    time: 0,
    resolution: new THREE.Vector2(),
    pointer: new THREE.Vector2(),

    ambi: { type: 'fv', value: [] },
    directionalLightDirection: { type: 'fv', value: [] },
    directionalLightColor: { type: 'fv', value: [] },
    hemisphereLightDirection: { type: 'fv', value: [] },
    hemisphereLightSkyColor: { type: 'fv', value: [] },
    hemisphereLightGroundColor: { type: 'fv', value: [] },
    pointLightColor: { type: 'fv', value: [] },
    pointLightPosition: { type: 'fv', value: [] },
    pointLightDistance: { type: 'fv1', value: [] },
    spotLightColor: { type: 'fv', value: [] },
    spotLightPosition: { type: 'fv', value: [] },
    spotLightDirection: { type: 'fv', value: [] },
    spotLightDistance: { type: 'fv1', value: [] },
    spotLightAngleCos: { type: 'fv1', value: [] },
    spotLightExponent: { type: 'fv1', value: [] },
  },
  /*glsl*/ `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vPos;

      // vec3 size = vec3(3000., 3000., 750.);

      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectionPosition = projectionMatrix * viewPosition;
        gl_Position = projectionPosition;
        vUv = uv;       
        // vPos = (position + size / 2.0) / size;
        vPos = position;
      }`,
  /*glsl*/ `
      uniform float time;
      uniform vec3 directionalLightColor[ 1 ];
      uniform vec3 directionalLightDirection[ 1 ];
      // uniform vec2 resolution;
      // uniform vec2 pointer;
      varying vec2 vUv;      
      varying vec3 vPos;
      // vec3 size = vec3(3000., 3000., 750.);

      vec3 palette(float t) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.263, 0.416, 0.557);
        return a + b * cos(6.28318 * (c * t + d));
      }

      vec2 pitch  = vec2(10., 10.);
      float size = .4;

      void main() {
        if (mod(vUv.x * 1000., pitch[0]) < size ||
            mod((vUv.y + time / 30.) * 1000., pitch[1]) < size) {
            gl_FragColor = vec4(palette(vUv.y + time / 30.).rg, 0.4, 1.0);
        } else {
            gl_FragColor = vec4(0., 0., 0., 1.);
        }
        // gl_FragColor = vec4(vPos.z, 1., 1., 1.);
      }`,
);

extend({ GridMaterial });

export { GridMaterial };
