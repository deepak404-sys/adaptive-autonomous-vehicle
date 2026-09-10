"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface TrafficUnit {
  id: string;
  label: string;
  lane: number;
  z: number;
  speed: number;
  color: string;
  kind: "car" | "auto" | "bike";
}

function Car({ color = "#38bdf8" }: { color?: string }) {
  return (
    <group>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.5, 3.6]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.72, -0.2]} castShadow>
        <boxGeometry args={[1.4, 0.4, 1.8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.2} roughness={0.1} />
      </mesh>
      {[
        [-0.85, 0.15, 1.2],
        [0.85, 0.15, 1.2],
        [-0.85, 0.15, -1.2],
        [0.85, 0.15, -1.2],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.32, 0.32, 0.28, 16]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[-0.55, 0.4, 1.82]}>
        <boxGeometry args={[0.25, 0.12, 0.05]} />
        <meshStandardMaterial color="#fef9c3" emissive="#fef9c3" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0.55, 0.4, 1.82]}>
        <boxGeometry args={[0.25, 0.12, 0.05]} />
        <meshStandardMaterial color="#fef9c3" emissive="#fef9c3" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

function Bike({ color = "#f472b6" }: { color?: string }) {
  return (
    <group>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.35, 0.35, 1.6]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.05, -0.1]} castShadow>
        <capsuleGeometry args={[0.18, 0.5, 4, 8]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {[
        [0, 0.28, 0.75],
        [0, 0.28, -0.75],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.08, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
    </group>
  );
}

function TrafficVehicle({ unit }: { unit: TrafficUnit }) {
  const ref = useRef<THREE.Group>(null);
  const [distance, setDistance] = useState(0);
  const [speedKmh, setSpeedKmh] = useState(0);

  useFrame(() => {
    unit.z += unit.speed;
    if (unit.z > 8) unit.z = -60 - Math.random() * 20;
    if (ref.current) {
      ref.current.position.set(unit.lane * 2.2, 0, unit.z);
    }
    setDistance(Math.abs(unit.z - 6));
    setSpeedKmh(Math.round(unit.speed * 900));
  });

  const visible = unit.z > -35 && unit.z < 6;

  return (
    <group ref={ref}>
      {unit.kind === "bike" ? <Bike color={unit.color} /> : <Car color={unit.color} />}
      {visible && (
        <Html position={[0, 1.6, 0]} center distanceFactor={12} occlude>
          <div className="bg-black/70 border border-emerald-500/40 rounded px-2 py-1 text-[10px] font-mono text-emerald-400 whitespace-nowrap select-none">
            <div className="font-semibold">{unit.label}</div>
            <div className="text-slate-300">{distance.toFixed(1)} m</div>
            <div className="text-slate-300">{speedKmh} km/h</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function Pedestrian({ startX, z }: { startX: number; z: number }) {
  const ref = useRef<THREE.Group>(null);
  const t = useRef(Math.random() * 10);

  useFrame((_, delta) => {
    t.current += delta;
    if (ref.current) {
      ref.current.position.x = startX + Math.sin(t.current * 0.5) * 1.5;
      ref.current.position.z = z;
    }
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.9, 4, 8]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[0, 1.55, 0]} castShadow>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#e2c9a0" />
      </mesh>
      <Html position={[0, 2, 0]} center distanceFactor={12} occlude>
        <div className="bg-black/70 border border-orange-400/40 rounded px-2 py-0.5 text-[10px] font-mono text-orange-300 whitespace-nowrap">
          PEDESTRIAN
        </div>
      </Html>
    </group>
  );
}

function Road() {
  const dashes = useMemo(() => {
    const arr: number[] = [];
    for (let z = -80; z < 20; z += 4) arr.push(z);
    return arr;
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -30]} receiveShadow>
        <planeGeometry args={[9, 140]} />
        <meshStandardMaterial color="#2a2f3a" roughness={0.85} />
      </mesh>

      {[-5.2, 5.2].map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, -30]} receiveShadow>
          <planeGeometry args={[2.4, 140]} />
          <meshStandardMaterial color="#2b2f38" roughness={1} />
        </mesh>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -30]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#0a0c10" roughness={1} />
      </mesh>

      {dashes.map((z, i) => (
        <mesh key={i} position={[0, 0.021, z]}>
          <boxGeometry args={[0.15, 0.01, 1.6]} />
          <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.3} />
        </mesh>
      ))}

      {[-3.8, 3.8].map((x, i) => (
        <mesh key={i} position={[x, 0.021, -30]}>
          <boxGeometry args={[0.1, 0.01, 140]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.25} />
        </mesh>
      ))}

      {[-20, -40, -60].map((z, i) => (
        <group key={i} position={[-5.6, 0, z]}>
          <mesh position={[0, 2, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 4, 8]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <mesh position={[0.4, 4, 0]}>
            <sphereGeometry args={[0.15, 10, 10]} />
            <meshStandardMaterial color="#fde68a" emissive="#fde68a" emissiveIntensity={2} />
          </mesh>
          <pointLight position={[0.4, 4, 0]} intensity={8} distance={12} color="#fde68a" />
        </group>
      ))}
    </group>
  );
}

function EgoPathLine() {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let z = 4; z > -50; z -= 2) {
      const curve = Math.sin(z * 0.05) * 0.6;
      pts.push(new THREE.Vector3(curve, 0.03, z));
    }
    return pts;
  }, []);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    // @ts-expect-error - line primitive
    <line geometry={geometry}>
      <lineBasicMaterial color="#10b981" linewidth={2} transparent opacity={0.7} />
    </line>
  );
}

function CameraRig() {
  useFrame((state) => {
    state.camera.position.lerp(new THREE.Vector3(0, 3.2, 9), 0.05);
    state.camera.lookAt(0, 1, -10);
  });
  return null;
}

export default function DrivingScene3D() {
  const traffic = useRef<TrafficUnit[]>([
    { id: "c1", label: "CAR 1", lane: -1, z: -15, speed: 0.09, color: "#38bdf8", kind: "car" },
    { id: "c2", label: "CAR 2", lane: 1, z: -35, speed: 0.06, color: "#f87171", kind: "car" },
    { id: "b1", label: "TWO-WHEELER 1", lane: -0.4, z: -25, speed: 0.11, color: "#f472b6", kind: "bike" },
    { id: "c3", label: "CAR 3", lane: 0.8, z: -55, speed: 0.07, color: "#a78bfa", kind: "car" },
  ]);

  return (
    <div className="relative w-full h-full min-h-[320px] rounded-xl overflow-hidden bg-black">
      <Canvas shadows camera={{ position: [0, 3.2, 9], fov: 55 }}>
        <fog attach="fog" args={["#0b1220", 22, 80]} />
        <color attach="background" args={["#0b1220"]} />

        <ambientLight intensity={0.6} />
        <hemisphereLight args={["#3b82f6", "#0a0e17", 0.4]} />
        <directionalLight
          position={[10, 15, 5]}
          intensity={1.4}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        <Road />
        <EgoPathLine />

        <group position={[0, 0, 5.5]}>
          <Car color="#10b981" />
        </group>

        {traffic.current.map((u) => (
          <TrafficVehicle key={u.id} unit={u} />
        ))}

        <Pedestrian startX={-5.6} z={-10} />
        <Pedestrian startX={5.6} z={-22} />

        <CameraRig />
      </Canvas>

      <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur px-2.5 py-1 rounded text-xs border border-white/10">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-white font-semibold tracking-wide">3D PERCEPTION</span>
      </div>
    </div>
  );
}