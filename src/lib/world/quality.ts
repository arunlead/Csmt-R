export type Mode = "pending" | "webgl" | "fallback";
export type Tier = "high" | "medium" | "low";

export const TIERS: Record<
  Tier,
  { dpr: [number, number]; post: boolean; reflector: boolean; dust: number; env: boolean }
> = {
  high: { dpr: [1, 1.5], post: true, reflector: true, dust: 1100, env: true },
  medium: { dpr: [1, 1.25], post: true, reflector: false, dust: 600, env: true },
  low: { dpr: [0.75, 1], post: false, reflector: false, dust: 260, env: false },
};

type Nav = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

let cached: Mode | null = null;

function hasWebGL2() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/* Dev override: ?world=webgl | ?world=fallback */
export function detectMode(): Mode {
  if (typeof window === "undefined") return "pending";
  if (cached) return cached;

  const q = new URLSearchParams(window.location.search).get("world");
  if (q === "webgl" || q === "fallback") return (cached = q);

  const n = navigator as Nav;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 1024;
  const saver = n.connection?.saveData === true;
  const lowMem = typeof n.deviceMemory === "number" && n.deviceMemory <= 2;

  cached = reduce || coarse || narrow || saver || lowMem || !hasWebGL2() ? "fallback" : "webgl";
  return cached;
}

export function initialTier(): Tier {
  const q = new URLSearchParams(window.location.search).get("tier");
  if (q === "high" || q === "medium" || q === "low") return q;
  const n = navigator as Nav;
  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = n.deviceMemory ?? 8;
  return cores >= 8 && mem >= 8 ? "high" : "medium";
}

export const stepDown = (t: Tier): Tier => (t === "high" ? "medium" : "low");
export const stepUp = (t: Tier): Tier => (t === "low" ? "medium" : "high");

export function tierLocked() {
  const q = new URLSearchParams(window.location.search).get("tier");
  return q === "high" || q === "medium" || q === "low";
}