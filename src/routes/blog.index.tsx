import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { articles } from "@/data/articles";
import { PageIntro } from "@/components/site/Editorial";
import { pageHead } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog/")({
  head: () => pageHead("Blog", "Artykuły o roślinach, tradycji zielarskiej, zdrowych nawykach i odpowiedzialnym korzystaniu z ziół.", "/blog"),
  component: BlogPage,
});

function BlogPage() {
  const categories = Array.from(new Set(articles.map((a) => a.category)));
  const [cat, setCat] = useState<string | null>(null);
  const list = useMemo(() => articles.filter((a) => !cat || a.category === cat), [cat]);
  const [lead, ...rest] = list;

  return (
    <>
      <PageIntro latin="Folia" title="Blog" intro="O roślinach, tradycji i codziennych nawykach — zawsze z przeciwwskazaniami i źródłami." />
      <section className="mx-auto max-w-[1400px] px-5 pb-28 pt-12 md:px-10">
        <div role="group" aria-label="Kategorie" className="flex flex-wrap gap-2 border-y border-border py-6">
          {[null, ...categories].map((c) => (
            <button
              key={c ?? "all"}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={cn(
                "min-h-11 rounded-sm border px-4 text-[0.9375rem] font-semibold transition-colors",
                cat === c ? "border-forest bg-forest text-ivory" : "border-forest/35 text-forest hover:border-forest",
              )}
            >
              {c ?? "Wszystkie"}
            </button>
          ))}
        </div>

        {lead && (
          <Link to="/blog/$slug" params={{ slug: lead.slug }} className="group mt-14 grid items-center gap-10 lg:grid-cols-12">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm lg:col-span-7">
              <img src={lead.image.src} alt={lead.image.alt} width={lead.image.width} height={lead.image.height} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]" />
            </div>
            <div className="lg:col-span-5">
              <p className="latin text-lg text-brown">{lead.category}</p>
              <h2 className="text-h2 mt-2 group-hover:text-forest">{lead.title}</h2>
              <p className="measure mt-5 text-lg text-muted-foreground">{lead.excerpt}</p>
              <p className="mt-5 text-[0.9375rem] text-muted-foreground">{lead.readingMinutes} min czytania</p>
            </div>
          </Link>
        )}

        <ul className="mt-20 grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((a) => (
            <li key={a.slug}>
              <Link to="/blog/$slug" params={{ slug: a.slug }} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                  <img src={a.image.src} alt={a.image.alt} width={a.image.width} height={a.image.height} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05]" />
                </div>
                <p className="latin mt-5 text-[0.9375rem] text-brown">{a.category}</p>
                <h2 className="mt-1 font-display text-2xl leading-tight group-hover:text-forest">{a.title}</h2>
                <p className="mt-2 text-muted-foreground">{a.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
