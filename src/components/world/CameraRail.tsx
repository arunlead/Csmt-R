"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { cameraKeys } from "@/lib/world/scenes";
import { worldState } from "@/lib/world/worldState";

export default function CameraRail() {
  const rail = useMemo(() => {
    const pos = new THREE.CatmullRomCurve3(
      cameraKeys.map((k) => new THREE.Vector3(...k.pos)),
      false,
      "centripetal"
    );
    const look = new THREE.CatmullRomCurve3(
      cameraKeys.map((k) => new THREE.Vector3(...k.look)),
      false,
      "centripetal"
    );
    return { pos, look };
  }, []);

  const smooth = useRef(0);
  const ptr = useRef({ x: 0, y: 0 });
  const tmp = useRef({
    p: new THREE.Vector3(),
    l: new THREE.Vector3(),
  });

  useFrame(({ camera, pointer }, dt) => {
    const cam = camera as THREE.PerspectiveCamera;
    smooth.current = THREE.MathUtils.damp(smooth.current, worldState.progress, 7, dt);
    const p = smooth.current;

    const n = cameraKeys.length;
    let i = 0;
    while (i < n - 2 && p > cameraKeys[i + 1].p) i++;
    const a = cameraKeys[i];
    const b = cameraKeys[i + 1];
    const u = THREE.MathUtils.clamp((p - a.p) / (b.p - a.p), 0, 1);
    const t = (i + u) / (n - 1);

    rail.pos.getPoint(t, tmp.current.p);
    rail.look.getPoint(t, tmp.current.l);
    const fov = THREE.MathUtils.lerp(a.fov, b.fov, u);
    const roll = THREE.MathUtils.lerp(a.roll, b.roll, u);

    ptr.current.x = THREE.MathUtils.damp(ptr.current.x, pointer.x, 2.5, dt);
    ptr.current.y = THREE.MathUtils.damp(ptr.current.y, pointer.y, 2.5, dt);

    cam.position.set(
      tmp.current.p.x + ptr.current.x * 0.25,
      tmp.current.p.y + ptr.current.y * 0.12,
      tmp.current.p.z
    );
    cam.lookAt(
      tmp.current.l.x + ptr.current.x * 1.4,
      tmp.current.l.y + ptr.current.y * 0.7,
      tmp.current.l.z
    );
    cam.rotateZ(roll);
    if (Math.abs(cam.fov - fov) > 0.001) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}