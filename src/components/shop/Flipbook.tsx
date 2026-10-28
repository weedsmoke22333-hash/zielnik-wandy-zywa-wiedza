import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SamplePage } from "@/data/products";
import { cn } from "@/lib/utils";

function PageView({ page, n }: { page: SamplePage | undefined; n: number }) {
  if (!page) return <div className="h-full w-full bg-[#e9e2d0]" aria-hidden />;
  return (
    <div className="paper-grain relative flex h-full w-full flex-col bg-[#fbf9f3] px-[9%] py-[10%] text-deep">
      {page.kind === "title" && (
        <div className="m-auto text-center">
          <p className="text-[0.75rem] font-semibold text-brown">Wanda Machocka</p>
          <p className="mt-4 font-display text-[clamp(1.3rem,2.4vw,2rem)] leading-tight">{page.heading}</p>
          <span className="mx-auto mt-5 block h-px w-12 bg-copper" />
        </div>
      )}
      {page.kind === "toc" && (
        <>
          <p className="font-display text-[clamp(1.1rem,1.8vw,1.5rem)]">{page.heading}</p>
          <ol className="mt-4 space-y-2 text-[clamp(0.72rem,1vw,0.9rem)]">
            {page.items.map((it, i) => (
              <li key={it} className="flex items-baseline gap-2 border-b border-dotted border-brown/30 pb-1">
                <span className="text-brown">{i + 1}.</span> {it}
              </li>
            ))}
          </ol>
        </>
      )}
      {(page.kind === "text" || page.kind === "note") && (
        <>
          {page.kind === "text" && page.latin && <p className="latin text-[clamp(0.8rem,1.1vw,1rem)] text-brown">{page.latin}</p>}
          <p className="font-display text-[clamp(1.1rem,1.8vw,1.5rem)] leading-tight">{page.heading}</p>
          <div className={cn("mt-4 space-y-3 text-[clamp(0.72rem,1vw,0.9rem)] leading-relaxed", page.kind === "note" && "border-l-2 border-copper pl-3")}>
            {page.paragraphs.map((p) => <p key={p.slice(0, 30)}>{p}</p>)}
          </div>
        </>
      )}
      <span className="absolute bottom-[5%] left-0 right-0 text-center text-[0.7rem] text-muted-foreground">{n}</span>
    </div>
  );
}

/**
 * "Zajrzyj do środka" — two-page spread with a 3D page turn on larger screens,
 * single pages with a crossfade on phones and with reduced motion.
 */
export function Flipbook({ pages, title }: { pages: SamplePage[]; title: string }) {
  const reduced = useReducedMotion();
  const [wide, setWide] = useState(false);
  const [spread, setSpread] = useState(0);
  const [single, setSingle] = useState(0);
  const [flip, setFlip] = useState<null | "next" | "prev">(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const u = () => setWide(mq.matches);
    u();
    mq.addEventListener("change", u);
    return () => mq.removeEventListener("change", u);
  }, []);

  // spread k shows pages (2k-1 | 2k); page index 0 is on the right of spread 0
  const lastSpread = Math.ceil(pages.length / 2);
  const left = (k: number) => pages[2 * k - 1];
  const right = (k: number) => pages[2 * k];

  const go = (dir: "next" | "prev") => {
    if (flip) return;
    if (!wide) {
      setSingle((s) => Math.max(0, Math.min(pages.length - 1, s + (dir === "next" ? 1 : -1))));
      return;
    }
    if (dir === "next" && spread >= lastSpread) return;
    if (dir === "prev" && spread <= 0) return;
    if (reduced) setSpread((s) => s + (dir === "next" ? 1 : -1));
    else setFlip(dir);
  };
  const done = () => {
    setSpread((s) => s + (flip === "next" ? 1 : -1));
    setFlip(null);
  };

  const canPrev = wide ? spread > 0 : single > 0;
  const canNext = wide ? spread < lastSpread : single < pages.length - 1;
  const shown = [2 * spread, 2 * spread + 1].filter((n) => n >= 1 && n <= pages.length);
  const label = wide
    ? shown.length === 2
      ? `Strony ${shown[0]}–${shown[1]} z ${pages.length}`
      : `Strona ${shown[0] ?? 1} z ${pages.length}`
    : `Strona ${single + 1} z ${pages.length}`;

  return (
    <div
      role="region"
      aria-roledescription="podgląd książki"
      aria-label={`Podgląd: ${title}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); go("next"); }
        if (e.key === "ArrowLeft") { e.preventDefault(); go("prev"); }
      }}
      className="rounded-sm outline-offset-8"
    >
      {wide ? (
        <div className="relative mx-auto aspect-[2/1.38] w-full max-w-[880px] [perspective:2200px]">
          <div className="absolute inset-0 grid grid-cols-2 shadow-[0_30px_50px_-25px_rgb(24_42_34/0.55)]">
            <div className="relative overflow-hidden">
              <PageView page={flip === "prev" ? left(spread - 1) : left(spread)} n={flip === "prev" ? 2 * spread - 2 : 2 * spread} />
              <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-deep/15 to-transparent" />
            </div>
            <div className="relative overflow-hidden">
              <PageView page={flip === "next" ? right(spread + 1) : right(spread)} n={flip === "next" ? 2 * spread + 3 : 2 * spread + 1} />
              <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-deep/15 to-transparent" />
            </div>
          </div>
          {flip && (
            <motion.div
              key={`${flip}-${spread}`}
              className={cn("absolute top-0 h-full w-1/2 [transform-style:preserve-3d]", flip === "next" ? "right-0 origin-left" : "left-0 origin-right")}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: flip === "next" ? -180 : 180 }}
              transition={{ duration: 0.85, ease: [0.45, 0.05, 0.25, 1] }}
              onAnimationComplete={done}
            >
              <div className="absolute inset-0 [backface-visibility:hidden]">
                <PageView page={flip === "next" ? right(spread) : left(spread)} n={flip === "next" ? 2 * spread + 1 : 2 * spread} />
              </div>
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <PageView page={flip === "next" ? left(spread + 1) : right(spread - 1)} n={flip === "next" ? 2 * spread + 2 : 2 * spread - 1} />
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="relative mx-auto aspect-[1/1.38] w-full max-w-[420px] shadow-[0_24px_40px_-22px_rgb(24_42_34/0.55)]">
          <motion.div key={single} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
            <PageView page={pages[single]} n={single + 1} />
          </motion.div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-4">
        <button type="button" onClick={() => go("prev")} disabled={!canPrev} className="flex h-12 w-12 items-center justify-center rounded-sm border border-forest/40 text-forest hover:border-forest disabled:opacity-35" aria-label="Poprzednia strona">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <p className="min-w-36 text-center text-[0.9375rem] text-muted-foreground" aria-live="polite">{label}</p>
        <button type="button" onClick={() => go("next")} disabled={!canNext} className="flex h-12 w-12 items-center justify-center rounded-sm border border-forest/40 text-forest hover:border-forest disabled:opacity-35" aria-label="Następna strona">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
