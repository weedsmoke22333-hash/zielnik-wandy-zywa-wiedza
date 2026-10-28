import { Link } from "@tanstack/react-router";
import { bundle, bundleSeparateTotal, singleProducts } from "@/data/products";
import { BookMockup } from "@/components/site/BookMockup";
import { RevealHeading } from "@/components/site/RevealHeading";
import { useRichMotion } from "@/hooks/use-motion-prefs";

export function FeaturedBooks() {
  const { rich } = useRichMotion();
  return (
    <section aria-labelledby="ebooki-naglowek" data-tone="sage" className="py-28 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <RevealHeading id="ebooki-naglowek" className="text-h2 max-w-[16ch]">Wiedza, do której możesz wracać.</RevealHeading>
          <p className="border-l-2 border-brown/50 pl-4 text-[0.9375rem] text-muted-foreground">
            Wersje przykładowe — publikacja wkrótce
          </p>
        </div>
        <ul className="mt-20 grid gap-x-10 gap-y-20 md:grid-cols-3">
          {singleProducts.map((p, i) => (
            <li key={p.slug} className={i === 1 ? "md:mt-16" : ""}>
              <Link to="/ebooki/$slug" params={{ slug: p.slug }} className="group block rounded-sm focus-visible:outline-offset-8">
                <BookMockup product={p} interactive={rich} />
                <div className="mt-12">
                  <h3 className="text-h3">{p.title}</h3>
                  <p className="mt-3 text-muted-foreground">{p.description}</p>
                  <p className="mt-4 flex items-baseline gap-4 font-semibold">
                    <span className="text-xl text-deep">{p.priceZl} zł</span>
                    <span className="text-sm font-medium text-muted-foreground">{p.format}</span>
                  </p>
                  <span className="link-underline mt-4 inline-block font-semibold text-forest">Zobacz e-book</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {bundle && (
          <Link
            to="/ebooki/$slug"
            params={{ slug: bundle.slug }}
            className="group mt-24 grid items-center gap-8 border-t border-deep/15 pt-12 md:grid-cols-12"
          >
            <div className="md:col-span-7">
              <p className="latin text-xl text-brown">Herbarium</p>
              <h3 className="text-h3 mt-2">Wszystkie trzy poradniki w pakiecie</h3>
              <p className="measure mt-3 text-muted-foreground">
                Zioła, codzienne nawyki i domowy zielnik razem. Osobno kosztują {bundleSeparateTotal(bundle)} zł.
              </p>
            </div>
            <div className="flex items-baseline gap-5 md:col-span-5 md:justify-end">
              <span className="text-lg text-muted-foreground line-through decoration-brown/60">{bundleSeparateTotal(bundle)} zł</span>
              <span className="font-display text-5xl">{bundle.priceZl} zł</span>
              <span className="link-underline font-semibold text-forest">Zobacz pakiet</span>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}
