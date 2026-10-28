import { Link } from "@tanstack/react-router";
import { motion, useAnimationControls, useMotionValue, useScroll, useSpring, useTransform, type Variants } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import texture from "@/assets/hero-texture.webp";
import leafSage from "@/assets/leaf-sage.webp";
import leafMelissa from "@/assets/leaf-melissa.webp";
import { WandaPortrait } from "@/components/site/WandaPortrait";
import { useRichMotion } from "@/hooks/use-motion-prefs";

const ease = [0.2, 0.7, 0.1, 1] as const;

// Every variant ends fully opaque. SSR renders the "show" state; hidden is applied only after hydration.
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: d, ease } }),
};
const lineUp: Variants = {
  hidden: { y: "105%" },
  show: (d: number) => ({ y: "0%", transition: { duration: 0.9, delay: d, ease } }),
};
const wipe: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.1, delay: 0.55, ease } },
};
const settle: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 1, delay: d, ease } }),
};
const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};

function Magnetic({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  const x = useSpring(0, { stiffness: 200, damping: 15 });
  const y = useSpring(0, { stiffness: 200, damping: 15 });
  return (
    <motion.div
      style={{ x, y }}
      className="inline-block"
      onPointerMove={(e) => {
        if (!enabled) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set(((e.clientX - r.left) / r.width - 0.5) * 12);
        y.set(((e.clientY - r.top) / r.height - 0.5) * 12);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

const dust = Array.from({ length: 12 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${30 + ((i * 53) % 65)}%`,
  size: 2 + (i % 3),
  duration: 14 + ((i * 7) % 10),
  delay: (i * 1.3) % 9,
}));

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { rich, reduced } = useRichMotion();
  const controls = useAnimationControls();
  const sweep = useAnimationControls();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    controls.set("hidden");
    void controls.start("show");
    void sweep.start({ x: ["-90%", "90%"], y: ["-40%", "40%"], opacity: [0, 1, 0], transition: { duration: 1.4, delay: 1.5, ease: "easeInOut" } });
  }, [controls, sweep]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const factor = rich ? 1 : reduced ? 0 : 0.3;
  const yTexture = useTransform(scrollYProgress, [0, 1], [0, 80 * factor]);
  const yPortrait = useTransform(scrollYProgress, [0, 1], [0, 120 * factor]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, 220 * factor]);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-3, 3]), { stiffness: 80, damping: 20 });
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [3, -3]), { stiffness: 80, damping: 20 });

  useEffect(() => {
    if (!rich) {
      px.set(0);
      py.set(0);
      return;
    }
    const onMove = (e: PointerEvent) => {
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [rich, px, py]);

  const v = (variants: Variants) => (reduced ? fadeOnly : variants);
  const anim = { initial: false as const, animate: controls };

  return (
    <section ref={ref} className="relative isolate min-h-[100svh] overflow-hidden bg-deep text-ivory">
      <motion.div aria-hidden className="absolute inset-[-6%] -z-10" style={{ y: yTexture }}>
        <img src={texture} alt="" width={1600} height={1008} className="h-full w-full object-cover opacity-80" fetchPriority="high" />
      </motion.div>

      {rich && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-[5]">
          {dust.map((d, i) => (
            <span
              key={i}
              className="dust absolute rounded-full bg-copper/50"
              style={{ left: d.left, top: d.top, width: d.size, height: d.size, animationDuration: `${d.duration}s`, animationDelay: `${d.delay}s` }}
            />
          ))}
        </div>
      )}

      <div className="mx-auto grid min-h-[100svh] max-w-[1400px] items-center gap-14 px-5 pb-24 pt-28 md:px-10 lg:grid-cols-12 lg:gap-8 lg:pt-24">
        <div className="order-2 lg:order-1 lg:col-span-7">
          <motion.p {...anim} variants={v(fadeUp)} custom={0.3} className="latin text-xl text-sage md:text-2xl">
            Herbarium codziennej troski
          </motion.p>
          <h1 className="text-hero mt-5 font-light">
            <span className="block overflow-hidden pb-[0.08em] pt-[0.14em] -mt-[0.14em] xl:whitespace-nowrap">
              <motion.span className="block" {...anim} variants={v(lineUp)} custom={0.45}>Blisko natury.</motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em] pt-[0.14em] -mt-[0.14em] xl:whitespace-nowrap">
              <motion.span className="block" {...anim} variants={v(lineUp)} custom={0.6}>Świadomie dla zdrowia.</motion.span>
            </span>
          </h1>
          <motion.p {...anim} variants={v(fadeUp)} custom={0.9} className="mt-7 max-w-[34rem] text-lg text-ivory/90 md:text-xl">
            Wiedza o ziołach, naturalne inspiracje i praktyczne poradniki, które pomagają świadomie troszczyć się o
            siebie każdego dnia.
          </motion.p>
          <div className="mt-8 flex flex-wrap gap-4">
            <motion.div {...anim} variants={v(fadeUp)} custom={1.05}>
              <Magnetic enabled={rich}>
                <Link to="/ebooki" className="inline-flex min-h-14 items-center rounded-sm bg-copper px-7 font-semibold text-deep transition-colors hover:bg-ivory">
                  Odkryj moje e-booki
                </Link>
              </Magnetic>
            </motion.div>
            <motion.div {...anim} variants={v(fadeUp)} custom={1.15}>
              <Magnetic enabled={rich}>
                <Link to="/o-mnie" className="inline-flex min-h-14 items-center rounded-sm border border-ivory px-7 font-semibold text-ivory transition-colors hover:bg-ivory hover:text-deep">
                  Poznaj moją historię
                </Link>
              </Magnetic>
            </motion.div>
          </div>
        </div>

        <div className="relative order-1 mx-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:order-2 lg:col-span-5 lg:max-w-[520px]">
          {/* sprig behind the card, top-left */}
          <motion.div style={{ y: yPortrait }} className="pointer-events-none absolute -left-20 -top-16 w-52 md:-left-28 md:w-72" aria-hidden>
            <motion.img {...anim} variants={v(settle)} custom={1.1} src={leafSage} alt="" width={1024} height={1024} className="-rotate-[30deg]" />
          </motion.div>

          <motion.div style={{ y: yPortrait, rotateX: rotX, rotateY: rotY, transformPerspective: 1200 }} className="relative">
            <motion.figure
              {...anim}
              variants={v(wipe)}
              className="paper-grain relative -rotate-[1.5deg] bg-ivory p-[20px] pb-5 text-deep shadow-[0_2px_4px_rgb(60_38_20/0.35),0_34px_60px_-18px_rgb(40_24_10/0.6)]"
            >
              <span className="tape -left-4 -top-3 w-24 -rotate-[32deg] opacity-80" aria-hidden />
              <span className="tape -right-4 -top-3 w-24 rotate-[30deg] opacity-80" aria-hidden />
              <div className="relative mx-auto max-w-[480px]">
                <WandaPortrait eager className="aspect-[4/5] w-full" sizes="480px" />
                {!reduced && (
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "radial-gradient(40% 60% at 50% 50%, rgb(247 245 239 / 0.22), transparent 70%)", opacity: 0 }}
                    animate={sweep}
                  />
                )}
              </div>
              <figcaption className="mt-4">
                <span className="block font-display text-xl">Wanda Machocka</span>
                <span className="block text-sm text-muted-foreground">w swojej zielarni</span>
              </figcaption>
            </motion.figure>
          </motion.div>

          {/* sprig in front, crossing the lower-right edge (away from the face) */}
          <motion.div style={{ y: yFront }} className="pointer-events-none absolute -bottom-12 -right-10 w-40 md:-right-16 md:w-56" aria-hidden>
            <motion.img {...anim} variants={v(settle)} custom={1.25} src={leafMelissa} alt="" width={1024} height={1024} className="rotate-[35deg]" />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-sm text-ivory/70 md:flex" aria-hidden>
        <span className="relative h-12 w-px overflow-hidden bg-ivory/15">
          <span className="scroll-line absolute inset-0 bg-ivory/80" />
        </span>
        Przewiń
      </div>
    </section>
  );
}
