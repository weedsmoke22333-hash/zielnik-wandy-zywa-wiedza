import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getHerb, MONTHS_PL, EVIDENCE_LABEL, type Herb } from "@/data/herbs";
import { getLookalike } from "@/data/lookalikes";
import { articles } from "@/data/articles";
import { products } from "@/data/products";
import { interactions } from "@/data/interactions";
import { EvidenceBadge, HealthDisclaimer, HerbLabel, PageIntro, Precautions, SourceList } from "@/components/site/Editorial";
import { breadcrumbs, pageHead } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ziola-i-rosliny/$slug")({
  loader: ({ params }) => {
    const herb = getHerb(params.slug);
    if (!herb) throw notFound();
    return { herb };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Nie znaleziono rośliny — Wanda Machocka" }, { name: "robots", content: "noindex" }] };
    const h = loaderData.herb;
    const path = `/ziola-i-rosliny/${params.slug}`;
    return pageHead(
      `${cap(h.polish)} (${h.latin})`,
      `${cap(h.polish)}: jak rozpoznać, kiedy zbierać, tradycyjne zastosowanie, przeciwwskazania i interakcje z lekami.`,
      path,
      {
        type: "article",
        ...(h.image ? { image: h.image.src } : {}),
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `${cap(h.polish)} (${h.latin})`,
            inLanguage: "pl-PL",
            author: { "@type": "Person", name: "Wanda Machocka" },
            about: { "@type": "Thing", name: h.latin, alternateName: h.polish },
            citation: h.sources.map((s) => s.url),
          },
          breadcrumbs([["Atlas roślin", "/ziola-i-rosliny"], [cap(h.polish), path]]),
        ],
      },
    );
  },
  component: HerbPage,
});

const cap = (s: string) => s.charAt(0).toLocaleUpperCase("pl") + s.slice(1);

function HarvestStrip({ herb }: { herb: Herb }) {
  return (
    <div>
      <div className="grid grid-cols-12 gap-1" role="img" aria-label={`Terminy zbioru: ${herb.harvest.map((x) => `${x.part} — ${x.months.map((m) => MONTHS_PL[m - 1]).join(", ")}`).join("; ")}`}>
        {MONTHS_PL.map((m, i) => {
          const parts = herb.harvest.filter((x) => x.months.includes((i + 1) as never)).map((x) => x.part);
          return (
            <div key={m} className="text-center">
              <div className={cn("h-10 rounded-sm", parts.length ? "bg-forest" : "bg-sage/70")} title={parts.join(", ")} />
              <span className="mt-1.5 block text-[0.75rem] text-muted-foreground">{m.slice(0, 3)}</span>
            </div>
          );
        })}
      </div>
      <ul className="mt-6 space-y-2">
        {herb.harvest.map((x) => (
          <li key={`${x.part}-${x.months.join()}`}>
            <span className="font-semibold">{cap(x.part)}:</span> {x.months.map((m) => MONTHS_PL[m - 1]).join(", ")}
            {x.note && <span className="text-muted-foreground"> — {x.note}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function HerbPage() {
  const { herb } = Route.useLoaderData();
  const look = herb.lookalike ? getLookalike(herb.lookalike) : undefined;
  const related = articles.filter((a) => a.relatedHerbs.includes(herb.slug));
  const relatedProducts = products.filter((p) => p.relatedHerbs.includes(herb.slug));
  const herbInteractions = interactions.filter((i) => i.herbSlug === herb.slug);

  return (
    <article>
      <PageIntro latin={herb.latin} title={cap(herb.polish)} crumbs={[{ to: "/ziola-i-rosliny", label: "Atlas roślin" }]}>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <EvidenceBadge level={herb.evidence} />
          <span className="text-muted-foreground">{herb.family}</span>
        </div>
      </PageIntro>

      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 pb-28 pt-14 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm specimen-shadow">
              {herb.image ? (
                <img src={herb.image.src} alt={herb.image.alt} width={herb.image.width} height={herb.image.height} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <HerbLabel latin={herb.latin} polish={herb.polish} family={herb.family} size="lg" />
              )}
            </div>
            {!herb.image && <p className="mt-3 text-[0.875rem] text-muted-foreground">Zdjęcie tej rośliny pojawi się wkrótce.</p>}
          </div>
        </div>

        <div className="measure space-y-14 lg:col-span-6 lg:col-start-7">
          <section aria-labelledby="rozpoznac">
            <h2 id="rozpoznac" className="text-h3">Jak rozpoznać</h2>
            <p className="mt-4">{herb.recognize}</p>
            <p className="mt-3 text-muted-foreground">{herb.habitat}</p>
          </section>

          <section aria-labelledby="zbior">
            <h2 id="zbior" className="text-h3">Kiedy zbierać</h2>
            <div className="mt-5"><HarvestStrip herb={herb} /></div>
            {herb.legalNote && <p className="mt-6 border-l-4 border-copper bg-paper px-5 py-4 font-semibold">{herb.legalNote}</p>}
          </section>

          <section aria-labelledby="tradycja">
            <h2 id="tradycja" className="text-h3">{herb.evidence === "kulinarna" ? "Zastosowanie" : "Co mówi tradycja i monografie"}</h2>
            <p className="mt-4 text-lg">{herb.traditionalUse}</p>
            {herb.evidence !== "kulinarna" && (
              <p className="mt-3 text-[0.9375rem] text-muted-foreground">
                <span className="font-semibold text-deep">{EVIDENCE_LABEL[herb.evidence].label}:</span> {EVIDENCE_LABEL[herb.evidence].description}
              </p>
            )}
            {herb.evidenceNote && <p className="mt-3 text-[0.9375rem] text-muted-foreground">{herb.evidenceNote}</p>}
          </section>

          <Precautions title="Przeciwwskazania i ostrożność" items={herb.contraindications} />

          <section aria-labelledby="interakcje">
            <h2 id="interakcje" className="text-h3">Interakcje z lekami</h2>
            <p className="mt-4">{herb.interactions}</p>
            {herbInteractions.length > 0 && (
              <ul className="mt-5 divide-y divide-border border-y border-border">
                {herbInteractions.map((i) => (
                  <li key={i.group} className="py-3">
                    <span className={cn("mr-2 rounded-sm px-2 py-0.5 text-[0.8125rem] font-semibold", i.severity === "istotna" ? "bg-[#9b3b2a] text-ivory" : "bg-paper text-brown")}>
                      {i.severity === "istotna" ? "Istotna" : "Ostrożność"}
                    </span>
                    {i.effect}
                  </li>
                ))}
              </ul>
            )}
            <Link to="/ziola-a-leki" className="link-underline mt-5 inline-block font-semibold text-forest">Sprawdź w wyszukiwarce „Zioła a leki”</Link>
          </section>

          {look && (
            <section aria-labelledby="sobowtor" className="border border-[#9b3b2a]/40 p-6 md:p-8">
              <p className="latin text-lg text-[#9b3b2a]">Cave</p>
              <h2 id="sobowtor" className="text-h3 mt-1">Uwaga na trującego sobowtóra</h2>
              <p className="mt-3">
                Łatwo pomylić z: {look.dangerous.map((d) => `${d.polish} (${d.latin})`).join(", ")}. {look.rule}
              </p>
              <Link to="/trujace-sobowtory" hash={look.slug} className="link-underline mt-4 inline-block font-semibold text-forest">Jak je odróżnić</Link>
            </section>
          )}

          <SourceList sources={herb.sources} />
          <HealthDisclaimer />

          {(related.length > 0 || relatedProducts.length > 0) && (
            <section aria-labelledby="wiecej" className="border-t border-border pt-10">
              <h2 id="wiecej" className="text-h3">Czytaj dalej</h2>
              <ul className="mt-5 space-y-3">
                {related.map((a) => (
                  <li key={a.slug}><Link to="/blog/$slug" params={{ slug: a.slug }} className="link-underline font-display text-xl">{a.title}</Link></li>
                ))}
                {relatedProducts.map((p) => (
                  <li key={p.slug}><Link to="/ebooki/$slug" params={{ slug: p.slug }} className="link-underline font-display text-xl">E-book: {p.title}</Link></li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </article>
  );
}
