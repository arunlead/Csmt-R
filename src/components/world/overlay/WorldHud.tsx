"use client";

import { useEffect, useRef } from "react";
import { sceneRange, scenes } from "@/lib/world/scenes";
import { subscribeWorld, worldState } from "@/lib/world/worldState";
import SceneCopy from "./SceneCopy";

export default function WorldHud() {
  const bar = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let last = -1;
    const apply = () => {
      const p = worldState.progress;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      let idx = scenes.findIndex((s) => {
        const [a, b] = sceneRange(s.id);
        return p >= a && p <= b;
      });
      if (idx < 0) idx = 0;
      if (idx !== last && label.current) {
        last = idx;
        label.current.textContent = `${String(idx + 1).padStart(2, "0")} · ${scenes[idx].label.toUpperCase()}`;
      }
    };
    apply();
    return subscribeWorld(apply);
  }, []);

  return (
    <>
      <SceneCopy range={[0.05, 1.01]} fade={0.04} rise={10} className="absolute bottom-8 left-8 z-30 md:left-14">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#F2C27A]" />
          <span ref={label} className="tracking-[0.2em] text-white/70" />
        </div>
      </SceneCopy>

      <div className="absolute inset-x-0 bottom-0 z-30 h-[2px] bg-white/10">
        <div
          ref={bar}
          className="h-full origin-left scale-x-0 bg-gradient-to-r from-[#FFE0A3] to-[#E59A6B]"
        />
      </div>

      <SceneCopy range={[-1, 0.06]} fade={0.04} rise={0} className="absolute inset-x-0 bottom-10 z-30 flex justify-center font-mono text-xs text-white/50">
        <span className="animate-bounce">SCROLL</span>
      </SceneCopy>

      {process.env.NODE_ENV !== "production" && (
        <SceneCopy range={[0.93, 1.01]} fade={0.03} rise={8} className="absolute inset-x-0 top-28 z-30 flex justify-center font-mono text-[11px] tracking-[0.2em] text-[#F2C27A]/70">
          <span>▸ HEADQUARTERS CONNECTS HERE · PHASE 2 (dev note)</span>
        </SceneCopy>
      )}
    </>
  );
}