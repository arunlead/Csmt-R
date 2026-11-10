"use client";

import { Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import ImageScene from "./ImageScene";
import Dust from "./kit/Dust";
import { SCENES } from "@/lib/scenes";

/* small mouse parallax: the camera drifts a little toward the pointer */
function CameraRig() {
  useFrame((state, delta) => {
    const cam = state.camera;
    cam.position.x = MathUtils.damp(cam.position.x, state.pointer.x * 0.5, 3, delta);
    cam.position.y = MathUtils.damp(cam.position.y, state.pointer.y * 0.3, 3, delta);
    cam.lookAt(0, 0, -40);
  });
  return null;
}

export default function WorldCanvas({ active }: { active: boolean }) {
  const dust = useMemo(() => (window.innerWidth < 1100 ? 500 : 900), []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.75]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        camera={{ fov: 50, near: 0.1, far: 200, position: [0, 0, 0] }}
        eventSource={document.body}
        eventPrefix="client"
      >
        <color attach="background" args={["#09080b"]} />
        {SCENES.map((def, i) => (
          <Suspense key={def.id} fallback={null}>
            <ImageScene index={i} def={def} />
          </Suspense>
        ))}
        <Dust count={dust} />
        <CameraRig />
      </Canvas>
    </div>
  );
}