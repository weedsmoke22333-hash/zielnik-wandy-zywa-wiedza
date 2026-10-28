import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DRUG_GROUPS, interactionHerbs, interactions, type DrugGroup } from "@/data/interactions";
import { PageIntro, SourceList } from "@/components/site/Editorial";
import { pageHead } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ziola-a-leki")({
  head: () =>
    pageHead(
      "Zioła a leki — na co uważać",
      "Wyszukiwarka dobrze udokumentowanych interakcji ziół z lekami: dziurawiec, miłorząb, lukrecja, waleriana i inne. Brak wpisu nie oznacza bezpieczeństwa.",
      "/ziola-a-leki",
    ),
  component: InteractionsPage,
});

function InteractionsPage() {
  const [herb, setHerb] = useState("");
  const [group, setGroup] = useState<DrugGroup | "">("");

  const results = useMemo(
    () => interactions.filter((i) => (!herb || i.herb === herb) && (!group || i.group === group)),
    [herb, group],
  );
  const chosen = herb || group;
  const sources = Array.from(new Map(results.flatMap((r) => r.sources).map((s) => [s.url, s])).values());

  return (
    <>
      <PageIntro
        latin="Interactiones"
        title="Zioła a leki — na co uważać"
        intro="Wybierz zioło albo grupę leków, które przyjmujesz. Zobaczysz dobrze opisane ostrzeżenia i to, co warto zrobić."
      >
        <div className="measure mt-8 border-l-4 border-[#9b3b2a] bg-paper px-6 py-5">
          <p className="text-lg font-semibold">To nie jest „sprawdzarka bezpieczeństwa”.</p>
          <p className="mt-2">
            Lista zawiera tylko wybrane, dobrze udokumentowane interakcje. <strong>Brak wpisu nie oznacza, że połączenie jest bezpieczne.</strong>{" "}
            Przed rozpoczęciem stosowania zioła zawsze zapytaj lekarza lub farmaceutę.
          </p>
        </div>
      </PageIntro>

      <section aria-label="Wyszukiwarka" className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
        <div className="grid gap-6 border-y border-border py-8 md:grid-cols-2">
          <div>
            <label htmlFor="ia-herb" className="font-semibold">Zioło lub suplement</label>
            <select id="ia-herb" value={herb} onChange={(e) => setHerb(e.target.value)} className="mt-3 min-h-14 w-full rounded-sm border border-input bg-white px-4 text-lg">
              <option value="">Wszystkie zioła</option>
              {interactionHerbs.map((h) => <option key={h.name} value={h.name}>{h.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="ia-group" className="font-semibold">Leki, które przyjmuję</label>
            <select id="ia-group" value={group} onChange={(e) => setGroup(e.target.value as DrugGroup | "")} className="mt-3 min-h-14 w-full rounded-sm border border-input bg-white px-4 text-lg">
              <option value="">Wszystkie grupy leków</option>
              {(Object.keys(DRUG_GROUPS) as DrugGroup[]).map((g) => <option key={g} value={g}>{DRUG_GROUPS[g].label}</option>)}
            </select>
            {group && <p className="mt-2 text-[0.9375rem] text-muted-foreground">{DRUG_GROUPS[group].examples}</p>}
          </div>
        </div>

        <div aria-live="polite" className="mt-10">
          {results.length === 0 ? (
            <div className="border border-dashed border-brown/50 p-8 md:p-10">
              <p className="font-display text-2xl">Nie mamy w bazie opisu takiego połączenia.</p>
              <p className="measure mt-3 text-lg">
                <strong>To nie znaczy, że jest bezpieczne.</strong> Wiele interakcji nie zostało dobrze zbadanych. Zapytaj farmaceutę —
                najlepiej z listą wszystkich leków, ziół i suplementów, które przyjmujesz.
              </p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground">{chosen ? `Znalezione ostrzeżenia: ${results.length}` : `Wszystkie ostrzeżenia w bazie: ${results.length}`}</p>
              <ul className="mt-6 grid gap-6 lg:grid-cols-2">
                {results.map((r) => (
                  <li key={`${r.herb}-${r.group}`} className="flex flex-col border border-border bg-white/60 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className={cn("rounded-sm px-2.5 py-1 text-[0.8125rem] font-semibold", r.severity === "istotna" ? "bg-[#9b3b2a] text-ivory" : "bg-paper text-brown ring-1 ring-brown/30")}>
                        {r.severity === "istotna" ? "Istotna interakcja" : "Zachowaj ostrożność"}
                      </span>
                      <span className="text-[0.9375rem] text-muted-foreground">{DRUG_GROUPS[r.group].label}</span>
                    </div>
                    <h2 className="mt-4 font-display text-2xl">
                      {r.herbSlug ? (
                        <Link to="/ziola-i-rosliny/$slug" params={{ slug: r.herbSlug }} className="link-underline">{r.herb}</Link>
                      ) : r.herb}{" "}
                      <span className="latin text-lg text-muted-foreground">{r.herbLatin}</span>
                    </h2>
                    <p className="mt-3">{r.effect}</p>
                    <p className="mt-3 border-t border-border pt-3 font-semibold text-forest">{r.advice}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        {sources.length > 0 && <SourceList sources={sources} className="mt-14" />}
      </section>
    </>
  );
}
