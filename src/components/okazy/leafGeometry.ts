import * as THREE from "three";
import type { LeafKind } from "@/data/plants";

/** Half-width of the blade at v∈[0,1] (base→tip), before serration. */
function profile(kind: LeafKind, v: number) {
  switch (kind) {
    case "melissa": // ovate: widest near the base
      return 0.62 * Math.pow(Math.sin(Math.PI * Math.pow(v, 0.8)), 0.85) * (1 - 0.25 * v);
    case "salvia": // elongated oval
      return 0.36 * Math.pow(Math.sin(Math.PI * v), 0.7);
    case "mentha": // lanceolate
      return 0.42 * Math.pow(Math.sin(Math.PI * Math.pow(v, 0.7)), 1.1);
  }
}

function serration(kind: LeafKind, v: number) {
  const teeth = kind === "melissa" ? 9 : kind === "mentha" ? 14 : 0;
  if (!teeth) return 1;
  const phase = (v * teeth) % 1;
  const amp = kind === "melissa" ? 0.07 : 0.06;
  // crenate = rounded bumps, serrate = saw teeth
  const tooth = kind === "melissa" ? Math.sin(phase * Math.PI) : phase;
  return 1 - amp + amp * tooth * Math.min(1, v * 6) * Math.min(1, (1 - v) * 6);
}

export function createLeafGeometry(kind: LeafKind) {
  const L = kind === "salvia" ? 2.3 : kind === "melissa" ? 1.8 : 2.1;
  const segU = 40;
  const segV = 90;
  const geo = new THREE.PlaneGeometry(2, 1, segU, segV);
  const pos = geo.attributes["position"] as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i); // -1..1
    const v = pos.getY(i) + 0.5; // 0..1
    const half = profile(kind, v) * serration(kind, v);
    const x = u * half;
    const y = (v - 0.5) * L;
    const au = Math.abs(u);
    // cup along midrib + gentle arch along length + edge wave
    let z = -0.35 * x * x + 0.18 * Math.sin(Math.PI * v) - 0.12 * v * v;
    z += 0.025 * Math.sin(v * 22 + u * 2) * au * au;
    // midrib ridge
    z -= 0.018 * Math.exp(-Math.pow(u / 0.06, 2));
    // lateral veins (angled grooves)
    const veinCoord = v - au * 0.32;
    const spacing = kind === "salvia" ? 0.07 : 0.1;
    const d = Math.abs(((veinCoord % spacing) + spacing) % spacing - spacing / 2) / (spacing / 2);
    z -= 0.008 * Math.pow(1 - d, 6) * (1 - au);
    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}
