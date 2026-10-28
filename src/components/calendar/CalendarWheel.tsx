import { Link } from "@tanstack/react-router";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { harvestFor, MONTHS_PL, MONTHS_PL_LOC, type Month } from "@/data/herbs";
import { cn } from "@/lib/utils";

const SIZE = 560;
const C = SIZE / 2;
const R_OUT = 262;
const R_IN = 176;
const STEP = 360 / 12;
const SHORT = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];

// Rounded so server (Node) and browser trig results serialise identically — avoids hydration mismatch.
const round = (n: number) => Math.round(n * 100) / 100;

/** SVG arc path for a ring segment centred on angle `a` (deg, 0 = top, clockwise). */
function segment(a: number, gap = 1.2) {
  const a0 = ((a - STEP / 2 + gap) - 90) * (Math.PI / 180);
  const a1 = ((a + STEP / 2 - gap) - 90) * (Math.PI / 180);
  const p = (r: number, t: number) => `${round(C + r * Math.cos(t))} ${round(C + r * Math.sin(t))}`;
  return `M ${p(R_OUT, a0)} A ${R_OUT} ${R_OUT} 0 0 1 ${p(R_OUT, a1)} L ${p(R_IN, a1)} A ${R_IN} ${R_IN} 0 0 0 ${p(R_IN, a0)} Z`;
}
const polar = (r: number, aDeg: number) => {
  const t = (aDeg - 90) * (Math.PI / 180);
  return { x: round(C + r * Math.cos(t)), y: round(C + r * Math.sin(t)) };
};

const counts = Array.from({ length: 12 }, (_, i) => harvestFor((i + 1) as Month).length);

const WINTER_TASKS = [
  "Przejrzyj zapasy suszu — to, co ma ponad rok, zwykle straciło aromat.",
  "Opisz słoiki: nazwa rośliny, część, data zbioru.",
  "Zaplanuj zielnik na wiosnę: co posadzić na parapecie, a co w ogrodzie.",
  "Zamów nasiona nagietka, rumianku i melisy — wysiew zaczyna się w marcu i kwietniu.",
];

export function CalendarWheel({ variant = "full" }: { variant?: "full" | "compact" }) {
  const reduced = useReducedMotion();
  const [month, setMonth] = useState<Month>(10);
  const [today, setToday] = useState<Month | null>(null);
  const rotation = useMotionValue(-(10 - 1) * STEP);
  const counter = useTransform(rotation, (r) => -r);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ startAngle: number; startRot: number; moved: boolean } | null>(null);

  // Client-only: today's month (avoids SSR/CSR mismatch at month boundaries).
  useEffect(() => {
    const m = (new Date().getMonth() + 1) as Month;
    setToday(m);
    select(m, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function select(m: Month, animated = true) {
    setMonth(m);
    const target = -(m - 1) * STEP;
    // rotate the shortest way round
    const current = rotation.get();
    let delta = ((target - current) % 360 + 540) % 360 - 180;
    if (Math.abs(delta) < 0.01) delta = 0;
    if (!animated || reduced) rotation.set(current + delta);
    else animate(rotation, current + delta, { type: "spring", stiffness: 70, damping: 16 });
  }
  const shift = (d: number) => select((((month - 1 + d + 12) % 12) + 1) as Month);

  function angleAt(e: PointerEvent) {
    const r = svgRef.current!.getBoundingClientRect();
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
  }
  function onPointerDown(e: PointerEvent<SVGSVGElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { startAngle: angleAt(e), startRot: rotation.get(), moved: false };
  }
  function onPointerMove(e: PointerEvent<SVGSVGElement>) {
    if (!drag.current) return;
    let d = angleAt(e) - drag.current.startAngle;
    d = ((d + 540) % 360) - 180;
    if (Math.abs(d) > 3 && !drag.current.moved) {
      drag.current.moved = true;
      svgRef.current?.setPointerCapture(e.pointerId);
    }
    if (drag.current.moved) rotation.set(drag.current.startRot + d);
  }
  function onPointerUp() {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;
    const idx = ((Math.round(-rotation.get() / STEP) % 12) + 12) % 12;
    select((idx + 1) as Month);
  }
  function onKey(e: KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); shift(1); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); shift(-1); }
  }

  const items = harvestFor(month);
  const list = variant === "compact" ? items.slice(0, 6) : items;

  return (
    <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-6">
        <div className="relative mx-auto aspect-square w-full max-w-[560px]">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="h-full w-full touch-none select-none"
            role="group"
            aria-label="Koło roku. Przeciągnij, aby obrócić, albo wybierz miesiąc."
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKey}
          >
            {/* fixed pointer at 12 o'clock */}
            <path d={`M ${C - 9} 8 L ${C + 9} 8 L ${C} 24 Z`} className="fill-copper" />
            <motion.g style={{ rotate: rotation, transformOrigin: `${C}px ${C}px` }}>
              <circle cx={C} cy={C} r={R_OUT + 10} className="fill-none stroke-deep/15" strokeWidth={1} />
              <circle cx={C} cy={C} r={R_IN - 12} className="fill-none stroke-deep/10" strokeWidth={1} strokeDasharray="2 6" />
              {SHORT.map((label, i) => {
                const m = (i + 1) as Month;
                const a = i * STEP;
                const active = m === month;
                const lp = polar((R_OUT + R_IN) / 2, a);
                const n = counts[i] ?? 0;
                return (
                  <g
                    key={label}
                    role="button"
                    tabIndex={0}
                    aria-pressed={active}
                    aria-label={`${MONTHS_PL[i]}: ${n === 0 ? "bez zbiorów" : `${n} do zebrania`}`}
                    className="cursor-pointer outline-none [&:focus-visible>path]:stroke-copper [&:focus-visible>path]:stroke-[3]"
                    onClick={() => !drag.current?.moved && select(m)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(m); }
                    }}
                  >
                    <path
                      d={segment(a)}
                      className={cn(
                        "transition-colors duration-500",
                        active ? "fill-forest" : n === 0 ? "fill-sage/60 hover:fill-sage" : "fill-sage hover:fill-[#cfd8c4]",
                      )}
                    />
                    {/* harvest density: one dot per plant */}
                    {Array.from({ length: n }, (_, k) => {
                      const spread = Math.min(STEP - 8, n * 2.6);
                      const dotA = a - spread / 2 + (n === 1 ? spread / 2 : (k * spread) / (n - 1));
                      const d = polar(R_IN + 14, dotA);
                      return <circle key={k} cx={d.x} cy={d.y} r={2.6} className={active ? "fill-copper" : "fill-forest/55"} />;
                    })}
                    <motion.text
                      x={lp.x}
                      y={lp.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ rotate: counter, transformOrigin: `${lp.x}px ${lp.y}px` }}
                      className={cn("pointer-events-none font-display text-[26px]", active ? "fill-ivory" : "fill-deep")}
                    >
                      {label}
                    </motion.text>
                    {today === m && (
                      <circle cx={polar(R_OUT + 10, a).x} cy={polar(R_OUT + 10, a).y} r={5} className="fill-copper stroke-ivory" strokeWidth={2} />
                    )}
                  </g>
                );
              })}
            </motion.g>
          </svg>
          {/* centre */}
          <div className="pointer-events-none absolute inset-[34%] flex flex-col items-center justify-center text-center">
            <p className="font-display text-[clamp(1.9rem,4.4vw,2.9rem)] leading-none">{MONTHS_PL[month - 1]}</p>
            <p className="mt-2 text-[0.9375rem] text-muted-foreground">
              {items.length === 0 ? "czas odpoczynku" : `${items.length} ${items.length === 1 ? "zbiór" : items.length < 5 ? "zbiory" : "zbiorów"}`}
            </p>
            {today === month && <p className="mt-1 text-[0.8125rem] font-semibold text-brown">teraz</p>}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button type="button" onClick={() => shift(-1)} className="flex h-12 w-12 items-center justify-center rounded-sm border border-forest/40 text-forest hover:border-forest" aria-label="Poprzedni miesiąc">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p className="min-w-40 text-center text-[0.9375rem] text-muted-foreground">Przeciągnij koło lub użyj strzałek</p>
          <button type="button" onClick={() => shift(1)} className="flex h-12 w-12 items-center justify-center rounded-sm border border-forest/40 text-forest hover:border-forest" aria-label="Następny miesiąc">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="lg:col-span-6" aria-live="polite">
        {items.length === 0 ? (
          <div className="paper-grain specimen-shadow border border-brown/30 bg-ivory p-7 md:p-9">
            <p className="latin text-2xl text-brown">Hiems</p>
            <h3 className="text-h3 mt-2">Zimą zielnik odpoczywa</h3>
            <p className="mt-3 text-muted-foreground">W {MONTHS_PL_LOC[month - 1]} nie zbieramy ziół. To dobry czas na porządki i plany:</p>
            <ul className="mt-5 list-disc space-y-2 pl-5 marker:text-copper">
              {WINTER_TASKS.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {list.map(({ herb, part, note }) => (
              <li key={`${herb.slug}-${part}`}>
                <Link
                  to="/ziola-i-rosliny/$slug"
                  params={{ slug: herb.slug }}
                  className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-4"
                >
                  <span>
                    <span className="latin block text-xl text-deep group-hover:text-forest">{herb.latin}</span>
                    <span className="font-semibold text-brown">{herb.polish}</span>
                  </span>
                  <span className="rounded-sm border border-forest/30 px-2.5 py-0.5 text-[0.875rem] font-semibold text-forest">{part}</span>
                  {note && <span className="col-span-2 text-[0.9375rem] text-muted-foreground">{note}</span>}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {variant === "compact" && (
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link to="/kalendarz-zielarski" className="inline-flex min-h-14 items-center rounded-sm bg-forest px-7 font-semibold text-ivory transition-colors hover:bg-deep">
              Otwórz pełny kalendarz
            </Link>
            {items.length > list.length && (
              <span className="text-muted-foreground">i jeszcze {items.length - list.length} w pełnym kalendarzu</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
