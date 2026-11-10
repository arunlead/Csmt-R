"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Points, PointMaterial } from "@react-three/drei";

function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Particles() {
  const positions = useMemo(() => {
    const count = window.innerWidth < 768 ? 1200 : 2800;
    const rand = seeded(7);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() - 0.5) * 12;
arr[i * 3 + 1] = rand() * 8;
      arr[i * 3 + 2] = 20 - rand() * 220;
    }
    return arr;
  }, []);

  return (
    <Points positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#7fd8ff"
        size={0.07}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}