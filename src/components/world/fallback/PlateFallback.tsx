"use client";

import { useEffect, useRef } from "react";
import { subscribeWorld, worldState } from "@/lib/world/worldState";

const CSS = `
.wf-root{--wp:0;position:absolute;inset:0;overflow:hidden;background:#09080b;contain:paint}
.wf-plate{position:absolute;inset:-4%;will-change:transform;transform-origin:50% 46%;
  transform:translate3d(0,calc(var(--wp) * -4%),0) scale(calc(1.06 + var(--wp) * 0.24))}
.wf-img{width:100%;height:100%;object-fit:cover;display:block}
@supports (scale:1){.wf-img{animation:wf-breathe 18s ease-in-out infinite alternate}}
@keyframes wf-breathe{from{scale:1}to{scale:1.035}}
.wf-glow{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse 38% 34% at 50% 52%,rgba(255,170,90,.30),transparent 70%);
  animation:wf-pulse 5.5s ease-in-out infinite}
@keyframes wf-pulse{0%,100%{opacity:.35}50%{opacity:.9}}
@supports (mix-blend-mode:screen){
 .wf-sweep{position:absolute;inset:0;pointer-events:none;mix-blend-mode:screen;
  background:linear-gradient(100deg,transparent 42%,rgba(255,190,110,.14) 50%,transparent 58%);
  background-size:260% 100%;animation:wf-sweep 10s linear infinite}
}
@keyframes wf-sweep{from{background-position:140% 0}to{background-position:-40% 0}}
.wf-dust{position:absolute;inset:-10% 0;pointer-events:none;opacity:.8;
  background-image:radial-gradient(circle,rgba(255,205,150,.9) 0 1px,transparent 1.6px),
   radial-gradient(circle,rgba(255,190,120,.7) 0 1.2px,transparent 2px);
  background-size:130px 150px,230px 210px;background-position:0 0,60px 40px;
  transform:translate3d(0,calc(var(--wp) * -26%),0);animation:wf-dust 28s linear infinite}
.wf-dust.far{opacity:.45;background-size:90px 110px,170px 150px;
  transform:translate3d(0,calc(var(--wp) * -10%),0);animation-duration:46s}
@keyframes wf-dust{from{background-position:0 0,60px 40px}to{background-position:0 -300px,60px -420px}}
.wf-vignette{position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse at 50% 50%,transparent 42%,rgba(9,8,11,.9) 100%),
  radial-gradient(ellipse 30% 22% at 92% 90%,rgba(9,8,11,.95),transparent 100%)}
`;

export default function PlateFallback() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const apply = () => el.style.setProperty("--wp", worldState.progress.toFixed(4));
    apply();
    return subscribeWorld(apply);
  }, []);

  return (
    <div ref={root} className="wf-root" aria-hidden="true">
      <style>{CSS}</style>
      <div className="wf-plate">
        <picture>
          <source media="(min-width: 768px)" srcSet="/assets/scenes/02-tunnel.webp" />
          <img className="wf-img" src="/assets/scenes/02-tunnel-sm.webp" alt="" decoding="async" />
        </picture>
      </div>
      <div className="wf-glow" />
      <div className="wf-sweep" />
      <div className="wf-dust far" />
      <div className="wf-dust" />
      <div className="wf-vignette" />
    </div>
  );
}