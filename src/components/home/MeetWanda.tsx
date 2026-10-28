import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { WandaPortrait } from "@/components/site/WandaPortrait";

export function MeetWanda() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.current?.style.setProperty("background-color", "var(--sage)");
      return;
    }
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.fromTo(root.current, { backgroundColor: "#F7F5EF" }, {
          backgroundColor: "#DDE3D5",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 25%", scrub: true },
        });
      }, root);
    })();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={root} aria-labelledby="poznajmy" className="bg-ivory py-28 md:py-40">
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5 lg:col-start-1">
          <WandaPortrait position="57% 32%" zoom={1.28} sizes="380px" className="aspect-[4/5] w-full max-w-[380px]" />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <h2 id="poznajmy" className="text-h2">Poznajmy się bliżej.</h2>
          <div className="measure mt-8 space-y-5 text-lg">
            <p>
              Tworzę to miejsce, żeby dzielić się wiedzą o ziołach w sposób spokojny i uważny. Zależy mi na tym, by
              każda informacja była zrozumiała, a jednocześnie ostrożna.
            </p>
            <p className="text-muted-foreground">
              Staram się wyraźnie oddzielać to, co przekazuje tradycja, od tego, co potwierdzają badania. Piszę
              o praktycznych, codziennych nawykach — takich, które łatwo wprowadzić i które naprawdę mają sens.
            </p>
          </div>
          <Link to="/o-mnie" className="mt-10 inline-flex min-h-14 items-center rounded-sm bg-forest px-7 font-semibold text-ivory transition-colors hover:bg-deep">
            Moja historia
          </Link>
        </div>
      </div>
    </section>
  );
}
