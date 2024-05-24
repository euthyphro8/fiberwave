import * as THREE from 'three';
import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { StatsGl } from '@react-three/drei';
import { SimplexNoise } from 'three/examples/jsm/Addons.js';
import mulberry32 from './utils/mulberry32';

export default function App() {
  const camera = useMemo(() => {
    const c = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    c.position.set(0, 600, 400);
    c.lookAt(0, 300, 0);
    return c;
  }, []);
  return (
    <div id="canvas-container">
      <Canvas dpr={[1, 2]} camera={camera}>
        <fog attach="fog" args={['#eabbca', 800, 2000]} />
        <Suspense fallback={null}>
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 0]} intensity={5} color="#f6c7d9" />
          <Plane />
          <Sky />
          <Sun />
        </Suspense>
        <StatsGl />
      </Canvas>
    </div>
  );
}

function Sun() {
  return (
    <mesh position={[0, -700, -3000]}>
      <sphereGeometry args={[1200, 32, 32]} />
      <meshBasicMaterial color="#cc5869" fog={false} />
    </mesh>
  );
}

function Sky() {
  return (
    <mesh position={[0, 0, -3000]}>
      <planeGeometry args={[8000, 1500, 16, 16]} />
      <meshBasicMaterial color="#000000" />
    </mesh>
  );
}
function Plane() {
  const mesh = useRef();
  const vWidth = 256;
  const vHeight = 256;
  useFrame(({ clock }) => {
    const geometry = mesh.current?.geometry;
    if (!geometry) return;
    const noise = getNoise();
    const vertices = geometry.attributes.position.array;
    const offset = clock.elapsedTime * 100;
    for (let i = 0; i <= vertices.length; i += 3) {
      vertices[i + 2] = noise(vertices[i], vertices[i + 1], offset);
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
  });
  return (
    <mesh ref={mesh} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[3000, 3000, vWidth, vHeight]} />
      <meshLambertMaterial color="#1b1424" />
    </mesh>
  );
}

function getNoise() {
  const scales = [200, 30];
  const smoothing = [400, 100];
  const prng = mulberry32(0xdeadbeef);
  const perlin = new SimplexNoise({ random: prng });
  return function (x: number, y: number, offset: number) {
    let result = 0;
    for (let i = 0; i < scales.length; i++) {
      result += scales[i] * perlin.noise(x / smoothing[i], (y + offset) / smoothing[i]);
    }
    return (x ^ 2) * 0.001 * result;
    // return result;
  };
}
