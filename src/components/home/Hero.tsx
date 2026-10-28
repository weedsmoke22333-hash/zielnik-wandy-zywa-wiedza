import { Link } from "@tanstack/react-router";
import { motion, useAnimationControls, useScroll, useTransform, type Variants } from "motion/react";
import { useEffect, useRef } from "react";
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

  const v = (variants: Variants) => (reduced ? fadeOnly : variants);
  const anim = { initial: false as const, animate: controls };

  return (
    <section ref={ref} className="relative isolate min-h-[100svh] overflow-hidden bg-deep text-ivory">
      <motion.div aria-hidden className="absolute inset-[-6%] -z-10" style={{ y: yTexture }}>
        <img src={texture} alt="" width={1600} height={1008} className="h-full w-full object-cover opacity-80" fetchPriority="high" />
      </motion.div>

      <div className="mx-auto grid min-h-[100svh] max-w-[1400px] items-center gap-14 px-5 pb-24 pt-28 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-16 lg:pt-24 xl:gap-24">
        <div className="order-2 min-w-0 lg:order-1">
          <motion.p {...anim} variants={v(fadeUp)} custom={0.3} className="latin text-xl text-sage md:text-2xl">
            Herbarium codziennej troski
          </motion.p>
          <h1 className="text-hero mt-5 font-light">
            <span className="block overflow-y-clip pb-[0.1em] pt-[0.16em] -mt-[0.16em] [overflow-x:visible]">
              <motion.span className="block" {...anim} variants={v(lineUp)} custom={0.45}>Blisko natury.</motion.span>
            </span>
            <span className="block overflow-y-clip pb-[0.1em] pt-[0.16em] -mt-[0.16em] [overflow-x:visible]">
              <motion.span className="block" {...anim} variants={v(lineUp)} custom={0.6}>Świadomie dla zdrowia.</motion.span>
            </span>
          </h1>
          <motion.p {...anim} variants={v(fadeUp)} custom={0.9} className="mt-7 max-w-[34rem] text-lg text-ivory/90 md:text-xl">
            Wiedza o ziołach, naturalne inspiracje i praktyczne poradniki, które pomagają świadomie troszczyć się o
            siebie każdego dnia.
          </motion.p>
          <div className="mt-8 flex flex-wrap gap-4">
            <motion.div {...anim} variants={v(fadeUp)} custom={1.05}>
              <Link to="/ebooki" className="inline-flex min-h-14 items-center rounded-sm bg-copper px-7 font-semibold text-deep transition-colors hover:bg-ivory">
                Odkryj moje e-booki
              </Link>
            </motion.div>
            <motion.div {...anim} variants={v(fadeUp)} custom={1.15}>
              <Link to="/o-mnie" className="inline-flex min-h-14 items-center rounded-sm border border-ivory px-7 font-semibold text-ivory transition-colors hover:bg-ivory hover:text-deep">
                Poznaj moją historię
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="relative order-1 mx-auto w-full max-w-[20rem] sm:max-w-[24rem] lg:order-2 lg:max-w-[460px]">
          {/* sprig behind the card, top-left */}
          <motion.div style={{ y: yPortrait }} className="pointer-events-none absolute -left-20 -top-16 w-52 md:-left-28 md:w-72" aria-hidden>
            <motion.img {...anim} variants={v(settle)} custom={1.1} src={leafSage} alt="" width={1024} height={1024} className="-rotate-[30deg]" />
          </motion.div>

          <motion.div style={{ y: yPortrait }} className="relative">
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
