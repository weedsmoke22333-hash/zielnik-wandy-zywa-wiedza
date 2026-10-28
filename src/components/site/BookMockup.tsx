import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";
import linden from "@/assets/linden.webp";
import leafSage from "@/assets/leaf-sage.webp";
import jars from "@/assets/jars.webp";

const DEPTH = 22;

function Cover({ product }: { product: Product }) {
  const v = product.cover.variant;
  if (v === "forest")
    return (
      <div className="paper-grain flex h-full flex-col justify-between bg-forest p-6 text-ivory">
        <p className="latin text-sm text-sage">{product.cover.latin}</p>
        <img src={leafSage} alt="" width={1024} height={1024} loading="lazy" className="mx-auto w-3/4 rotate-12 opacity-90" />
        <p className="font-display text-[1.65rem] leading-[1.02] tracking-[-0.02em]">{product.title}</p>
        <p className="text-xs text-ivory/70">Wanda Machocka</p>
      </div>
    );
  if (v === "ivory")
    return (
      <div className="paper-grain flex h-full flex-col bg-ivory p-6 text-deep">
        <p className="text-xs font-semibold text-brown">Wanda Machocka</p>
        <p className="mt-4 font-display text-[1.55rem] leading-[1.05] tracking-[-0.02em]">{product.title}</p>
        <div className="mt-auto overflow-hidden rounded-sm">
          <img src={linden} alt="" width={1200} height={912} loading="lazy" className="aspect-[4/3] w-full object-cover" />
        </div>
        <p className="latin mt-3 text-sm text-muted-foreground">{product.cover.latin}</p>
      </div>
    );
  return (
    <div className="relative flex h-full flex-col justify-end text-ivory">
      <img src={jars} alt="" width={1200} height={912} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-deep/55" />
      <div className="relative p-6">
        <p className="latin text-sm text-copper">{product.cover.latin}</p>
        <p className="mt-2 font-display text-[1.65rem] leading-[1.02] tracking-[-0.02em]">{product.title}</p>
        <p className="mt-3 text-xs text-ivory/75">Wanda Machocka</p>
      </div>
    </div>
  );
}

export function BookMockup({ product, interactive, className }: { product: Product; interactive: boolean; className?: string }) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-24, -8]), { stiffness: 120, damping: 18 });
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 18 });
  const shadowX = useTransform(ry, [-24, -8], [18, -6]);
  const spineColor = product.cover.variant === "ivory" ? "bg-paper" : product.cover.variant === "forest" ? "bg-deep" : "bg-brown";

  return (
    <div
      className={cn("group relative mx-auto w-full max-w-[260px] [perspective:1400px]", className)}
      onPointerMove={(e) => {
        if (!interactive) return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <motion.span
        aria-hidden
        style={{ x: shadowX }}
        className="absolute -bottom-5 left-[8%] h-8 w-[90%] rounded-[50%] bg-deep/35 blur-xl"
      />
      <motion.div
        style={{ rotateY: interactive ? ry : -16, rotateX: interactive ? rx : 0, transformStyle: "preserve-3d" }}
        className="relative aspect-[3/4.2] w-full"
      >
        {/* front */}
        <div className="absolute inset-0 overflow-hidden rounded-r-[2px] shadow-[var(--shadow-book)]" style={{ transform: `translateZ(${DEPTH / 2}px)` }}>
          <Cover product={product} />
          <span aria-hidden className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-deep/40 to-transparent" />
        </div>
        {/* spine */}
        <div
          aria-hidden
          className={cn("absolute inset-y-0", spineColor)}
          style={{ width: DEPTH, left: -DEPTH / 2, transform: "rotateY(-90deg)" }}
        />
        {/* page edges */}
        <div
          aria-hidden
          className="absolute inset-y-[3px] bg-[repeating-linear-gradient(90deg,var(--ivory)_0_1px,var(--paper)_1px_2px)]"
          style={{ width: DEPTH - 2, right: -(DEPTH - 2) / 2 + 2, transform: "rotateY(90deg)" }}
        />
        {/* back */}
        <div aria-hidden className={cn("absolute inset-0", spineColor)} style={{ transform: `translateZ(-${DEPTH / 2}px)` }} />
      </motion.div>
    </div>
  );
}
