/* The list of 3D scenes, in scroll order.
   vh = how many screen heights of scrolling the scene takes.
   base / wall = how much the picture and the side walls grow while you fly (from, to). */

export type SceneDef = {
  id: string;
  vh: number;
  src: string;
  sm: string;
  base: [number, number];
  wall: [number, number] | null;
  shimmer: number;
    /* optional soft glow on one spot of the picture (x, y from the top-left, 0 to 1) */
  focus?: { x: number; y: number; r: number; gain: number };
};

export const SCENES: SceneDef[] = [
  {
    id: "tunnel",
    vh: 260,
    src: "/assets/scenes/02-tunnel.webp",
    sm: "/assets/scenes/02-tunnel-sm.webp",
    base: [1, 1.9],
    wall: [1, 3.4],
    shimmer: 0,
  },
  {
    id: "headquarters",
    vh: 360,
    src: "/assets/scenes/03-headquarters.webp",
    sm: "/assets/scenes/03-headquarters-sm.webp",
    base: [1, 1.3],
    wall: [1, 2.0],
    shimmer: 0.25,
  },
    {
    id: "about",
    vh: 300,
    src: "/assets/scenes/04-about.webp",
    sm: "/assets/scenes/04-about-sm.webp",
    base: [1, 1.3],
    wall: [1, 2.0],
    shimmer: 0.2,
    focus: { x: 0.5, y: 0.34, r: 0.14, gain: 0.36 },
  },
];

/* width of a crossfade, as a share of the whole scroll */
export const FADE = 0.05;

export const TOTAL_VH = SCENES.reduce((sum, s) => sum + s.vh, 0);

/* where each scene starts, 0 to 1 across the whole world */
const STARTS: number[] = [];
{
  let acc = 0;
  for (const s of SCENES) {
    STARTS.push(acc / TOTAL_VH);
    acc += s.vh;
  }
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/* For scene i at world progress g:
   opacity = how visible it is (new scenes fade in over the old one, no dark dip)
   local   = 0 to 1 progress inside the scene, used for zoom and text
   covered = the next scene is fully on top, so this one can be skipped */
export function sceneAt(i: number, g: number) {
  const last = SCENES.length - 1;
  const start = STARTS[i];
  const end = i < last ? STARTS[i + 1] : 1;
  const a = i === 0 ? 0 : start - FADE / 2;
  const b = i < last ? end + FADE / 2 : 1;
  const local = clamp((g - a) / (b - a));
  const opacity = i === 0 ? 1 : smooth(start - FADE / 2, start + FADE / 2, g);
  const covered = i < last && g >= STARTS[i + 1] + FADE / 2;
  return { opacity, local, covered };
}