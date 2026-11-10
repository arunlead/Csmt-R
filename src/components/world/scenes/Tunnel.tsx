"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshReflectorMaterial } from "@react-three/drei";
import { TIERS, type Tier } from "@/lib/world/quality";
import { seeded } from "@/lib/world/rng";
import { HQ_ENTRY, TUNNEL, TUNNEL_END_Z } from "@/lib/world/scenes";
import { smoothstep, worldState } from "@/lib/world/worldState";
import { makePanelTextures, tiled, type PanelTextures } from "../kit/textures";
import {
  glowMaterial,
  ledMaterial,
  makeStripUniforms,
  stripMaterial,
  type StripUniforms,
} from "../kit/stripMaterial";
import Dust from "../kit/Dust";

const { halfWidth: HW, height: H, seg: SEG, count: N, startZ } = TUNNEL;
const LEN = startZ - TUNNEL_END_Z;

const isBay = (i: number) => i >= 2 && i % 2 === 0 && i < N - 1;
const segZ = (i: number) => startZ - SEG * (i + 0.5);
const ribZ = (i: number) => startZ - SEG * i;

const PLATE_Y = [1.1, 2.6, 4.1, 5.6];
const STRIP_DY = -0.62;

type Inst = {
  p: [number, number, number];
  s: [number, number, number];
  rx?: number;
  ry?: number;
  tint?: [number, number, number];
  seed?: number;
};

const _o = new THREE.Object3D();
function writeMatrices(mesh: THREE.InstancedMesh, items: Inst[]) {
  items.forEach((it, i) => {
    _o.position.set(...it.p);
    _o.scale.set(...it.s);
    _o.rotation.set(it.rx ?? 0, it.ry ?? 0, 0);
    _o.updateMatrix();
    mesh.setMatrixAt(i, _o.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
}

function geoWithAttrs(base: THREE.BufferGeometry, items: Inst[]) {
  const tint = new Float32Array(items.length * 3);
  const seed = new Float32Array(items.length);
  items.forEach((it, i) => {
    const t = it.tint ?? [1, 0.58, 0.22];
    tint.set(t, i * 3);
    seed[i] = it.seed ?? i * 0.137;
  });
  base.setAttribute("aTint", new THREE.InstancedBufferAttribute(tint, 3));
  base.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seed, 1));
  return base;
}

function useDispose(...objs: { dispose: () => void }[]) {
  useEffect(
    () => () => objs.forEach((o) => o.dispose()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    objs
  );
}

function Architecture({ tex }: { tex: PanelTextures }) {
  const solid = useMemo(() => {
    const r = seeded(21);
    const slabs: Inst[] = [];
    const ribs: Inst[] = [];
    const plates: Inst[] = [];
    const racks: Inst[] = [];

    for (const side of [-1, 1]) {
      for (let i = 0; i < N; i++) {
        const z = segZ(i);
        slabs.push({ p: [side * (HW + 0.45), H / 2, z], s: [0.9, H, SEG - 0.04] });
        if (isBay(i)) {
          plates.push({ p: [side * 4.85, 6.5, z], s: [0.8, 1.4, SEG - 0.6] });
          for (const dz of [-2.4, 0, 2.4]) {
            racks.push({ p: [side * 4.35, 2.8, z + dz], s: [0.9, 5.6, 2.2] });
          }
        } else {
          PLATE_Y.forEach((y) => {
            const off = r() * 0.1;
            plates.push({ p: [side * (4.95 + off), y, z], s: [0.6, 1.15, SEG - 1.0] });
          });
        }
      }
      for (let i = 0; i <= N; i++) {
        ribs.push({ p: [side * 4.675, H / 2, ribZ(i)], s: [0.95, H, 0.7] });
      }
    }
    for (let i = 0; i <= N; i++) {
      ribs.push({ p: [0, H - 0.25, ribZ(i)], s: [HW * 2 + 0.4, 0.5, 0.6] });
    }
    return { slabs, ribs, plates, racks };
  }, []);

  const parts = useMemo(() => {
    const box = () => new THREE.BoxGeometry(1, 1, 1);
    const wall = tiled(tex, 1, 1);
    const plate = tiled(tex, 3, 0.6);
    const rack = tiled(tex, 0.5, 2);
    const mk = (t: PanelTextures, color: string, rough: number, metal: number) =>
      new THREE.MeshStandardMaterial({
        map: t.map,
        bumpMap: t.bump,
        bumpScale: 1.6,
        color,
        roughness: rough,
        metalness: metal,
      });
    return {
      gSlab: box(),
      gRib: box(),
      gPlate: box(),
      gRack: box(),
      mSlab: mk(wall, "#cdbfae", 0.62, 0.7),
      mRib: mk(wall, "#b8a995", 0.5, 0.8),
      mPlate: mk(plate, "#d6c6b0", 0.45, 0.85),
      mRack: mk(rack, "#6f675d", 0.55, 0.75),
    };
  }, [tex]);

  useDispose(parts.gSlab, parts.gRib, parts.gPlate, parts.gRack, parts.mSlab, parts.mRib, parts.mPlate, parts.mRack);

  const slabRef = useRef<THREE.InstancedMesh>(null);
  const ribRef = useRef<THREE.InstancedMesh>(null);
  const plateRef = useRef<THREE.InstancedMesh>(null);
  const rackRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    if (slabRef.current) writeMatrices(slabRef.current, solid.slabs);
    if (ribRef.current) writeMatrices(ribRef.current, solid.ribs);
    if (plateRef.current) writeMatrices(plateRef.current, solid.plates);
    if (rackRef.current) writeMatrices(rackRef.current, solid.racks);
  }, [solid]);

  return (
    <group>
      <instancedMesh ref={slabRef} args={[parts.gSlab, parts.mSlab, solid.slabs.length]} frustumCulled={false} />
      <instancedMesh ref={ribRef} args={[parts.gRib, parts.mRib, solid.ribs.length]} frustumCulled={false} />
      <instancedMesh ref={plateRef} args={[parts.gPlate, parts.mPlate, solid.plates.length]} frustumCulled={false} />
      <instancedMesh ref={rackRef} args={[parts.gRack, parts.mRack, solid.racks.length]} frustumCulled={false} />
    </group>
  );
}

function Lights({ u }: { u: StripUniforms }) {
  const data = useMemo(() => {
    const r = seeded(33);
    const strips: Inst[] = [];
    const glows: Inst[] = [];
    const leds: Inst[] = [];
    const AMBER: [number, number, number] = [1, 0.58, 0.22];
    const WARM: [number, number, number] = [1, 0.76, 0.45];
    const FLOOR: [number, number, number] = [0.6, 0.28, 0.1];

    for (let i = 0; i < N; i++) {
      const z = segZ(i);
      strips.push({ p: [0, H - 0.1, z], s: [6.0, 0.06, 0.1], tint: WARM, seed: r() * 10 });
      glows.push({ p: [0, H - 0.14, z], s: [7, 1.8, 1], rx: Math.PI / 2, tint: WARM, seed: r() * 10 });
      for (const side of [-1, 1]) {
        strips.push({ p: [side * 1.8, 0.012, z], s: [0.05, 0.02, SEG - 1.2], tint: FLOOR, seed: r() * 10 });
      }
      for (const side of [-1, 1]) {
        if (isBay(i)) {
          for (const dz of [-2.4, 0, 2.4]) {
            const cool = r() > 0.8;
            leds.push({
              p: [side * 3.88, 2.8, z + dz],
              s: [2.0, 5.2, 1],
              ry: -side * Math.PI / 2,
              tint: cool ? [0.85, 0.92, 1] : AMBER,
              seed: r() * 10,
            });
          }
        } else {
          PLATE_Y.forEach((y) => {
            const sy = y + STRIP_DY;
            const sd = r() * 10;
            strips.push({ p: [side * 4.62, sy, z], s: [0.05, 0.07, SEG - 1.3], tint: AMBER, seed: sd });
            glows.push({ p: [side * 4.56, sy, z], s: [SEG - 1.0, 1.5, 1], ry: side * -Math.PI / 2, tint: AMBER, seed: sd });
          });
        }
      }
    }
    return { strips, glows, leds };
  }, []);

  const parts = useMemo(
    () => ({
      gStrip: geoWithAttrs(new THREE.BoxGeometry(1, 1, 1), data.strips),
      gGlow: geoWithAttrs(new THREE.PlaneGeometry(1, 1), data.glows),
      gLed: geoWithAttrs(new THREE.PlaneGeometry(1, 1), data.leds),
      mStrip: stripMaterial(u),
      mGlow: glowMaterial(u),
      mLed: ledMaterial(u),
    }),
    [data, u]
  );
  useDispose(parts.gStrip, parts.gGlow, parts.gLed, parts.mStrip, parts.mGlow, parts.mLed);

  const sRef = useRef<THREE.InstancedMesh>(null);
  const gRef = useRef<THREE.InstancedMesh>(null);
  const lRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    if (sRef.current) writeMatrices(sRef.current, data.strips);
    if (gRef.current) writeMatrices(gRef.current, data.glows);
    if (lRef.current) writeMatrices(lRef.current, data.leds);
  }, [data]);

  return (
    <group>
      <instancedMesh ref={sRef} args={[parts.gStrip, parts.mStrip, data.strips.length]} frustumCulled={false} />
      <instancedMesh ref={lRef} args={[parts.gLed, parts.mLed, data.leds.length]} frustumCulled={false} />
      <instancedMesh ref={gRef} args={[parts.gGlow, parts.mGlow, data.glows.length]} frustumCulled={false} renderOrder={5} />
    </group>
  );
}

function Shell({ tex, reflector }: { tex: PanelTextures; reflector: boolean }) {
  const floorTex = useMemo(() => tiled(tex, 3, LEN / 6), [tex]);
  const ceilTex = useMemo(() => tiled(tex, 2, LEN / 8), [tex]);
  const zc = (startZ + TUNNEL_END_Z) / 2;

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, zc]}>
        <planeGeometry args={[HW * 2 + 1, LEN + 4]} />
        {reflector ? (
          <MeshReflectorMaterial
            map={floorTex.map}
            blur={[280, 80]}
            resolution={512}
            mixBlur={1.1}
            mixStrength={14}
            roughness={0.75}
            depthScale={0.9}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#4a4138"
            metalness={0.55}
            mirror={0}
          />
        ) : (
          <meshStandardMaterial map={floorTex.map} bumpMap={floorTex.bump} color="#241f1a" roughness={0.42} metalness={0.45} />
        )}
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[0, H, zc]}>
        <planeGeometry args={[HW * 2 + 1, LEN + 4]} />
        <meshStandardMaterial map={ceilTex.map} bumpMap={ceilTex.bump} color="#6f655a" roughness={0.6} metalness={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* Dark transition placeholder. Phase 2 builds Headquarters behind HQ_ENTRY. */
function Gate({ tex }: { tex: PanelTextures }) {
  const slit = useRef<THREE.MeshBasicMaterial>(null);
  const halo = useRef<THREE.MeshBasicMaterial>(null);
  const frame = useRef<THREE.MeshBasicMaterial>(null);
  const pillar = useMemo(() => tiled(tex, 1, 2), [tex]);

  const haloTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(255,190,110,1)");
    gr.addColorStop(0.35, "rgba(255,140,60,0.35)");
    gr.addColorStop(1, "rgba(255,120,40,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  useFrame(() => {
    const p = worldState.progress;
    const k = 0.3 + 0.7 * smoothstep(0.55, 0.96, p);
    slit.current?.color.setRGB(2.4 * k, 1.25 * k, 0.5 * k);
    frame.current?.color.setRGB(1.3 * k, 0.72 * k, 0.28 * k);
    if (halo.current) halo.current.opacity = 0.34 * k;
  });

  const z = HQ_ENTRY.z;
  const openW = HQ_ENTRY.width;
  const openH = HQ_ENTRY.height;
  const sideW = (HW * 2 + 1 - openW) / 2;

  return (
    <group position={[0, 0, z]}>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (openW / 2 + sideW / 2), H / 2, 0]}>
          <boxGeometry args={[sideW, H, 1.6]} />
          <meshStandardMaterial map={pillar.map} bumpMap={pillar.bump} color="#8f8171" roughness={0.5} metalness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, openH + (H - openH) / 2, 0]}>
        <boxGeometry args={[HW * 2 + 1, H - openH, 1.6]} />
        <meshStandardMaterial map={pillar.map} bumpMap={pillar.bump} color="#8f8171" roughness={0.5} metalness={0.8} />
      </mesh>

      <mesh position={[0, openH + 0.05, 0.82]}>
        <boxGeometry args={[openW, 0.06, 0.06]} />
        <meshBasicMaterial ref={frame} toneMapped={false} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (openW / 2), openH / 2, 0.82]}>
          <boxGeometry args={[0.06, openH, 0.06]} />
          <meshBasicMaterial color="#ffb060" toneMapped={false} />
        </mesh>
      ))}

      <mesh position={[0, openH / 2, -1.2]}>
        <planeGeometry args={[openW + 0.4, openH + 0.2]} />
        <meshBasicMaterial color="#020101" />
      </mesh>
      <mesh position={[0, 3.2, -1.1]}>
        <planeGeometry args={[0.09, 5.2]} />
        <meshBasicMaterial ref={slit} toneMapped={false} />
      </mesh>
      <mesh position={[0, 3.2, -1.0]} renderOrder={6}>
        <planeGeometry args={[3.2, 7.2]} />
        <meshBasicMaterial
          ref={halo}
          map={haloTex}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function driveStrips(u: StripUniforms, camZ: number, p: number, time: number) {
  u.uCamZ.value = camZ;
  u.uLead.value = 6 + 104 * smoothstep(0.0, 0.14, p);
  u.uMaster.value = 1 - 0.93 * smoothstep(0.84, 1.0, p);
  u.uTime.value = time;
}

export default function Tunnel({ tier }: { tier: Tier }) {
  const cfg = TIERS[tier];
  const tex = useMemo(() => makePanelTextures(), []);
  const u = useMemo(() => makeStripUniforms(), []);
  const key = useRef<THREE.PointLight>(null);
  const back = useRef<THREE.PointLight>(null);

  useDispose(tex.map, tex.bump);

  useFrame(({ clock, camera }) => {
    const p = worldState.progress;
    driveStrips(u, camera.position.z, p, clock.elapsedTime);

    const ign = smoothstep(0.0, 0.1, p);
    const endFade = 1 - 0.85 * smoothstep(0.86, 1.0, p);
    key.current?.position.set(camera.position.x, 3.4, camera.position.z - 5);
    back.current?.position.set(camera.position.x, 2.2, camera.position.z + 3);
    if (key.current) key.current.intensity = (10 + 46 * ign) * endFade;
    if (back.current) back.current.intensity = 5 * ign * endFade;
  });

  return (
    <group>
      <color attach="background" args={["#09080b"]} />
      <fog attach="fog" args={["#0a0806", 12, 105]} />

      <ambientLight intensity={0.05} color="#ffcf9a" />
      <pointLight ref={key} color="#ffb070" distance={46} decay={2} />
      <pointLight ref={back} color="#ff9650" distance={20} decay={2} />

      {cfg.env && (
        <Environment frames={1} resolution={128} environmentIntensity={0.32}>
          <color attach="background" args={["#030201"]} />
          <Lightformer form="rect" intensity={7} color="#ff9a45" position={[-6, 2.2, -4]} rotation-y={Math.PI / 2} scale={[26, 0.5, 1]} />
          <Lightformer form="rect" intensity={7} color="#ff9a45" position={[6, 2.2, -4]} rotation-y={-Math.PI / 2} scale={[26, 0.5, 1]} />
          <Lightformer form="rect" intensity={2.2} color="#ffb87a" position={[0, 6.4, -4]} rotation-x={Math.PI / 2} scale={[8, 26, 1]} />
          <Lightformer form="rect" intensity={3} color="#ffa860" position={[0, 3, -26]} scale={[7, 7, 1]} />
        </Environment>
      )}

      <Architecture tex={tex} />
      <Lights u={u} />
      <Shell tex={tex} reflector={cfg.reflector} />
      <Gate tex={tex} />
      <Dust count={cfg.dust} />
    </group>
  );
}