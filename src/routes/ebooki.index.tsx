import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { bundleSeparateTotal, CATEGORY_LABEL, products, type ProductCategory } from "@/data/products";
import { BookMockup } from "@/components/site/BookMockup";
import { DraftNote, PageIntro } from "@/components/site/Editorial";
import { useRichMotion } from "@/hooks/use-motion-prefs";
import { pageHead } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ebooki/")({
  head: () => pageHead("E-booki", "Poradniki o ziołach, codziennych nawykach i domowym zielniku w formacie PDF — do czytania na ekranie i do druku.", "/ebooki"),
  component: ShopPage,
});

const norm = (s: string) => s.toLocaleLowerCase("pl").normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/ł/g, "l");

function ShopPage() {
  const { rich } = useRichMotion();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<ProductCategory | null>(null);
  const list = useMemo(() => {
    const nq = norm(q.trim());
    return products.filter((p) => (!cat || p.category === cat) && (!nq || norm(`${p.title} ${p.description} ${p.toc.join(" ")}`).includes(nq)));
  }, [q, cat]);

  return (
    <>
      <PageIntro latin="Libri" title="E-booki" intro="Poradniki, do których możesz wracać: na ekranie, na czytniku albo wydrukowane i wpięte do segregatora.">
        <div className="mt-6"><DraftNote>Wersje przykładowe — publikacja wkrótce.</DraftNote></div>
      </PageIntro>

      <section aria-label="Wyszukiwanie e-booków" className="mx-auto mt-14 max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col gap-6 border-y border-border py-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full max-w-md">
            <label htmlFor="shop-q" className="font-semibold">Szukaj w poradnikach</label>
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <input id="shop-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="np. suszenie, sen" className="min-h-14 w-full rounded-sm border border-input bg-white pl-12 pr-4 text-lg" />
            </div>
          </div>
          <div role="group" aria-label="Kategoria" className="flex flex-wrap gap-2">
            {([null, ...Object.keys(CATEGORY_LABEL)] as (ProductCategory | null)[]).map((c) => (
              <button
                key={c ?? "all"}
                type="button"
                aria-pressed={cat === c}
                onClick={() => setCat(c)}
                className={cn("min-h-11 rounded-sm border px-4 text-[0.9375rem] font-semibold transition-colors", cat === c ? "border-forest bg-forest text-ivory" : "border-forest/35 text-forest hover:border-forest")}
              >
                {c ? CATEGORY_LABEL[c] : "Wszystkie"}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-4 text-muted-foreground" aria-live="polite">{list.length === 0 ? "Brak pasujących poradników." : `Poradniki: ${list.length}`}</p>
      </section>

      <section aria-label="Lista e-booków" className="mx-auto max-w-[1400px] px-5 pb-28 pt-12 md:px-10">
        {list.length === 0 ? (
          <div className="border border-dashed border-brown/40 p-10 text-center">
            <p className="font-display text-2xl">Nie znalazłam poradnika pasującego do „{q}”.</p>
            <button type="button" onClick={() => { setQ(""); setCat(null); }} className="mt-6 inline-flex min-h-12 items-center rounded-sm bg-forest px-6 font-semibold text-ivory">Pokaż wszystkie</button>
          </div>
        ) : (
          <ul className="grid gap-x-10 gap-y-20 md:grid-cols-2 lg:grid-cols-4">
            {list.map((p) => (
              <li key={p.slug}>
                <Link to="/ebooki/$slug" params={{ slug: p.slug }} className="group block focus-visible:outline-offset-8">
                  <BookMockup product={p} interactive={rich} />
                  <div className="mt-12">
                    <p className="text-[0.875rem] font-semibold text-brown">{CATEGORY_LABEL[p.category]}</p>
                    <h2 className="mt-1 font-display text-2xl leading-tight group-hover:text-forest">{p.title}</h2>
                    <p className="mt-2 text-muted-foreground">{p.description}</p>
                    <p className="mt-4 flex items-baseline gap-3 font-semibold">
                      {p.includes && <span className="text-muted-foreground line-through decoration-brown/60">{bundleSeparateTotal(p)} zł</span>}
                      <span className="text-xl">{p.priceZl} zł</span>
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
