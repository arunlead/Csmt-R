"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { pillars } from "@/data/content";
import { worldState } from "@/lib/worldState";
import { sceneAt, smooth } from "@/lib/scenes";

/* when each card is on screen, as 0 to 1 progress inside the headquarters scene:
   [fade in from, fade in to, fade out from, fade out to] */
const WINDOWS: [number, number, number, number][] = [
  [0.08, 0.15, 0.28, 0.34],
  [0.34, 0.41, 0.54, 0.6],
  [0.6, 0.67, 0.78, 0.84],
];

/* desktop position of each card */
const SIDE = ["md:left-16", "md:right-16", "md:left-16"];

export default function HeadquartersCards() {
  const label = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const tick = () => {
      const { local } = sceneAt(1, worldState.progress);

      if (label.current) {
        label.current.style.opacity = String(
          smooth(0.04, 0.12, local) * (1 -smooth(0.78, 0.86, local))
        );
      }

      WINDOWS.forEach(([a, b, c, d], i) => {
        const el = cards.current[i];
        if (!el) return;
        const inn = smooth(a, b, local);
        const out = smooth(c, d, local);
        el.style.opacity = String(inn * (1 - out));
        el.style.transform = `translateY(${(1 - inn) * 28 - out * 20}px)`;
      });
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <>
      <div
        ref={label}
        className="pointer-events-none absolute left-8 top-28 font-mono text-xs uppercase tracking-[0.3em] text-[#F2C27A] opacity-0 md:left-24"
      >
        03 // What we do
      </div>

      {pillars.map((p, i) => (
        <div
          key={p.id}
          className={`pointer-events-none absolute inset-x-5 bottom-10 md:inset-x-auto md:bottom-auto md:top-1/2 md:w-[400px] md:-translate-y-1/2 ${SIDE[i]}`}
        >
          <div
            ref={(el) => {
              cards.current[i] = el;
            }}
            className="rounded-2xl border border-white/10 bg-black/60 md:bg-black/60 md:bg-black/60 md:bg-black/60 md:bg-black/60 md:bg-black/60 md:bg-black/60 md:bg-black/60 md:bg-black/60 md:bg-black/60 md:bg-black/35 p-6 opacity-0 shadow-[0_0_80px_-30px_rgba(242,194,122,0.55)] backdrop-blur-xl md:p-8"
          >
            <p className="font-mono text-xs text-[#F2C27A]/80">{p.file}</p>
            <h3 className="mt-3 font-[family-name:var(--font-unbounded)] text-2xl font-black leading-tight text-white md:text-3xl">
              {p.title}
            </h3>
            <p className="mt-3 text-white/70">{p.text}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {p.items.map((it) => (
                <li
                  key={it}
                  className="rounded-md border border-[#F2C27A]/30 bg-[#F2C27A]/5 px-3 py-1.5 font-mono text-xs text-[#F2C27A]"
                >
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </>
  );
}