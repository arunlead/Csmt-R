"use client";

import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Particles from "./Particles";
import CameraRig from "./CameraRig";
import ServerRoom from "./ServerRoom";
import { trackScroll } from "@/lib/scrollState";

export default function Scene() {
  useEffect(() => trackScroll(), []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 2.2, 8], fov: 60, near: 0.1, far: 200 }}
      >
        <color attach="background" args={["#040a18"]} />
        <fog attach="fog" args={["#040a18", 14, 80]} />
        <ServerRoom />
        <Particles />
        <CameraRig />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#05070d_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-transparent to-transparent" />
    </div>
  );
}