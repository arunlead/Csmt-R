"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { worldState } from "@/lib/worldState";
import { sceneAt, smooth } from "@/lib/scenes";

export default function TunnelCopy() {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () => {
      const el = box.current;
      if (!el) return;
      const { local } = sceneAt(0, worldState.progress);
      const inn = smooth(0.08, 0.22, local);
      el.style.opacity = String(inn * (1 - smooth(0.6, 0.8, local)));
      el.style.transform = `translateY(${(1 - inn) * 24}px)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <div
      ref={box}
      className="pointer-events-none absolute inset-x-0 top-[22vh] px-8 opacity-0 [text-shadow:0_2px_28px_rgba(0,0,0,0.85)] md:px-24"
    >
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#F2C27A]">
        02 // The tunnel
      </p>
      <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-unbounded)] text-4xl font-black leading-tight text-white md:text-6xl">
        Step inside
        <br />
        the network.
      </h2>
      <p className="mt-5 max-w-md text-lg text-white/65">
        Every system has a way in. We teach you to find it, and to close it.
      </p>
    </div>
  );
}