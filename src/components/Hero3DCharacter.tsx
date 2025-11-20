import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { SpeechBubble } from "./SpeechBubble";

// Simple anime-style character using basic shapes
function AnimeCharacter({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const [idleAnimation, setIdleAnimation] = useState(0);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Idle breathing animation
    setIdleAnimation((prev) => prev + 0.02);
    const breathe = Math.sin(idleAnimation) * 0.05;
    groupRef.current.position.y = breathe;

    // Look at mouse
    const targetX = mousePosition.x * 0.5;
    const targetY = -mousePosition.y * 0.5;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetX,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetY,
      0.05
    );
  });

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#ffd4d4" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.15, 1.6, 0.4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      <mesh position={[0.15, 1.6, 0.4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Eye highlights */}
      <mesh position={[-0.13, 1.65, 0.45]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.17, 1.65, 0.45]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color="#9b59b6" />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.8, 32]} />
        <meshStandardMaterial color="#e8b4f0" />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.4, 0.9, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        <meshStandardMaterial color="#ffd4d4" />
      </mesh>
      <mesh position={[0.4, 0.9, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
        <meshStandardMaterial color="#ffd4d4" />
      </mesh>

      {/* Bow/accessory on head */}
      <mesh position={[0.35, 1.85, 0]}>
        <boxGeometry args={[0.2, 0.15, 0.05]} />
        <meshStandardMaterial color="#ff6b9d" />
      </mesh>
    </group>
  );
}

interface Hero3DCharacterProps {
  onWave?: () => void;
}

export const Hero3DCharacter = ({ onWave }: Hero3DCharacterProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [speechText, setSpeechText] = useState("");
  const [showSpeech, setShowSpeech] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePosition({ x, y });
  };

  // Expose speak function to window for backend integration
  useEffect(() => {
    (window as any).speak = (text: string, audioUrl?: string) => {
      setSpeechText(text);
      setShowSpeech(true);

      if (audioUrl) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        audioRef.current = new Audio(audioUrl);
        audioRef.current.play();
      }

      // Hide speech bubble after text is done
      const duration = Math.max(3000, text.length * 50);
      setTimeout(() => {
        setShowSpeech(false);
      }, duration);
    };

    return () => {
      delete (window as any).speak;
    };
  }, []);

  return (
    <div
      className="relative w-full h-[500px] cursor-pointer"
      onMouseMove={handleMouseMove}
    >
      <SpeechBubble text={speechText} visible={showSpeech} />
      
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 1.5, 4]} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#a855f7" />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#f472b6" />

        {/* Character */}
        <AnimeCharacter mousePosition={mousePosition} />

        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <circleGeometry args={[2, 64]} />
          <meshStandardMaterial
            color="#1a1a2e"
            transparent
            opacity={0.3}
          />
        </mesh>
      </Canvas>
    </div>
  );
};
