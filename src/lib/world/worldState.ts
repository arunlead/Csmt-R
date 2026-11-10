"use client";

import { useSyncExternalStore } from "react";

export type WorldState = {
  progress: number;
  inView: boolean;
};

export const worldState: WorldState = {
  progress: 0,
  inView: false,
};

const listeners = new Set<() => void>();

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function smoothstep(edge0: number, edge1: number, value: number) {
  const t = clamp01((value - edge0) / (edge1 - edge0 || 1));
  return t * t * (3 - 2 * t);
}

export function subscribeWorld(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setWorld(progress: number, inView: boolean) {
  const nextProgress = clamp01(progress);
  const changed = worldState.progress !== nextProgress || worldState.inView !== inView;
  if (!changed) return;

  worldState.progress = nextProgress;
  worldState.inView = inView;
  listeners.forEach((listener) => listener());
}

export function useWorldInView() {
  return useSyncExternalStore(
    (callback) => subscribeWorld(callback),
    () => worldState.inView,
    () => false
  );
}
