import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { plants, type LeafKind } from "@/data/plants";
import { createLeafGeometry } from "./leafGeometry";

const MATERIALS: Record<LeafKind, THREE.MeshPhysicalMaterialParameters> = {
  melissa: { color: "#5f7a4c", roughness: 0.6, sheen: 0.2, sheenColor: new THREE.Color("#c9d6b4") },
  salvia: { color: "#8c9a83", roughness: 0.7, sheen: 1, sheenRoughness: 0.5, sheenColor: new THREE.Color("#dfe6d6") },
  mentha: { color: "#4b6a45", roughness: 0.55, sheen: 0.15, sheenColor: new THREE.Color("#b8c9a5") },
};

const RADIUS = 1.35;
const TWEEN_MS = 900;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function Leaves({ active, scrollRef, pointerEnabled }: { active: number; scrollRef: React.RefObject<number>; pointerEnabled: boolean }) {
  const group = useRef<THREE.Group>(null);
  const leafRefs = useRef<(THREE.Group | null)[]>([]);
  const tween = useRef({ from: 0, to: 0, start: 0 });
  const { pointer } = useThree();

  const assets = useMemo(
    () =>
      plants.map((p) => ({
        geo: createLeafGeometry(p.id),
        mat: new THREE.MeshPhysicalMaterial({ ...MATERIALS[p.id], side: THREE.DoubleSide }),
        stem: new THREE.CylinderGeometry(0.018, 0.026, 0.55, 8),
      })),
    [],
  );
  const stemMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#6f7f5a", roughness: 0.8 }), []);

  useEffect(
    () => () => {
      assets.forEach((a) => {
        a.geo.dispose();
        a.mat.dispose();
        a.stem.dispose();
      });
      stemMat.dispose();
    },
    [assets, stemMat],
  );

  useEffect(() => {
    const target = (-active * Math.PI * 2) / plants.length;
    const current = group.current?.rotation.y ?? 0;
    // shortest path
    let delta = target - current;
    delta = Math.atan2(Math.sin(delta), Math.cos(delta));
    tween.current = { from: current, to: current + delta, start: performance.now() };
  }, [active]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = Math.min(1, (performance.now() - tween.current.start) / TWEEN_MS);
    const base = tween.current.from + (tween.current.to - tween.current.from) * easeInOut(t);
    const scroll = (scrollRef.current ?? 0) * 0.35;
    const px = pointerEnabled ? pointer.x * THREE.MathUtils.degToRad(5) : 0;
    const py = pointerEnabled ? -pointer.y * THREE.MathUtils.degToRad(4) : 0;
    g.rotation.y = base + px;
    g.rotation.x = py + scroll * 0.2;
    const time = state.clock.elapsedTime;
    leafRefs.current.forEach((leaf, i) => {
      if (!leaf) return;
      const isActive = i === active;
      leaf.position.y = Math.sin(time * 0.5 + i * 2) * 0.06 + (isActive ? 0.1 : 0);
      leaf.rotation.z = Math.sin(time * 0.35 + i) * 0.05 + (i - 1) * 0.12;
      const s = THREE.MathUtils.lerp(leaf.scale.x, isActive ? 1.12 : 0.88, 0.06);
      leaf.scale.setScalar(s);
    });
  });

  return (
    <group ref={group}>
      {assets.map((a, i) => {
        const angle = (i * Math.PI * 2) / plants.length;
        return (
          <group key={plants[i]!.id} position={[Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS]} rotation={[0, angle, 0]}>
            <group ref={(el) => { leafRefs.current[i] = el; }}>
              <mesh geometry={a.geo} material={a.mat} rotation={[-0.15, 0, 0]} castShadow />
              <mesh geometry={a.stem} material={stemMat} position={[0, -1.15, -0.02]} />
            </group>
          </group>
        );
      })}
    </group>
  );
}

export default function LeafScene({ active, running, pointerEnabled }: { active: number; running: boolean; pointerEnabled: boolean }) {
  const scrollRef = useRef(0);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      scrollRef.current = (window.innerHeight / 2 - (r.top + r.height / 2)) / window.innerHeight;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        frameloop={running ? "always" : "never"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.3, 4.6], fov: 38 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          wrap.current?.setAttribute("data-scene-ready", "true");
        }}
      >
        <hemisphereLight args={["#f3efe2", "#4c5a44", 0.9]} />
        <directionalLight position={[3, 4, 3]} intensity={1.6} color="#f1d2b4" />
        <directionalLight position={[-4, 1, -2]} intensity={0.5} color="#c9dbe6" />
        <Leaves active={active} scrollRef={scrollRef} pointerEnabled={pointerEnabled} />
        <ContactShadows position={[0, -1.7, 0]} opacity={0.35} scale={6} blur={2.6} far={3} resolution={256} color="#182a22" />
      </Canvas>
    </div>
  );
}
