import * as THREE from 'three';
import { Suspense, useRef, useMemo, useEffect, useCallback, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { StatsGl } from '@react-three/drei';
import { GridMaterial } from './terrain/Material';
import { easing } from 'maath';

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
  bikeView: {
    fov: 50,
    position: [100, 220, 300],
    lookAt: [0, 40, 0],
  },
  vanishing: {
    fov: 160,
    position: [0, 200, 1200],
    // lookAt: [0, 0, 0],
    lookAt: [0, -300, -1500],
  },
};
export default function App() {
  const camera = useMemo(() => {
    const view = views.vanishing;
    const c = new THREE.PerspectiveCamera(view.fov, window.innerWidth / window.innerHeight, 0.1, 5000);
    // const ca = new THREE.OrthographicCamera()
    c.position.set(view.position[0], view.position[1], view.position[2]);
    c.lookAt(view.lookAt[0], view.lookAt[1], view.lookAt[2]);
    return c;
  }, []);
  return (
    <>
      <div id="canvas-container">
        <Canvas dpr={[1, 2]} camera={camera}>
          <Suspense fallback={null}>
            <Terrain />
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
  // useFrame(({ clock }) => {
  //   const time = Math.sin(clock.elapsedTime / 10) * 1000;
  //   mesh.current.position.y = -300 + time;
  //   light.current.position.y = -300 + time;
  // });
  return (
    <>
      <directionalLight ref={light} position={[0, 300, -3500]} args={['#f6c7d9', 100]} castShadow={false} />
      <mesh ref={mesh} position={[0, -300, -3000]} scale={[1.2, 1, 1]}>
        <circleGeometry args={[1200, 64]} />
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

function Terrain() {
  const { viewport, size } = useThree();
  const material = useRef();

  const [scroll, setScroll] = useState(0);

  const updateScroll = useCallback(
    (event) => {
      // if (window.pageYOffset) {
      //   const delta = Math.sign(window.pageYOffset) * 10.0
      //   const val = Math.max(0, window.pageYOffset + delta)
      //   setState({ scrollTop: val })
      // } else {
      //   console.log('zero', window.pageYOffset)
      // }
      console.log(event);
      setScroll((oldScroll) => oldScroll + event.deltaY);
    },
    [setScroll],
  );

  useEffect(() => {
    console.log('subscribed to wheelEvent');
    window.addEventListener('mousewheel', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, [updateScroll]);

  useFrame((state, delta) => {
    // material.current.time += delta * 1;
    material.current.time = scroll / 5000;
    easing.damp3(material.current.pointer, state.pointer, 0.2, delta);
  });

  return (
    <group>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3000, 3000, 1024, 1024]} />
        <gridMaterial
          ref={material}
          key={GridMaterial.key}
          resolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
        />
      </mesh>
    </group>
  );
}

function Bike() {
  const bodyColor = '#000000';
  return (
    <group position={[0, 13, 600]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[26, 26, 100]} />
        <meshBasicMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0, 0, -50]} scale={[0.9, 1, 1]}>
        <sphereGeometry args={[24, 16, 16]} />
        <meshBasicMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0, 0, 50]} scale={[0.9, 1, 1]}>
        <sphereGeometry args={[24, 16, 16]} />
        <meshBasicMaterial color={bodyColor} />
      </mesh>
      <group position={[0, 0, 50]}>
        <BikeTrail />
      </group>
    </group>
  );
}

function BikeTrail() {
  return (
    <mesh position={[0, 0, 1000]} rotation={[Math.PI / 2, Math.PI / 2, 0]}>
      <boxGeometry args={[30, 2000, 1]} />
      <meshBasicMaterial color="#89672d" />
    </mesh>
  );
}
