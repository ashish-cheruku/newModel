"use client"
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF, Center } from '@react-three/drei';

function Model({ url }) {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

export default function ModelViewer() {
  return (
    <div style={{ width: '100%', height: '1000px' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
        <Environment preset="studio" />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Suspense fallback={null}>
          <Model url="/api/model" />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
