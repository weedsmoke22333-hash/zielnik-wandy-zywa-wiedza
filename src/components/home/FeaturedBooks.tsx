import { Link } from "@tanstack/react-router";
import { products } from "@/data/products";
import { BookMockup } from "@/components/site/BookMockup";
import { useRichMotion } from "@/hooks/use-motion-prefs";

export function FeaturedBooks() {
  const { rich } = useRichMotion();
  return (
    <section aria-labelledby="ebooki-naglowek" className="bg-sage py-28 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="ebooki-naglowek" className="text-h2 max-w-[16ch]">Wiedza, do której możesz wracać.</h2>
          <p className="border-l-2 border-brown/50 pl-4 text-[15px] text-muted-foreground">
            Wersje przykładowe — publikacja wkrótce
          </p>
        </div>
        <ul className="mt-20 grid gap-x-10 gap-y-20 md:grid-cols-3">
          {products.map((p, i) => (
            <li key={p.slug} className={i === 1 ? "md:mt-16" : ""}>
              <Link to="/ebooki/$slug" params={{ slug: p.slug }} className="group block rounded-sm focus-visible:outline-offset-8">
                <BookMockup product={p} interactive={rich} />
                <div className="mt-12">
                  <h3 className="text-h3 link-underline inline">{p.title}</h3>
                  <p className="mt-3 text-muted-foreground">{p.description}</p>
                  <p className="mt-4 flex items-baseline gap-4 font-semibold">
                    <span className="text-xl text-deep">{p.priceZl} zł</span>
                    <span className="text-sm font-medium text-muted-foreground">{p.format}</span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
