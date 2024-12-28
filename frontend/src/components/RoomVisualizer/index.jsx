import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars, Sky } from '@react-three/drei';
import { Suspense, useState } from 'react';
import * as THREE from 'three';

const LivingRoom = ({ wallColor, floorColor, style }) => (
  <group>
    {/* Floor */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshPhysicalMaterial color={floorColor} roughness={0.3} metalness={0.1} clearcoat={0.5} />
    </mesh>

    {/* Walls */}
    <mesh position={[0, 6, -6]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshPhysicalMaterial color={wallColor} roughness={0.5} metalness={0.1} clearcoat={0.3} />
    </mesh>
    <mesh position={[-6, 6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshPhysicalMaterial color={wallColor} roughness={0.5} metalness={0.1} clearcoat={0.3} />
    </mesh>

    {/* Sofa */}
    <group position={[0, 1, -4]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[6, 1.2, 2]} />
        <meshPhysicalMaterial 
          color={style === 'modern' ? '#404040' : style === 'luxury' ? '#8B4513' : '#6B4423'}
          roughness={0.2}
          metalness={0.3}
          clearcoat={0.6}
        />
      </mesh>
      <mesh position={[0, 1, -0.8]} castShadow receiveShadow>
        <boxGeometry args={[6, 1, 0.4]} />
        <meshPhysicalMaterial 
          color={style === 'modern' ? '#505050' : style === 'luxury' ? '#A0522D' : '#8B7355'}
          roughness={0.2}
          metalness={0.3}
          clearcoat={0.6}
        />
      </mesh>
    </group>

    {/* Coffee Table */}
    <mesh position={[0, 0.4, -1]} castShadow receiveShadow>
      <boxGeometry args={[3, 0.8, 1.5]} />
      <meshPhysicalMaterial 
        color={style === 'modern' ? '#303030' : style === 'luxury' ? '#2C1810' : '#4A3C2C'}
        roughness={0.1}
        metalness={0.5}
        clearcoat={0.8}
      />
    </mesh>

    {/* TV Unit */}
    <mesh position={[0, 1.5, -5.8]} castShadow receiveShadow>
      <boxGeometry args={[5, 3, 0.4]} />
      <meshPhysicalMaterial 
        color="#000000"
        roughness={0.1}
        metalness={0.8}
        clearcoat={1}
      />
    </mesh>
  </group>
);

const DiningRoom = ({ wallColor, floorColor, style }) => (
  <group>
    {/* Floor */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshPhysicalMaterial color={floorColor} roughness={0.3} metalness={0.1} clearcoat={0.5} />
    </mesh>

    {/* Walls */}
    <mesh position={[0, 6, -6]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshPhysicalMaterial color={wallColor} roughness={0.5} metalness={0.1} clearcoat={0.3} />
    </mesh>
    <mesh position={[-6, 6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshPhysicalMaterial color={wallColor} roughness={0.5} metalness={0.1} clearcoat={0.3} />
    </mesh>

    {/* Dining Table */}
    <mesh position={[0, 1.5, -3]} castShadow receiveShadow>
      <boxGeometry args={[4, 0.2, 2]} />
      <meshPhysicalMaterial 
        color={style === 'modern' ? '#202020' : style === 'luxury' ? '#3C1810' : '#4A3C2C'}
        roughness={0.1}
        metalness={0.7}
        clearcoat={0.9}
      />
    </mesh>

    {/* Table Legs */}
    {[[-1.8, -1], [-1.8, 1], [1.8, -1], [1.8, 1]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.75, z - 3]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.1, 1.5]} />
        <meshPhysicalMaterial 
          color={style === 'modern' ? '#202020' : style === 'luxury' ? '#3C1810' : '#4A3C2C'}
          roughness={0.1}
          metalness={0.7}
          clearcoat={0.9}
        />
      </mesh>
    ))}

    {/* Chairs */}
    {[[-1.5, -1], [-1.5, 1], [1.5, -1], [1.5, 1], [0, -1.5], [0, 1.5]].map(([x, z], i) => (
      <group key={i} position={[x, 0.9, z - 3]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.1, 0.8]} />
          <meshPhysicalMaterial 
            color={style === 'modern' ? '#404040' : style === 'luxury' ? '#8B4513' : '#6B4423'}
            roughness={0.2}
            metalness={0.3}
            clearcoat={0.6}
          />
        </mesh>
        <mesh position={[0, 0.5, -0.35]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 1, 0.1]} />
          <meshPhysicalMaterial 
            color={style === 'modern' ? '#404040' : style === 'luxury' ? '#8B4513' : '#6B4423'}
            roughness={0.2}
            metalness={0.3}
            clearcoat={0.6}
          />
        </mesh>
      </group>
    ))}

    {/* Chandelier */}
    <mesh position={[0, 5, -3]} castShadow>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshPhysicalMaterial 
        color={style === 'modern' ? '#909090' : style === 'luxury' ? '#FFD700' : '#B8860B'}
        roughness={0.1}
        metalness={0.9}
        clearcoat={1}
      />
    </mesh>
  </group>
);

const Bedroom = ({ wallColor, floorColor, style }) => (
  <group>
    {/* Floor */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshPhysicalMaterial color={floorColor} roughness={0.3} metalness={0.1} clearcoat={0.5} />
    </mesh>

    {/* Walls */}
    <mesh position={[0, 6, -6]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshPhysicalMaterial color={wallColor} roughness={0.5} metalness={0.1} clearcoat={0.3} />
    </mesh>
    <mesh position={[-6, 6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshPhysicalMaterial color={wallColor} roughness={0.5} metalness={0.1} clearcoat={0.3} />
    </mesh>

    {/* Bed */}
    <group position={[0, 1, -4]}>
      {/* Mattress */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4, 0.4, 6]} />
        <meshPhysicalMaterial 
          color={style === 'modern' ? '#FFFFFF' : style === 'luxury' ? '#FFF5E1' : '#FFF8DC'}
          roughness={0.5}
          metalness={0.1}
          clearcoat={0.3}
        />
      </mesh>
      {/* Headboard */}
      <mesh position={[0, 1.5, -2.8]} castShadow receiveShadow>
        <boxGeometry args={[4, 3, 0.4]} />
        <meshPhysicalMaterial 
          color={style === 'modern' ? '#404040' : style === 'luxury' ? '#8B4513' : '#6B4423'}
          roughness={0.2}
          metalness={0.3}
          clearcoat={0.6}
        />
      </mesh>
    </group>

    {/* Nightstands */}
    {[-2.5, 2.5].map((x, i) => (
      <mesh key={i} position={[x, 0.75, -4]} castShadow receiveShadow>
        <boxGeometry args={[1, 1.5, 1]} />
        <meshPhysicalMaterial 
          color={style === 'modern' ? '#303030' : style === 'luxury' ? '#2C1810' : '#4A3C2C'}
          roughness={0.1}
          metalness={0.5}
          clearcoat={0.8}
        />
      </mesh>
    ))}

    {/* Wardrobe */}
    <mesh position={[-5, 3, -2]} castShadow receiveShadow>
      <boxGeometry args={[1.5, 6, 3]} />
      <meshPhysicalMaterial 
        color={style === 'modern' ? '#505050' : style === 'luxury' ? '#3C1810' : '#4A3C2C'}
        roughness={0.2}
        metalness={0.4}
        clearcoat={0.7}
      />
    </mesh>
  </group>
);

const RoomVisualizer = ({
  style = 'modern',
  roomType = 'living',
  wallColor = '#e0e0e0',
  floorColor = '#d0d0d0',
  lighting = 'bright'
}) => {
  const [cameraPosition, setCameraPosition] = useState([10, 5, 10]);
  const [targetPosition] = useState([0, 0, 0]);

  const handleUpdateCamera = (param, value) => {
    if (param === 'height') {
      setCameraPosition(prev => [prev[0], Number(value), prev[2]]);
    } else if (param === 'distance') {
      const angle = Math.atan2(cameraPosition[2], cameraPosition[0]);
      setCameraPosition([
        Math.cos(angle) * Number(value),
        cameraPosition[1],
        Math.sin(angle) * Number(value)
      ]);
    }
  };

  const handleResetView = () => {
    setCameraPosition([10, 5, 10]);
  };

  const getRoomComponent = () => {
    switch (roomType) {
      case 'living':
        return <LivingRoom wallColor={wallColor} floorColor={floorColor} style={style} />;
      case 'dining':
        return <DiningRoom wallColor={wallColor} floorColor={floorColor} style={style} />;
      case 'bedroom':
        return <Bedroom wallColor={wallColor} floorColor={floorColor} style={style} />;
      default:
        return <LivingRoom wallColor={wallColor} floorColor={floorColor} style={style} />;
    }
  };

  return (
    <div className="relative w-full h-[80vh] bg-gradient-to-b from-gray-50 to-gray-100">
      <Canvas shadows>
        <color attach="background" args={['#f0f0f0']} />
        
        <PerspectiveCamera
          makeDefault
          position={cameraPosition}
          fov={60}
          near={0.1}
          far={1000}
        />
        
        <Environment preset={lighting === 'bright' ? 'sunset' : 'night'} />
        
        {lighting === 'bright' ? (
          <Sky sunPosition={[100, 20, 100]} />
        ) : (
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
        )}
        
        <ambientLight intensity={lighting === 'bright' ? 0.8 : 0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={lighting === 'bright' ? 1.5 : 0.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        
        <Suspense fallback={null}>
          {getRoomComponent()}
        </Suspense>
        
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={20}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          target={targetPosition}
        />
      </Canvas>
    </div>
  );
};

export default RoomVisualizer;
