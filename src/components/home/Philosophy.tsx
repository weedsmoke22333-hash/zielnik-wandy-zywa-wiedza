import { useEffect, useRef } from "react";
import jars from "@/assets/jars.webp";
import specimen from "@/assets/specimen-melissa.webp";
import { Specimen } from "@/components/site/Specimen";

const principles = [
  {
    title: "Poznaj świat roślin.",
    text: "Każde zioło ma swoją nazwę, budowę i historię. Zaczynam od rzetelnego opisu: jak roślinę rozpoznać, które jej części się wykorzystuje i co na jej temat mówią źródła.",
  },
  {
    title: "Dbaj o codzienne nawyki.",
    text: "Sen, ruch, posiłki i chwila odpoczynku robią dla nas więcej niż jakikolwiek pojedynczy napar. Zioła mogą być dopełnieniem, nie zastępstwem.",
  },
  {
    title: "Korzystaj z wiedzy odpowiedzialnie.",
    text: "Oddzielam tradycję od tego, co zostało zbadane, i zawsze piszę o przeciwwskazaniach. Przy lekach, ciąży czy leczeniu pierwszym krokiem jest rozmowa ze specjalistą.",
  },
];

export function Philosophy() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(min-width: 1024px)").matches) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-parallax-img]").forEach((img) => {
          gsap.fromTo(img, { yPercent: -8 }, {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      }, root);
    })();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={root} aria-labelledby="filozofia" data-tone="ivory" className="py-28 md:py-40">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 id="filozofia" className="text-h2 max-w-[14ch]">
            Natura inspiruje. <span className="text-forest">Wiedza</span> pomaga wybierać świadomie.
          </h2>
          <div className="relative mt-16 aspect-[4/3] w-full overflow-hidden rounded-sm lg:w-[85%]">
            <img
              data-parallax-img
              src={jars}
              alt="Słoje z bursztynowego szkła z suszonym rumiankiem i nagietkiem w porannym świetle"
              width={1200}
              height={912}
              loading="lazy"
              className="absolute inset-0 h-[118%] w-full -translate-y-[8%] object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-5 lg:pt-40">
          <div className="space-y-12">
            {principles.map((p, i) => (
              <div key={p.title} className={i === 1 ? "lg:-ml-16" : i === 2 ? "lg:ml-10" : ""}>
                <h3 className="text-h3">{p.title}</h3>
                <p className="mt-3 text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
          <Specimen
            className="mt-20 w-[85%] rotate-[1.5deg] lg:ml-auto"
            src={specimen}
            alt="Zasuszony okaz melisy lekarskiej przyklejony do archiwalnego papieru"
            width={800}
            height={1040}
            latin="Melissa officinalis"
            polish="melisa lekarska"
            note="Cytrynowy zapach liści, znana od stuleci."
          />
        </div>
      </div>
    </section>
  );
}
