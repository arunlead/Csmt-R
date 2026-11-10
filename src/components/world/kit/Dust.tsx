"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { worldState } from "@/lib/worldState";

const FAR = -38;
const NEAR = 2;

/* small deterministic random generator, so the dust is the same on every load */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Dust({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const rnd = mulberry32(11);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rnd() - 0.5) * 30;
      arr[i * 3 + 1] = (rnd() - 0.5) * 16;
      arr[i * 3 + 2] = FAR + rnd() * (NEAR - FAR);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const attr = pts.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const dt = Math.min(delta, 0.05);
    // drifts slowly when idle, rushes past when you scroll fast
    const speed = 0.6 + Math.min(Math.abs(worldState.velocity) * 30, 14);
    for (let i = 2; i < arr.length; i += 3) {
      arr[i] += speed * dt;
      if (arr[i] > NEAR) arr[i] += FAR - NEAR;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref} renderOrder={100} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffcf8a"
        size={0.07}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}