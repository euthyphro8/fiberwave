import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import terrainVertex from './Vertex';
import terrainFragment from './Fragment';

const GridMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
    pointer: new THREE.Vector2(),
    ...THREE.UniformsLib['lights'],
  },
  terrainVertex,
  terrainFragment,
);

extend({ GridMaterial });

export { GridMaterial };
