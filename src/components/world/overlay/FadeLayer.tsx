"use client";

import { useEffect, useRef } from "react";
import { smoothstep, subscribeWorld, worldState } from "@/lib/world/worldState";

export default function FadeLayer() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () => {
      el.style.opacity = String(1 - smoothstep(0, 0.07, worldState.progress));
    };
    apply();
    return subscribeWorld(apply);
  }, []);
  return <div ref={ref} className="pointer-events-none absolute inset-0 z-20 bg-[#09080b]" />;
}