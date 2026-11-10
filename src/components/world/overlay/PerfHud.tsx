"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};
const wanted = () => new URLSearchParams(window.location.search).has("perf");

export default function PerfHud() {
  const on = useSyncExternalStore(noop, wanted, () => false);
  if (!on) return null;
  return (
    <pre
      id="world-perf"
      className="pointer-events-none absolute right-4 top-24 z-40 rounded bg-black/70 px-3 py-1.5 font-mono text-[11px] text-[#F2C27A]"
    />
  );
}