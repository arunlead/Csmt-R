import * as THREE from "three";

export type StripUniforms = {
  uCamZ: { value: number };
  uLead: { value: number };
  uMaster: { value: number };
  uTime: { value: number };
};

export const makeStripUniforms = (): StripUniforms => ({
  uCamZ: { value: 9 },
  uLead: { value: 6 },
  uMaster: { value: 1 },
  uTime: { value: 0 },
});

const VERT = /* glsl */ `
  attribute vec3 aTint;
  attribute float aSeed;
  uniform float uCamZ;
  uniform float uLead;
  uniform float uMaster;
  uniform float uTime;
  varying float vLit;
  varying vec3 vTint;
  varying float vDepth;
  varying vec2 vUv;

  void main() {
    mat4 im = modelMatrix * instanceMatrix;
    float oz = (im * vec4(0.0, 0.0, 0.0, 1.0)).z;
    float ahead = uCamZ - oz;
    float lit = 1.0 - smoothstep(uLead * 0.62, uLead, ahead);
    float front = smoothstep(0.0, 1.0, 1.0 - abs(ahead - uLead * 0.8) / (uLead * 0.25 + 1.0));
    float flick = 0.78 + 0.22 * step(0.45, fract(sin(aSeed * 91.7 + floor(uTime * 14.0)) * 437.58));
    lit *= mix(1.0, flick, front);
    vLit = lit * uMaster;
    vTint = aTint;
    vUv = uv;
    vec4 mv = viewMatrix * im * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG_STRIP = /* glsl */ `
  varying float vLit;
  varying vec3 vTint;
  varying float vDepth;
  void main() {
    float fog = smoothstep(25.0, 130.0, vDepth);
    vec3 c = vTint * (0.10 + 2.6 * vLit);
    c *= mix(1.0, 0.4, fog);
    gl_FragColor = vec4(c, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const FRAG_GLOW = /* glsl */ `
  varying float vLit;
  varying vec3 vTint;
  varying float vDepth;
  varying vec2 vUv;
  void main() {
    float d = abs(vUv.y - 0.5) * 2.0;
    float across = exp(-d * d * 4.5);
    float along = smoothstep(0.0, 0.14, vUv.x) * smoothstep(1.0, 0.86, vUv.x);
    float fog = smoothstep(25.0, 130.0, vDepth);
    float a = across * along * vLit * 0.34 * mix(1.0, 0.3, fog);
    gl_FragColor = vec4(vTint * a * 2.0, a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const FRAG_LED = /* glsl */ `
  uniform float uTime;
  varying float vLit;
  varying vec3 vTint;
  varying float vDepth;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec2 g = vec2(9.0, 56.0);
    vec2 cell = floor(vUv * g);
    vec2 f = fract(vUv * g);
    float dotM = smoothstep(0.42, 0.16, length(f - 0.5));
    float h = hash(cell);
    float blink = step(0.7, h) * (0.35 + 0.65 * step(0.5, fract(h * 9.0 + uTime * (0.4 + h))));
    float unitLine = smoothstep(0.03, 0.0, abs(f.y - 0.04)) * 0.18;
    float edge = step(vUv.x, 0.03) + step(0.97, vUv.x);
    vec3 warm = mix(vTint, vec3(0.75, 0.9, 1.0), step(0.93, h));
    float power = max(0.28, vLit);
    vec3 c = vec3(0.012, 0.011, 0.01);
    c += warm * (dotM * blink * 1.25 + unitLine) * power;
    c += vTint * edge * 2.6 * power;
    float fog = smoothstep(25.0, 130.0, vDepth);
    c *= mix(1.0, 0.4, fog);
    gl_FragColor = vec4(c, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function make(frag: string, u: StripUniforms, glow = false) {
  return new THREE.ShaderMaterial({
    uniforms: u as unknown as { [k: string]: THREE.IUniform },
    vertexShader: VERT,
    fragmentShader: frag,
    transparent: glow,
    depthWrite: !glow,
    blending: glow ? THREE.AdditiveBlending : THREE.NormalBlending,
    side: glow ? THREE.DoubleSide : THREE.FrontSide,
  });
}

export const stripMaterial = (u: StripUniforms) => make(FRAG_STRIP, u);
export const glowMaterial = (u: StripUniforms) => make(FRAG_GLOW, u, true);
export const ledMaterial = (u: StripUniforms) => make(FRAG_LED, u);