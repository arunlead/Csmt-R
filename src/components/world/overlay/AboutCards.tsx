"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { about } from "@/data/content";
import { worldState } from "@/lib/worldState";
import { sceneAt, smooth } from "@/lib/scenes";

/* when each card is on screen, as 0 to 1 progress inside the about scene:
   [fade in from, fade in to, fade out from, fade out to] */
const WINDOWS: [number, number, number, number][] = [
  [0.14, 0.22, 0.46, 0.54],
  [0.54, 0.62, 0.98, 1.0],
];

const CARDS = [
  { kicker: "who we are", title: "A group that builds, tests and teaches.", body: about.who },
  { kicker: "our mission", title: "Secure technology, for everyone.", body: about.mission },
];

const SIDE = ["md:left-16", "md:right-16"];

export default function AboutCards() {
  const label = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const tick = () => {
      const { local } = sceneAt(2, worldState.progress);

      if (label.current) {
        label.current.style.opacity = String(smooth(0.06, 0.14, local));
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
        04 // About us
      </div>

      {CARDS.map((c, i) => (
        <div
          key={c.kicker}
          className={`pointer-events-none absolute inset-x-5 bottom-10 md:inset-x-auto md:bottom-auto md:top-1/2 md:w-[380px] md:-translate-y-1/2 ${SIDE[i]}`}
        >
          <div
            ref={(el) => {
              cards.current[i] = el;
            }}
            className="rounded-2xl border border-white/10 bg-black/35 p-6 opacity-0 shadow-[0_0_80px_-30px_rgba(242,194,122,0.55)] backdrop-blur-xl md:p-8"
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#F2C27A]/80">
              {c.kicker}
            </p>
            <h3 className="mt-3 font-[family-name:var(--font-unbounded)] text-2xl font-black leading-tight text-white md:text-3xl">
              {c.title}
            </h3>
            <p className="mt-4 text-white/70">{c.body}</p>
            {i === 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {about.chips.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-md border border-[#F2C27A]/30 bg-[#F2C27A]/5 px-3 py-1.5 font-mono text-xs text-[#F2C27A]"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </>
  );
}