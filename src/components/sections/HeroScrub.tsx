"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brand } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

/* Space reserved for the fixed navbar (top-3 + h-14 + breathing room).
   The video lives BELOW this line, so the hacker's head never hides behind the menu. */
const NAV = "96px";

export default function HeroScrub() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const copyIn = useRef<HTMLDivElement>(null);
  const copyOut = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const status = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const v = video.current;
    const section = root.current;
    if (!v || !section) return;

    let ctx: gsap.Context | undefined;

    const setup = () => {
      const duration = v.duration;
      if (!Number.isFinite(duration)) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        v.currentTime = duration * 0.9;
        return;
      }

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=250%",
            pin: true,
            scrub: 0.4,
            anticipatePin: 1,
            onUpdate: (self) => {
              const p = self.progress;
              if (pct.current) pct.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
              if (bar.current) bar.current.style.transform = `scaleY(${p})`;
              if (status.current) status.current.textContent = p > 0.5 ? "EYE CONTACT" : "TYPING";
            },
          },
        });

        tl.fromTo(v, { currentTime: 0 }, { currentTime: duration, ease: "none", duration: 1 }, 0)
          .to(copyIn.current, { opacity: 0, y: -40, duration: 0.25 }, 0.15)
          .fromTo(copyOut.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.25 }, 0.7);
      }, section);
    };

    if (v.readyState >= 1) setup();
    else v.addEventListener("loadedmetadata", setup, { once: true });

    return () => {
      v.removeEventListener("loadedmetadata", setup);
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative isolate h-[100svh] w-full overflow-hidden bg-[#09080b] [background-image:radial-gradient(ellipse_70%_75%_at_72%_42%,#2a2013_0%,#14110f_48%,#09080b_100%)]"
    >
      {/* VIDEO: starts under the navbar, turned monochrome so it can take one premium tint.
          "screen" blending drops its dark background into the page, so there are no visible edges. */}
      <div
        className="absolute inset-x-0 bottom-0 mix-blend-screen"
        style={{
          top: NAV,
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, #000 34%, #000 94%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 20%, #000 80%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, #000 34%, #000 94%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 20%, #000 80%, transparent 100%)",
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
        }}
      >
        <video
          ref={video}
          src="/assets/hero.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          style={{ filter: "grayscale(1) contrast(1.35) brightness(1.45)" }}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[58%_top] md:inset-auto md:right-0 md:top-0 md:h-full md:w-auto md:max-w-none"
        />
      </div>

      {/* ONE colour grade over the whole hero (left and right match): champagne gold into bronze */}
      <div className="pointer-events-none absolute inset-0 opacity-90 mix-blend-color [background:linear-gradient(135deg,#F6CF84_0%,#E2A765_50%,#B9774A_100%)]" />
      {/* soft golden light behind the head and on the keyboard */}
      <div className="pointer-events-none absolute inset-0 mix-blend-screen [background:radial-gradient(circle_at_70%_30%,rgba(255,214,150,0.16),transparent_45%),radial-gradient(circle_at_72%_96%,rgba(255,170,100,0.22),transparent_40%)]" />

      {/* text and bottom shading, same warm black as the page */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#09080b]/70 via-transparent to-transparent md:w-1/2" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#09080b] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#09080b] to-transparent" />

      {/* progress rail (starts below the navbar) */}
      <div className="absolute bottom-24 left-8 hidden w-px bg-white/15 md:left-14 md:block" style={{ top: "128px" }}>
        <div ref={bar} className="h-full w-px origin-top scale-y-0 bg-gradient-to-b from-[#FFE0A3] to-[#E59A6B]" />
        <span className="absolute -left-1 top-full mt-3 font-mono text-xs text-[#F2C27A]">
          <span ref={pct}>000</span>%
        </span>
      </div>

      {/* status, bottom right */}
      <div className="absolute bottom-8 right-8 hidden items-center gap-2 font-mono text-xs sm:flex md:right-14">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#F2C27A]" />
        <span className="text-white/50">STATUS</span>
        <span ref={status} className="text-white">TYPING</span>
      </div>

      {/* copy: intro */}
      <div ref={copyIn} className="absolute inset-0 flex items-center px-8 pt-16 md:px-24">
        <div className="max-w-xl">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-[#F2C27A]">Secure channel · Online</p>
          <h1 className="font-[family-name:var(--font-unbounded)] text-6xl font-black leading-none text-white md:text-8xl">
            {brand.name}
          </h1>
          <p className="mt-4 font-mono text-sm text-[#F2C27A] md:text-base">{brand.full}</p>
          <p className="mt-6 max-w-md text-lg text-white/70">{brand.tagline}</p>
        </div>
      </div>

      {/* copy: outro */}
      <div ref={copyOut} className="absolute inset-0 flex items-end px-8 pb-28 opacity-0 md:px-24">
        <p className="max-w-2xl font-[family-name:var(--font-unbounded)] text-3xl font-bold leading-tight text-white md:text-5xl">
          Threats look back.
          <br />
          <span className="bg-gradient-to-r from-[#FFE6B0] to-[#E59A6B] bg-clip-text text-transparent">We look first.</span>
        </p>
      </div>

      {/* scroll hint */}
      <div className="absolute inset-x-0 bottom-8 flex justify-center font-mono text-xs text-white/50">
        <span className="animate-bounce">SCROLL TO ACCESS</span>
      </div>
    </section>
  );
}