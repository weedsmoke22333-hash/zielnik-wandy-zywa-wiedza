import { Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import fallback from "@/assets/okazy-fallback.webp";
import { EMA_HERBAL_URL, plants } from "@/data/plants";
import { RevealHeading } from "@/components/site/RevealHeading";
import { cn } from "@/lib/utils";

const LeafScene = lazy(() => import("@/components/okazy/LeafScene"));

function canUse3D() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.innerWidth < 768) return false;
  const cores = navigator.hardwareConcurrency ?? 8;
  if (cores <= 2) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Specimens() {
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<"pending" | "3d" | "photo">("pending");
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pointer, setPointer] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const plant = plants[active]!;

  useEffect(() => {
    setMode(canUse3D() ? "3d" : "photo");
    setPointer(window.matchMedia("(pointer: fine)").matches);
    const el = stage.current;
    if (!el) return;
    const nearObs = new IntersectionObserver(([e]) => e?.isIntersecting && setNear(true), { rootMargin: "200px" });
    const visObs = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting));
    nearObs.observe(el);
    visObs.observe(el);
    return () => {
      nearObs.disconnect();
      visObs.disconnect();
    };
  }, []);

  const photo = (
    <div className="relative h-full w-full overflow-hidden rounded-sm">
      <img
        src={fallback}
        alt="Trzy zasuszone liście na archiwalnym papierze: melisa, szałwia i mięta"
        width={1504}
        height={912}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-out"
        style={{ transform: mode === "photo" ? `scale(1.6) translateX(${(1 - active) * 28}%)` : undefined }}
      />
    </div>
  );

  return (
    <section data-tone="ivory" aria-labelledby="okazy" className="py-28 md:py-36">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 md:px-10 lg:grid-cols-12">
        <div ref={stage} className="relative aspect-[4/3] w-full lg:col-span-7 lg:aspect-[5/4]">
          {mode === "3d" && near ? (
            <Suspense fallback={photo}>
              <LeafScene active={active} running={visible} pointerEnabled={pointer} />
            </Suspense>
          ) : (
            photo
          )}
        </div>

        <div className="lg:col-span-5">
          <RevealHeading id="okazy" className="text-h2">Poznaj rośliny z bliska.</RevealHeading>
          <div role="group" aria-label="Wybierz roślinę" className="mt-10 flex flex-wrap gap-3">
            {plants.map((p, i) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                className={cn(
                  "min-h-12 rounded-sm border px-5 text-base font-semibold transition-colors",
                  i === active ? "border-forest bg-forest text-ivory" : "border-forest/40 text-forest hover:border-forest",
                )}
              >
                {p.polish}
              </button>
            ))}
          </div>

          <div aria-live="polite" className="paper-grain specimen-shadow mt-10 border border-brown/30 bg-ivory p-6 md:p-8">
            <p className="latin text-2xl text-deep">{plant.latin}</p>
            <p className="font-semibold text-brown">{plant.polish}</p>
            <p className="mt-4">{plant.use}</p>
            <p className="mt-3 text-muted-foreground">
              <span className="font-semibold text-deep">Ostrożność: </span>
              {plant.caution}
            </p>
            <p className="mt-6 border-t border-border pt-4 text-[0.9375rem] text-muted-foreground">
              Tradycyjne zastosowanie oparte na długoletnim stosowaniu, nie na badaniach klinicznych.{" "}
              <a href={EMA_HERBAL_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                Źródło: monografia EMA/HMPC
              </a>
            </p>
            <Link to="/ziola-i-rosliny/$slug" params={{ slug: plant.herbSlug }} className="link-underline mt-5 inline-block font-semibold text-forest">
              Pełna karta: {plant.polish}
            </Link>
          </div>
          <Link to="/ziola-i-rosliny" className="mt-8 inline-flex min-h-14 items-center rounded-sm border border-forest px-7 font-semibold text-forest transition-colors hover:bg-forest hover:text-ivory">
            Otwórz atlas roślin
          </Link>
        </div>
      </div>
    </section>
  );
}
