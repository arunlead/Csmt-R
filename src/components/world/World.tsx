"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { worldState } from "@/lib/worldState";
import { SCENES, TOTAL_VH, clamp, sceneAt, smooth } from "@/lib/scenes";
import TunnelCopy from "./overlay/TunnelCopy";
import HeadquartersCards from "./overlay/HeadquartersCards";
import AboutCards from "./overlay/AboutCards";

const WorldCanvas = dynamic(() => import("./WorldCanvas"), { ssr: false });

function useMedia(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

function useInView(
  ref: React.RefObject<HTMLElement | null>,
  margin: string,
  once: boolean
) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setOn((prev) => (once ? prev || e.isIntersecting : e.isIntersecting)),
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin, once]);
  return on;
}

export default function World() {
  const root = useRef<HTMLElement>(null);
  const stills = useRef<(HTMLDivElement | null)[]>([]);
  const topFade = useRef<HTMLDivElement>(null);
  const endFade = useRef<HTMLDivElement>(null);

  const desktop = useMedia("(min-width: 768px)");
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  const useGL = desktop && !reduce;

  const mounted = useInView(root, "150% 0px", true); // start loading early
  const visible = useInView(root, "0px", false); // only draw while on screen

  /* one loop: read the scroll position, share it, move the HTML layers */
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    let last = performance.now();

    const tick = () => {
      // real elapsed time, so the smoothing is the same on slow and fast machines
      const now = performance.now();
      const dt = Math.min(Math.max((now - last) / 1000, 0.001), 0.25);
      last = now;

      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -vh || r.top > vh * 2) return;

      const total = r.height - vh;
      const raw = total > 0 ? clamp(-r.top / total) : 0;
      const prev = worldState.progress;
      const p = prev + (raw - prev) * (1 - Math.exp(-7 * dt));
      worldState.progress = p;
      worldState.velocity = (p - prev) / dt;

      if (topFade.current) topFade.current.style.opacity = String(1 - smooth(0, 0.05, p));
      if (endFade.current) endFade.current.style.opacity = String(smooth(0.94, 1, p));

      // phones and reduced motion: plain pictures that fade and zoom slowly
      SCENES.forEach((_, i) => {
        const still = stills.current[i];
        if (!still) return;
        const s = sceneAt(i, p);
        still.style.opacity = String(s.opacity);
        still.style.visibility = s.covered ? "hidden" : "visible";
        still.style.transform = `scale(${1 + s.local * 0.45})`;
      });
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <section
      ref={root}
      id="world"
      aria-label="CSMT network"
      className="relative bg-[#09080b]"
      style={{ height: `calc(100svh + ${TOTAL_VH}vh)` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {useGL ? (
          mounted ? <WorldCanvas active={visible} /> : null
        ) : (
          SCENES.map((s, i) => (
            <div
              key={s.id}
              ref={(el) => {
                stills.current[i] = el;
              }}
              className="absolute inset-0 bg-cover bg-center will-change-transform"
              style={{
                backgroundImage: `url(${desktop ? s.src : s.sm})`,
                opacity: i === 0 ? 1 : 0,
              }}
            />
          ))
        )}

        {/* shading, film grain and the soft join with the hero */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(9,8,11,0.8)_100%)]" />
        <div className="grain" />
        <div
          ref={topFade}
          className="pointer-events-none absolute inset-x-0 top-0 h-[30vh] bg-gradient-to-b from-[#09080b] to-transparent"
        />

        {/* text for each scene */}
        <TunnelCopy />
        <HeadquartersCards />
<AboutCards />
        <div
          ref={endFade}
          className="pointer-events-none absolute inset-0 bg-[#09080b] opacity-0"
        />
      </div>
    </section>
  );
}