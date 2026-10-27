import { createFileRoute, notFound } from "@tanstack/react-router";
import { PlaceholderPage, pageHead } from "@/components/site/PlaceholderPage";
import { BookMockup } from "@/components/site/BookMockup";
import { getProduct } from "@/data/products";

export const Route = createFileRoute("/ebooki/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) =>
    loaderData
      ? pageHead(loaderData.product.title, loaderData.product.description, `/ebooki/${params.slug}`)
      : { meta: [{ title: "E-book niedostępny — Wanda Machocka" }, { name: "robots", content: "noindex" }] },
  component: EbookPage,
});

function EbookPage() {
  const { product } = Route.useLoaderData();
  return (
    <PlaceholderPage latin="Liber" title={product.title} intro={product.description}>
      <div className="mt-14 grid items-center gap-12 md:grid-cols-2">
        <BookMockup product={product} interactive={false} />
        <div>
          <p className="text-3xl font-semibold">{product.priceZl} zł</p>
          <p className="mt-2 text-muted-foreground">Format: {product.format}</p>
          <p className="mt-6 border-l-2 border-brown/50 pl-4 text-muted-foreground">Wersja przykładowa — publikacja wkrótce. Zakup nie jest jeszcze dostępny.</p>
        </div>
      </div>
    </PlaceholderPage>
  );
}
