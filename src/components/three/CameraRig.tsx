"use client";

import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import { scrollState } from "@/lib/scrollState";

const START_Z = 8;
const TRAVEL = 150;
const EYE = 2.2;

export default function CameraRig() {
  useFrame((state, delta) => {
    const cam = state.camera;
    const targetZ = START_Z - scrollState.progress * TRAVEL;
    cam.position.z = MathUtils.damp(cam.position.z, targetZ, 3, delta);
    cam.position.x = MathUtils.damp(cam.position.x, state.pointer.x * 1.2, 2, delta);
    cam.position.y = MathUtils.damp(cam.position.y, EYE + state.pointer.y * 0.5, 2, delta);
    cam.lookAt(cam.position.x * 0.2, EYE + 0.3, cam.position.z - 20);
  });
  return null;
}