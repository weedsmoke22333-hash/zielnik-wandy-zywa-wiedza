import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { herbs, MONTHS_PL, EVIDENCE_LABEL, type EvidenceLevel, type Month, type PlantPart } from "@/data/herbs";
import { HerbCard } from "@/components/atlas/HerbCard";
import { HealthDisclaimer, PageIntro } from "@/components/site/Editorial";
import { pageHead } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ziola-i-rosliny/")({
  head: () =>
    pageHead(
      "Atlas roślin",
      "Karty ziół: jak je rozpoznać, kiedy zbierać, co mówi tradycja i monografie EMA, przeciwwskazania i interakcje z lekami.",
      "/ziola-i-rosliny",
    ),
  component: AtlasPage,
});

const PARTS: PlantPart[] = ["liść", "kwiat", "ziele", "owoc", "korzeń", "pęd"];
const norm = (s: string) => s.toLocaleLowerCase("pl").normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/ł/g, "l");

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-sm border px-4 text-[0.9375rem] font-semibold transition-colors",
        active ? "border-forest bg-forest text-ivory" : "border-forest/35 text-forest hover:border-forest",
      )}
    >
      {children}
    </button>
  );
}

function AtlasPage() {
  const [q, setQ] = useState("");
  const [part, setPart] = useState<PlantPart | null>(null);
  const [evidence, setEvidence] = useState<EvidenceLevel | null>(null);
  const [month, setMonth] = useState<Month | null>(null);

  const list = useMemo(() => {
    const nq = norm(q.trim());
    return herbs.filter(
      (h) =>
        (!nq || norm(`${h.latin} ${h.polish} ${h.family}`).includes(nq)) &&
        (!part || h.harvest.some((x) => x.part === part)) &&
        (!evidence || h.evidence === evidence) &&
        (!month || h.harvest.some((x) => x.months.includes(month))),
    );
  }, [q, part, evidence, month]);

  const reset = () => { setQ(""); setPart(null); setEvidence(null); setMonth(null); };
  const filtered = q || part || evidence || month;

  return (
    <>
      <PageIntro
        latin="Herbarium"
        title="Atlas roślin"
        intro="Każda karta mówi, jak roślinę rozpoznać, kiedy ją zbierać i co na jej temat mówi tradycja oraz monografie Europejskiej Agencji Leków — razem z przeciwwskazaniami i interakcjami."
      />

      <section aria-label="Filtry atlasu" className="mx-auto mt-14 max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-8 border-y border-border py-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <label htmlFor="atlas-q" className="font-semibold">Szukaj rośliny</label>
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <input
                id="atlas-q"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="np. melisa, Tilia"
                className="min-h-14 w-full rounded-sm border border-input bg-white pl-12 pr-4 text-lg"
              />
            </div>
            <label htmlFor="atlas-month" className="mt-6 block font-semibold">Do zbioru w miesiącu</label>
            <select
              id="atlas-month"
              value={month ?? ""}
              onChange={(e) => setMonth(e.target.value ? (Number(e.target.value) as Month) : null)}
              className="mt-3 min-h-14 w-full rounded-sm border border-input bg-white px-4 text-lg"
            >
              <option value="">Dowolny miesiąc</option>
              {MONTHS_PL.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div className="lg:col-span-8">
            <p className="font-semibold">Zbierana część</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {PARTS.map((p) => <Chip key={p} active={part === p} onClick={() => setPart(part === p ? null : p)}>{p}</Chip>)}
            </div>
            <p className="mt-6 font-semibold">Poziom dowodów</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(Object.keys(EVIDENCE_LABEL) as EvidenceLevel[]).map((e) => (
                <Chip key={e} active={evidence === e} onClick={() => setEvidence(evidence === e ? null : e)}>{EVIDENCE_LABEL[e].label}</Chip>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4" aria-live="polite">
          <p className="text-muted-foreground">{list.length === herbs.length ? `${herbs.length} roślin w atlasie` : `Pasujące rośliny: ${list.length} z ${herbs.length}`}</p>
          {filtered && <button type="button" onClick={reset} className="link-underline font-semibold text-forest">Wyczyść filtry</button>}
        </div>
      </section>

      <section aria-label="Rośliny" className="mx-auto max-w-[1400px] px-5 pb-28 pt-10 md:px-10">
        {list.length === 0 ? (
          <div className="border border-dashed border-brown/40 p-10 text-center">
            <p className="text-h3 font-display">Żadna roślina nie spełnia tych warunków.</p>
            <button type="button" onClick={reset} className="mt-6 inline-flex min-h-12 items-center rounded-sm bg-forest px-6 font-semibold text-ivory">Pokaż wszystkie rośliny</button>
          </div>
        ) : (
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((h) => <li key={h.slug}><HerbCard herb={h} /></li>)}
          </ul>
        )}

        <div className="mt-24 grid gap-10 border-t border-border pt-12 md:grid-cols-2">
          <Link to="/trujace-sobowtory" className="group block">
            <p className="latin text-xl text-brown">Cave</p>
            <h2 className="text-h3 mt-2 group-hover:text-forest">Trujące sobowtóry</h2>
            <p className="mt-2 text-muted-foreground">Rośliny, które łatwo pomylić z jadalnymi — i jak je odróżnić.</p>
          </Link>
          <Link to="/ziola-a-leki" className="group block">
            <p className="latin text-xl text-brown">Interactiones</p>
            <h2 className="text-h3 mt-2 group-hover:text-forest">Zioła a leki — na co uważać</h2>
            <p className="mt-2 text-muted-foreground">Dobrze udokumentowane ostrzeżenia dla popularnych grup leków.</p>
          </Link>
        </div>
        <HealthDisclaimer className="mt-14" />
      </section>
    </>
  );
}
