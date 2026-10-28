import { createFileRoute, Link } from "@tanstack/react-router";
import { PlaceholderPage, pageHead } from "@/components/site/PlaceholderPage";
import { products } from "@/data/products";

export const Route = createFileRoute("/ebooki/")({
  head: () => pageHead("E-booki", "Poradniki o ziołach i zdrowych nawykach do czytania w formacie PDF.", "/ebooki"),
  component: EbookiPage,
});

function EbookiPage() {
  return (
    <PlaceholderPage latin="Libri" title="E-booki" intro="Poradniki, do których możesz wracać. Wersje przykładowe — publikacja wkrótce.">
      <ul className="mt-12 space-y-4">
        {products.map((p) => (
          <li key={p.slug}>
            <Link to="/ebooki/$slug" params={{ slug: p.slug }} className="link-underline font-display text-2xl">
              {p.title} — {p.priceZl} zł
            </Link>
          </li>
        ))}
      </ul>
    </PlaceholderPage>
  );
}
