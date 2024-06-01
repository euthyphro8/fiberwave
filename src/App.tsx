import * as THREE from 'three';
import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { StatsGl } from '@react-three/drei';
import { SimplexNoise } from 'three/examples/jsm/Addons.js';
import mulberry32 from './utils/mulberry32';

const views = {
  default: {
    fov: 75,
    position: [0, 500, 1700],
    // lookAt: [0, 0, 0],
    lookAt: [0, -300, -1500],
  },
  lowView: {
    fov: 50,
    position: [0, 10, 1500],
    // lookAt: [0, 0, 0],
    lookAt: [0, -300, -1500],
  },
  sideView: {
    fov: 50,
    position: [300, 500, 1500],
    lookAt: [0, -300, -1500],
  },
};
export default function App() {
  const camera = useMemo(() => {
    const view = views.sideView;
    const c = new THREE.PerspectiveCamera(view.fov, window.innerWidth / window.innerHeight, 0.1, 5000);
    c.position.set(view.position[0], view.position[1], view.position[2]);
    c.lookAt(view.lookAt[0], view.lookAt[1], view.lookAt[2]);
    return c;
  }, []);
  return (
    <>
      <div id="canvas-container">
        <Canvas dpr={[1, 2]} camera={camera}>
          <Suspense fallback={null}>
            <Plane />
            <Sky />
            <Sun />
          </Suspense>
          <StatsGl />
        </Canvas>
      </div>
      <h1
        style={{
          position: 'absolute',
          color: '#fff458',
          left: '0',
          right: '0',
          top: '80px',
          textAlign: 'center',
          fontSize: '4em',
          fontFamily: 'monospace',
        }}>
        &#xfeff;&#xff26;&#xff29;&#xff22;&#xff25;&#xff32;&#xff37;&#xff21;&#xff36;&#xff25;
      </h1>
    </>
  );
}

function Sun() {
  const mesh = useRef();
  const light = useRef();
  useFrame(({ clock }) => {
    const time = Math.sin(clock.elapsedTime / 10) * 1000;
    mesh.current.position.y = -300 + time;
    light.current.position.y = -300 + time;
  });
  return (
    <>
      <directionalLight ref={light} position={[0, 300, -3000]} args={['#f6c7d9', 100]} castShadow={false} />
      <mesh ref={mesh} position={[0, -300, -3000]}>
        <sphereGeometry args={[1200, 32, 32]} />
        <meshBasicMaterial color="#cc5869" fog={false} />
      </mesh>
    </>
  );
}

function Sky() {
  return (
    <>
      <ambientLight intensity={1} />
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#ffffff', 500, 4000]} />
      {/* <fogExp2 attach="fog" args={['#ffffff', 0.0003]} /> */}
    </>
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
      <planeGeometry args={[5000, 3000, vWidth, vHeight]} />
      <meshLambertMaterial color="#1b1424" />
    </mesh>
  );
}

function getNoise() {
  // const scales = [200, 40];
  // const smoothing = [400, 90];
  const scales = [200, 200, 40];
  const smoothing = [1000, 400, 90];

  const prng = mulberry32(0xdeadbeef);
  const perlin = new SimplexNoise({ random: prng });
  return function (x: number, y: number, offset: number) {
    let result = 0;
    for (let i = 0; i < scales.length; i++) {
      result += scales[i] * perlin.noise(x / smoothing[i], (y + offset) / smoothing[i]);
    }
    return valleyDist(x) * (result + 300);
    // return result;
  };
}

function valleyDist(x: number) {
  const a = -0.4;
  const b = -0.0000004;
  return Math.exp(b * (x / a) ** 2) / (a * Math.sqrt(2 * Math.PI)) + 1;
}
