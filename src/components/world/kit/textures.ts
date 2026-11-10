import * as THREE from "three";
import { seeded } from "@/lib/world/rng";

export type PanelTextures = { map: THREE.CanvasTexture; bump: THREE.CanvasTexture };

export function makePanelTextures(size = 512): PanelTextures {
  const rnd = seeded(11);

  const col = document.createElement("canvas");
  const hgt = document.createElement("canvas");
  col.width = col.height = hgt.width = hgt.height = size;
  const c = col.getContext("2d")!;
  const h = hgt.getContext("2d")!;

  c.fillStyle = "#1c1814";
  c.fillRect(0, 0, size, size);
  h.fillStyle = "#808080";
  h.fillRect(0, 0, size, size);

  for (let i = 0; i < 9000; i++) {
    const x = rnd() * size;
    const y = rnd() * size;
    const v = Math.floor(18 + rnd() * 26);
    c.fillStyle = `rgba(${v + 10},${v + 4},${v - 2},0.5)`;
    c.fillRect(x, y, 1 + rnd() * 1.5, 1);
  }

  const half = size / 2;
  for (let gx = 0; gx < 2; gx++) {
    for (let gy = 0; gy < 2; gy++) {
      const x = gx * half;
      const y = gy * half;
      c.strokeStyle = "#0a0806";
      c.lineWidth = 5;
      c.strokeRect(x + 2, y + 2, half - 4, half - 4);
      c.strokeStyle = "#3a3128";
      c.lineWidth = 2;
      c.strokeRect(x + 9, y + 9, half - 18, half - 18);
      h.strokeStyle = "#000";
      h.lineWidth = 6;
      h.strokeRect(x + 2, y + 2, half - 4, half - 4);
      h.strokeStyle = "#fff";
      h.lineWidth = 3;
      h.strokeRect(x + 10, y + 10, half - 20, half - 20);
      for (const [rx, ry] of [
        [22, 22],
        [half - 22, 22],
        [22, half - 22],
        [half - 22, half - 22],
      ]) {
        c.fillStyle = "#4a3f33";
        c.beginPath();
        c.arc(x + rx, y + ry, 3.2, 0, Math.PI * 2);
        c.fill();
        h.fillStyle = "#fff";
        h.beginPath();
        h.arc(x + rx, y + ry, 3.2, 0, Math.PI * 2);
        h.fill();
      }
    }
  }

  for (let i = 0; i < 26; i++) {
    const x = rnd() * size;
    const y = rnd() * size;
    const l = 20 + rnd() * 90;
    const a = (rnd() < 0.5 ? 0 : Math.PI / 2) + (rnd() - 0.5) * 0.12;
    c.strokeStyle = `rgba(120,96,70,${0.08 + rnd() * 0.14})`;
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    c.stroke();
  }

  const map = new THREE.CanvasTexture(col);
  map.colorSpace = THREE.SRGBColorSpace;
  const bump = new THREE.CanvasTexture(hgt);
  for (const t of [map, bump]) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 8;
  }
  return { map, bump };
}

export function tiled(base: PanelTextures, rx: number, ry: number): PanelTextures {
  const map = base.map.clone();
  const bump = base.bump.clone();
  for (const t of [map, bump]) {
    t.repeat.set(rx, ry);
    t.needsUpdate = true;
  }
  return { map, bump };
}