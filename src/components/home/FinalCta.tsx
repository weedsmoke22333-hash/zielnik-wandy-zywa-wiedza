import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import photo from "@/assets/final-cta.webp";

export function FinalCta() {
  const root = useRef<HTMLElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.fromTo(img.current, { yPercent: -10 }, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      }, root);
    })();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={root} aria-labelledby="final-cta" className="relative isolate overflow-hidden py-40 text-ivory md:py-56">
      <img
        ref={img}
        src={photo}
        alt="Pęki suszących się ziół nad drewnianym stołem, w ciepłym świetle okna"
        width={1600}
        height={912}
        loading="lazy"
        className="absolute inset-x-0 -top-[12%] -z-20 h-[124%] w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-deep/70" />
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <h2 id="final-cta" className="text-h2 max-w-[20ch]">
          Zrób miejsce na wiedzę, która pomaga świadomie troszczyć się o siebie.
        </h2>
        <Link to="/ebooki" className="mt-12 inline-flex min-h-14 items-center rounded-sm bg-copper px-7 font-semibold text-deep transition-colors hover:bg-ivory">
          Poznaj moje e-booki
        </Link>
      </div>
    </section>
  );
}
