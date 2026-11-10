"use client";

import { ToneMappingMode } from "postprocessing";
import { Bloom, EffectComposer, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import type { Tier } from "@/lib/world/quality";

export default function PostFX({ tier }: { tier: Tier }) {
  if (tier === "low") return null;

  const effects = [
    <Bloom
      key="bloom"
      intensity={tier === "high" ? 1.15 : 0.85}
      luminanceThreshold={0.72}
      luminanceSmoothing={0.25}
      mipmapBlur
      radius={0.78}
    />,
    <Vignette key="vig" offset={0.22} darkness={0.82} />,
  ];
  effects.push(<ToneMapping key="tm" mode={ToneMappingMode.ACES_FILMIC} />);
  if (tier === "medium") effects.push(<SMAA key="smaa" />);

  return (
    <EffectComposer multisampling={tier === "high" ? 4 : 0} enableNormalPass={false}>
      {effects}
    </EffectComposer>
  );
}