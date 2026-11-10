"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { worldState } from "@/lib/worldState";
import { sceneAt, smooth, type SceneDef } from "@/lib/scenes";

const ASPECT = 2752 / 1536;
const DEPTH = 40;

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/* uPulse   : the bright lights breathe
   uShimmer : a slow ripple runs through the bright glowing parts
   uWall    : 1 keeps only the left and right walls, so they can rush past faster
   uOpacity : used for the crossfade between scenes
   uFocus   : x, y, radius of an optional glow (the hologram); uGain is how strong it is */
const frag = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uPulse;
  uniform float uShimmer;
  uniform float uTime;
  uniform float uWall;
  uniform float uOpacity;
  uniform vec3 uFocus;
  uniform float uGain;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D(uMap, vUv);
    float lum = dot(c.rgb, vec3(0.299, 0.587, 0.114));
    float glow = smoothstep(0.25, 0.8, lum);
    float ripple = 0.5 + 0.5 * sin(uTime * 2.2 + vUv.x * 36.0 + vUv.y * 14.0);
    c.rgb += c.rgb * glow * (uPulse + uShimmer * ripple);
    vec2 d = (vUv - vec2(uFocus.x, 1.0 - uFocus.y)) * vec2(1.7778, 1.0);
    float halo = exp(-dot(d, d) / (uFocus.z * uFocus.z));
    c.rgb += vec3(1.0, 0.74, 0.42) * halo * uGain;
    float wall = max(1.0 - smoothstep(0.14, 0.30, vUv.x), smoothstep(0.70, 0.86, vUv.x));
    float a = mix(1.0, wall, uWall) * uOpacity;
    gl_FragColor = vec4(c.rgb, a);
    #include <colorspace_fragment>
  }
`;

function Plate({
  tex,
  index,
  wall,
  zoom,
  shimmer,
  focus,
}: {
  tex: THREE.Texture;
  index: number;
  wall: boolean;
  zoom: [number, number];
  shimmer: number;
  focus?: SceneDef["focus"];
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uMap: { value: tex },
      uPulse: { value: 0.3 },
      uShimmer: { value: shimmer },
      uTime: { value: 0 },
      uWall: { value: wall ? 1 : 0 },
      uOpacity: { value: 1 },
      uFocus: { value: new THREE.Vector3(focus?.x ?? 0.5, focus?.y ?? 0.5, focus?.r ?? 0.1) },
      uGain: { value: 0 },
    }),
    [tex, wall, shimmer, focus]
  );

  useFrame((state) => {
    const m = mesh.current;
    const material = mat.current;
    if (!m || !material) return;

    const { opacity, local, covered } = sceneAt(index, worldState.progress);
    m.visible = opacity > 0.001 && !covered;
    if (!m.visible) return;

    // size the picture so it always covers the screen
    const v = state.viewport.getCurrentViewport(state.camera, [0, 0, -DEPTH]);
    let w = v.height * ASPECT;
    let h = v.height;
    if (w < v.width) {
      w = v.width;
      h = w / ASPECT;
    }

    // flying forward = the picture grows
    const s = zoom[0] * Math.pow(zoom[1] / zoom[0], local) * 1.05;
    m.scale.set(w * s, h * s, 1);

    const speed = Math.min(Math.abs(worldState.velocity) * 1.2, 0.5);
    const t = state.clock.elapsedTime;
    material.uniforms.uPulse.value = 0.28 + 0.14 * Math.sin(t * 1.6) + speed;
    material.uniforms.uTime.value = t;
    material.uniforms.uOpacity.value = opacity;

    // the hologram "switches on" early in the scene, then breathes
    if (focus) {
      const ignite = 0.35 + 0.65 * smooth(0.04, 0.3, local);
      material.uniforms.uGain.value = focus.gain * ignite * (0.88 + 0.12 * Math.sin(t * 2.1));
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0, -DEPTH]} renderOrder={index * 10 + (wall ? 1 : 0)}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vert}
        fragmentShader={frag}
        transparent
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/* runs once when the picture has loaded */
function prepare(t: THREE.Texture) {
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
}

export default function ImageScene({ index, def }: { index: number; def: SceneDef }) {
  const tex = useTexture(def.src, prepare);

  return (
    <>
      <Plate
        tex={tex}
        index={index}
        wall={false}
        zoom={def.base}
        shimmer={def.shimmer}
        focus={def.focus}
      />
      {def.wall && (
        <Plate tex={tex} index={index} wall zoom={def.wall} shimmer={def.shimmer} />
      )}
    </>
  );
}