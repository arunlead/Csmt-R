"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { localToWorld } from "@/lib/world/scenes";
import { smoothstep, subscribeWorld, worldState } from "@/lib/world/worldState";

type Props = {
  scene?: string;
  range: [number, number];
  fade?: number;
  rise?: number;
  className?: string;
  children: ReactNode;
};

export default function SceneCopy({ scene, range, fade = 0.04, rise = 24, className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const a = scene ? localToWorld(scene, range[0]) : range[0];
    const b = scene ? localToWorld(scene, range[1]) : range[1];

    const apply = () => {
      const p = worldState.progress;
      const inn = smoothstep(a, a + fade, p);
      const out = 1 - smoothstep(b - fade, b, p);
      const o = Math.min(inn, out);
      el.style.opacity = String(o);
      el.style.transform = `translate3d(0, ${(1 - inn) * rise - (1 - out) * rise * 0.5}px, 0)`;
      el.style.visibility = o < 0.01 ? "hidden" : "visible";
      el.inert = o < 0.05;
    };
    apply();
    return subscribeWorld(apply);
  }, [scene, range, fade, rise]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0, visibility: "hidden" }}>
      {children}
    </div>
  );
}