"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { MeshReflectorMaterial } from "@react-three/drei";

const LENGTH = 160;
const RACK_W = 1.6;
const RACK_H = 6;
const RACK_D = 1.6;
const STEP = RACK_D + 0.4;
const SIDE = 6.5;
const COUNT = Math.floor(LENGTH / STEP);

function Racks() {
  const body = useRef<THREE.InstancedMesh>(null);
  const strips = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const bm = body.current;
    const sm = strips.current;
    if (!bm || !sm) return;

    const o = new THREE.Object3D();
    const c = new THREE.Color();
    const palette = ["#7fd8ff", "#7fd8ff", "#7fd8ff", "#7fd8ff", "#ff2e93", "#ffb44a"];
    let b = 0;
    let s = 0;

    for (const side of [-1, 1]) {
      for (let i = 0; i < COUNT; i++) {
        const z = 6 - i * STEP;

        o.position.set(side * SIDE, RACK_H / 2, z);
        o.updateMatrix();
        bm.setMatrixAt(b, o.matrix);
        bm.setColorAt(b, c.set("#0b1a33").multiplyScalar(0.6 + Math.random() * 0.8));
        b++;

        const col = palette[Math.floor(Math.random() * palette.length)];
        for (const dz of [-0.45, 0.45]) {
          o.position.set(side * (SIDE - RACK_W / 2 - 0.02), 3, z + dz);
          o.updateMatrix();
          sm.setMatrixAt(s, o.matrix);
          sm.setColorAt(s, c.set(col));
          s++;
        }
      }
    }

    bm.instanceMatrix.needsUpdate = true;
    sm.instanceMatrix.needsUpdate = true;
    if (bm.instanceColor) bm.instanceColor.needsUpdate = true;
    if (sm.instanceColor) sm.instanceColor.needsUpdate = true;
  }, []);

  return (
    <>
      <instancedMesh ref={body} args={[undefined, undefined, COUNT * 2]}>
        <boxGeometry args={[RACK_W, RACK_H, RACK_D]} />
        <meshBasicMaterial color="#ffffff" />
      </instancedMesh>
      <instancedMesh ref={strips} args={[undefined, undefined, COUNT * 4]}>
        <boxGeometry args={[0.03, 4.6, 0.06]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </instancedMesh>
    </>
  );
}

function HexLights() {
  const items = useMemo(() => {
    const arr: { x: number; z: number; s: number }[] = [];
    for (let z = 0; z > -LENGTH; z -= 9) {
      arr.push({ x: -3.2, z, s: 1.3 });
      arr.push({ x: 3.2, z: z - 4.5, s: 1.3 });
      arr.push({ x: 0, z: z - 2, s: 1.9 });
    }
    return arr;
  }, []);

  return (
    <group position={[0, 8.6, 0]}>
      {items.map((h, i) => (
        <mesh key={i} rotation-x={Math.PI / 2} position={[h.x, 0, h.z]} scale={h.s}>
          <ringGeometry args={[0.85, 1, 6]} />
          <meshBasicMaterial color="#e6f7ff" toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

export default function ServerRoom() {
  const mobile = useMemo(
    () => typeof window !== "undefined" && window.innerWidth < 768,
    []
  );

  return (
    <group>
      <Racks />
      <HexLights />

      {/* ceiling */}
      <mesh rotation-x={Math.PI / 2} position={[0, 9, -LENGTH / 2 + 6]}>
        <planeGeometry args={[40, LENGTH + 20]} />
        <meshBasicMaterial color="#050c1c" side={THREE.DoubleSide} />
      </mesh>

      {/* glossy floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -LENGTH / 2 + 6]}>
        <planeGeometry args={[40, LENGTH + 20]} />
        {mobile ? (
          <meshBasicMaterial color="#07122a" />
        ) : (
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={512}
            mixBlur={1}
            mixStrength={40}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050a14"
            metalness={0.6}
            mirror={0}
          />
        )}
      </mesh>
    </group>
  );
}