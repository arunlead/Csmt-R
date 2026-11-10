export type SceneDef = {
  id: string;
  anchor: string;
  label: string;
  scrollVh: number;
};

export const scenes: SceneDef[] = [
  { id: "tunnel", anchor: "tunnel", label: "Digital Tunnel", scrollVh: 350 },
];

export const TOTAL_SCROLL_VH = scenes.reduce((a, s) => a + s.scrollVh, 0);
export const WORLD_HEIGHT_DESKTOP_VH = TOTAL_SCROLL_VH + 100;
export const WORLD_HEIGHT_FALLBACK_VH = 230;

export function sceneStartVh(id: string) {
  let acc = 0;
  for (const s of scenes) {
    if (s.id === id) return acc;
    acc += s.scrollVh;
  }
  return 0;
}

export function sceneRange(id: string): [number, number] {
  const start = sceneStartVh(id) / TOTAL_SCROLL_VH;
  const s = scenes.find((x) => x.id === id);
  return [start, start + (s ? s.scrollVh : 0) / TOTAL_SCROLL_VH];
}

export function localToWorld(id: string, local: number) {
  const [a, b] = sceneRange(id);
  return a + (b - a) * local;
}

export const TUNNEL = {
  halfWidth: 5,
  height: 7.2,
  seg: 8,
  count: 22,
  startZ: 12,
} as const;

export const TUNNEL_END_Z = TUNNEL.startZ - TUNNEL.seg * TUNNEL.count; // -164

/* Doorway at the end of the tunnel. Phase 2 builds Headquarters behind it. */
export const HQ_ENTRY = {
  z: TUNNEL_END_Z,
  width: 7.2,
  height: 6.2,
} as const;

export type CamKey = {
  id?: string;
  p: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
  roll: number;
};

export const cameraKeys: CamKey[] = [
  { p: 0.0, pos: [0, 1.75, 9], look: [0, 1.9, -30], fov: 64, roll: 0 },
  { p: 0.08, pos: [0, 1.8, 3], look: [0, 2.0, -40], fov: 62, roll: 0 },
  { p: 0.25, pos: [0.3, 1.85, -32], look: [-0.2, 2.1, -80], fov: 60, roll: 0.008 },
  { p: 0.5, pos: [-0.3, 1.9, -82], look: [0.2, 2.1, -130], fov: 59, roll: -0.008 },
  { p: 0.75, pos: [0.25, 1.9, -128], look: [0, 2.2, -170], fov: 58, roll: 0.006 },
  { p: 0.9, pos: [0, 1.85, -151], look: [0, 2.3, -175], fov: 56, roll: 0 },
  { id: "tunnel-end", p: 1.0, pos: [0, 1.8, -157], look: [0, 2.4, -178], fov: 54, roll: 0 },
];