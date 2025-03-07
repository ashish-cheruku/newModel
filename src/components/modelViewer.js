"use client"
import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF, Center, Html } from '@react-three/drei';
import LoadingIndicator from './loadingIndicator';

function Model({ url, onLoad, setHoveredObjectName }) {
  const { scene } = useGLTF(url);
  const [hoveredPosition, setHoveredPosition] = useState([0, 0, 0]);
  
  // Call onLoad when the model is loaded
  useEffect(() => {
    if (scene && onLoad) {
      onLoad();
    }
  }, [scene, onLoad]);
  
  // Process the scene to make objects interactive
  useEffect(() => {
    scene.traverse((object) => {
      if (object.isMesh) {
        // Store original material properties to restore later
        object.userData.originalMaterial = object.material.clone();
        // Make sure each object has a name for display
        if (!object.name) object.name = `Part_${object.id}`;
      }
    });
  }, [scene]);
  
  const handlePointerOver = (e) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    
    // Set hovered object name in parent component
    setHoveredObjectName(e.object.name);
    
    // Set position for the label (if you still want to use it for something else)
    setHoveredPosition([
      e.point.x,
      e.point.y + 0.1,
      e.point.z
    ]);
    
    // Highlight the object
    if (e.object.material) {
      e.object.material.emissive = e.object.material.emissive || { set: () => {} };
      e.object.material.emissive.set(0x333333);
      e.object.material.needsUpdate = true;
    }
  };
  
  const handlePointerOut = (e) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
    setHoveredObjectName(null);
    
    // Reset the material
    if (e.object.material) {
      e.object.material.emissive.set(0x000000);
      e.object.material.needsUpdate = true;
    }
  };

  return (
    <Center>
      <group>
        <primitive 
          object={scene} 
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      </group>
    </Center>
  );
}

function CameraController({ controlsRef }) {
  const { camera } = useThree();
  
  const zoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(2);
      controlsRef.current.update();
    }
  };
  
  const zoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(2);
      controlsRef.current.update();
    }
  };
  
  return (
    <Html fullscreen>
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button 
          onClick={zoomIn}
          className="bg-gray-800 text-white p-2 rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg hover:bg-gray-700"
        >
          -
        </button>
        <button 
          onClick={zoomOut}
          className="bg-gray-800 text-white p-2 rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg hover:bg-gray-700"
        >
          +
        </button>
      </div>
    </Html>
  );
}

export default function ModelViewer() {
  const [loading, setLoading] = useState(true);
  const [hoveredObjectName, setHoveredObjectName] = useState(null);
  const controlsRef = useRef();

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50">
          <LoadingIndicator />
        </div>
      )}
      
      {/* Info box at the bottom */}
      <div className="absolute bottom-4 left-4 z-20 bg-black bg-opacity-75 text-white px-3 py-2 rounded shadow-lg max-w-xs">
        {hoveredObjectName ? (
          <p>Your cursor is on: <span className="font-semibold">{hoveredObjectName}</span></p>
        ) : (
          <p>Hover over a part to see its name</p>
        )}
      </div>
      
      <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
        <color attach="background" args={['#111']} />
        <Environment preset="studio" />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Suspense fallback={null}>
          <Model 
            url="/api/model" 
            onLoad={() => setLoading(false)}
            setHoveredObjectName={setHoveredObjectName}
          />
        </Suspense>
        <OrbitControls 
          ref={controlsRef}
          minDistance={2}
          maxDistance={10}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
        <CameraController controlsRef={controlsRef} />
      </Canvas>
    </div>
  );
}
