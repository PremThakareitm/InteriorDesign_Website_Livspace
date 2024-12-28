import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';

// Loading component
function Loader() {
  return (
    <Html center>
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading room...</p>
      </div>
    </Html>
  );
}

// Floor component
function Floor({ floorColor, ...props }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow {...props}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial 
        color={floorColor || "#CCCCCC"}
        {...props}
      />
    </mesh>
  );
}

// Walls component
function Walls({ wallColor, ...props }) {
  return (
    <group>
      <mesh position={[0, 5, -10]} receiveShadow {...props}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color={wallColor || "#FFFFFF"} {...props} />
      </mesh>
      <mesh position={[-10, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow {...props}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color={wallColor || "#FFFFFF"} {...props} />
      </mesh>
      <mesh position={[10, 5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow {...props}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color={wallColor || "#FFFFFF"} {...props} />
      </mesh>
    </group>
  );
}

// Windows component
function Windows() {
  return (
    <group>
      <mesh position={[4, 5, -9.9]} receiveShadow castShadow>
        <planeGeometry args={[3, 4]} />
        <meshPhysicalMaterial
          color="#87CEEB"
          roughness={0}
          metalness={1}
          transparent
          opacity={0.3}
          envMapIntensity={3}
        />
      </mesh>
      <mesh position={[2.5, 5, -9.9]}>
        <boxGeometry args={[0.1, 4, 0.1]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.8} envMapIntensity={2} />
      </mesh>
      <mesh position={[5.5, 5, -9.9]}>
        <boxGeometry args={[0.1, 4, 0.1]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.8} envMapIntensity={2} />
      </mesh>
    </group>
  );
}

// Lighting component
function Lights({ mode = 'day', intensity, ambient }) {
  const isDay = mode === 'day';
  return (
    <>
      <ambientLight intensity={ambient} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={intensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-5, 8, -5]} intensity={isDay ? 1.5 : 0.5} />
      <pointLight position={[5, 8, 5]} intensity={isDay ? 1.5 : 0.5} />
      <hemisphereLight
        skyColor={isDay ? "#ffffff" : "#000033"}
        groundColor={isDay ? "#ffffff" : "#000000"}
        intensity={isDay ? 2 : 0.5}
      />
      <spotLight
        position={[0, 10, 0]}
        angle={Math.PI / 4}
        penumbra={0.1}
        intensity={isDay ? 2 : 0.5}
        castShadow
      />
    </>
  );
}

// Furniture component
function Furniture({ roomType, ...props }) {
  const livingRoom = () => (
    <group>
      <mesh position={[-2, 0.25, -3]} castShadow receiveShadow {...props}>
        <boxGeometry args={[3, 0.5, 1]} />
        <meshStandardMaterial color="#E0C9A6" {...props} />
      </mesh>
      <mesh position={[-2, 0.75, -3.5]} castShadow receiveShadow {...props}>
        <boxGeometry args={[3, 1, 0.3]} />
        <meshStandardMaterial color="#E0C9A6" {...props} />
      </mesh>
      <mesh position={[0, 0.75, -9.5]} castShadow receiveShadow {...props}>
        <boxGeometry args={[4, 1.5, 0.3]} />
        <meshStandardMaterial color="#2c2c2c" {...props} />
      </mesh>
    </group>
  );

  const bedroom = () => (
    <group>
      <mesh position={[0, 0.3, -5]} castShadow receiveShadow {...props}>
        <boxGeometry args={[2.5, 0.6, 3]} />
        <meshStandardMaterial color="#D4B895" {...props} />
      </mesh>
      <mesh position={[-8, 1.5, -9]} castShadow receiveShadow {...props}>
        <boxGeometry args={[2, 3, 0.6]} />
        <meshStandardMaterial color="#8B4513" {...props} />
      </mesh>
    </group>
  );

  const kitchen = () => (
    <group>
      <mesh position={[0, 0.45, -2]} castShadow receiveShadow {...props}>
        <boxGeometry args={[3, 0.9, 1.2]} />
        <meshStandardMaterial color="#2c2c2c" {...props} />
      </mesh>
      <mesh position={[0, 1, -9.7]} castShadow receiveShadow {...props}>
        <boxGeometry args={[4, 2, 0.6]} />
        <meshStandardMaterial color="#FFFFFF" {...props} />
      </mesh>
    </group>
  );

  const office = () => (
    <group>
      <mesh position={[0, 0.4, -3]} castShadow receiveShadow {...props}>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#8B4513" {...props} />
      </mesh>
      <mesh position={[0, 0.5, -2]} castShadow receiveShadow {...props}>
        <boxGeometry args={[0.6, 1, 0.6]} />
        <meshStandardMaterial color="#2c2c2c" {...props} />
      </mesh>
    </group>
  );

  const dining = () => (
    <group>
      <mesh position={[0, 0.4, -2.5]} castShadow receiveShadow {...props}>
        <boxGeometry args={[2.5, 0.1, 1.5]} />
        <meshStandardMaterial color="#8B4513" {...props} />
      </mesh>
      {[[-0.8, -2], [0, -2], [0.8, -2], [-0.8, -3], [0, -3], [0.8, -3]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.25, pos[1]]} castShadow receiveShadow {...props}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#D4B895" {...props} />
        </mesh>
      ))}
    </group>
  );

  switch (roomType) {
    case 'living':
      return livingRoom();
    case 'bedroom':
      return bedroom();
    case 'kitchen':
      return kitchen();
    case 'office':
      return office();
    case 'dining':
      return dining();
    default:
      return null;
  }
}

// Main RoomVisualizer component
const RoomVisualizer = ({ room, lighting = 'day', wallColor, floorColor, style = 'modern', material = 'standard' }) => {
  const [cameraPosition] = useState([12, 8, 12]);

  // Style configurations
  const styleConfigs = {
    modern: {
      materials: {
        wall: { roughness: 0.5, metalness: 0.2, envMapIntensity: 2 },
        floor: { roughness: 0.5, metalness: 0.2, envMapIntensity: 2 },
        furniture: { roughness: 0.3, metalness: 0.5, envMapIntensity: 2.5 }
      },
      lighting: { intensity: 2, ambient: 1.5 }
    },
    minimalist: {
      materials: {
        wall: { roughness: 0.7, metalness: 0.1, envMapIntensity: 1.5 },
        floor: { roughness: 0.6, metalness: 0.1, envMapIntensity: 1.5 },
        furniture: { roughness: 0.5, metalness: 0.2, envMapIntensity: 2 }
      },
      lighting: { intensity: 1.8, ambient: 1.3 }
    },
    luxury: {
      materials: {
        wall: { roughness: 0.3, metalness: 0.6, envMapIntensity: 3 },
        floor: { roughness: 0.2, metalness: 0.8, envMapIntensity: 3 },
        furniture: { roughness: 0.2, metalness: 0.7, envMapIntensity: 3.5 }
      },
      lighting: { intensity: 2.5, ambient: 2 }
    },
    traditional: {
      materials: {
        wall: { roughness: 0.8, metalness: 0.1, envMapIntensity: 1.5 },
        floor: { roughness: 0.7, metalness: 0.1, envMapIntensity: 1.5 },
        furniture: { roughness: 0.6, metalness: 0.15, envMapIntensity: 2 }
      },
      lighting: { intensity: 1.5, ambient: 1.2 }
    }
  };

  // Material textures
  const materialTextures = {
    standard: null,
    wooden: {
      map: '/textures/wood_diffuse.jpg',
      normalMap: '/textures/wood_normal.jpg',
      roughnessMap: '/textures/wood_roughness.jpg'
    },
    marble: {
      map: '/textures/marble_diffuse.jpg',
      normalMap: '/textures/marble_normal.jpg',
      roughnessMap: '/textures/marble_roughness.jpg'
    },
    carpet: {
      map: '/textures/carpet_diffuse.jpg',
      normalMap: '/textures/carpet_normal.jpg',
      roughnessMap: '/textures/carpet_roughness.jpg'
    }
  };

  // Get current style configuration
  const currentStyle = styleConfigs[style] || styleConfigs.modern;

  // Update material properties based on style and material type
  const getMaterialProps = (type) => {
    const baseProps = currentStyle.materials[type] || currentStyle.materials.furniture;
    const textureProps = materialTextures[material];
    
    return {
      ...baseProps,
      ...(textureProps || {})
    };
  };

  // Modified Scene component with style and material props
  const StyledScene = ({ roomType, wallColor, floorColor, lightingMode }) => {
    return (
      <>
        <Lights 
          mode={lightingMode} 
          intensity={currentStyle.lighting.intensity}
          ambient={currentStyle.lighting.ambient}
        />
        <Floor 
          floorColor={floorColor} 
          {...getMaterialProps('floor')}
        />
        <Walls 
          wallColor={wallColor} 
          {...getMaterialProps('wall')}
        />
        <Windows />
        <Furniture 
          roomType={roomType} 
          {...getMaterialProps('furniture')}
        />
      </>
    );
  };

  return (
    <div style={{ width: '100%', height: '100%', background: '#1a1a1a' }}>
      <Canvas 
        shadows 
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.5,
          outputEncoding: THREE.sRGBEncoding
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#1a1a1a']} />
        <fog attach="fog" args={['#1a1a1a', 25, 35]} />
        <PerspectiveCamera makeDefault position={cameraPosition} fov={45} near={0.1} far={1000} />
        <Suspense fallback={<Loader />}>
          <StyledScene 
            roomType={room} 
            wallColor={wallColor} 
            floorColor={floorColor} 
            lightingMode={lighting}
          />
          <Environment 
            preset="apartment" 
            ground={{ height: 5, radius: 40, scale: 20 }} 
            intensity={2}
          />
        </Suspense>
        <OrbitControls
          makeDefault
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={5}
          maxDistance={20}
          target={[0, 0, 0]}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
};

export default RoomVisualizer;
