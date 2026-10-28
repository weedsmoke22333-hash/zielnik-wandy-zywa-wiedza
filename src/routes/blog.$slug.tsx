import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getArticle } from "@/data/articles";
import { getHerb } from "@/data/herbs";
import { getProduct } from "@/data/products";
import { DraftNote, HealthDisclaimer, PageIntro, Precautions, SourceList } from "@/components/site/Editorial";
import { BookMockup } from "@/components/site/BookMockup";
import { breadcrumbs, pageHead } from "@/lib/site";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Nie znaleziono artykułu — Wanda Machocka" }, { name: "robots", content: "noindex" }] };
    const a = loaderData.article;
    const path = `/blog/${params.slug}`;
    return pageHead(a.title, a.excerpt, path, {
      type: "article",
      image: a.image.src,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.excerpt,
          inLanguage: "pl-PL",
          author: { "@type": "Person", name: "Wanda Machocka" },
          citation: a.sources.map((s) => s.url),
        },
        breadcrumbs([["Blog", "/blog"], [a.title, path]]),
      ],
    });
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { article: a } = Route.useLoaderData();
  const product = a.relatedProduct ? getProduct(a.relatedProduct) : undefined;
  const herbs = a.relatedHerbs.map(getHerb).filter((h) => !!h);

  return (
    <article>
      <PageIntro latin={a.category} title={a.title} intro={a.excerpt} crumbs={[{ to: "/blog", label: "Blog" }]}>
        <p className="mt-6 text-[0.9375rem] text-muted-foreground">Wanda Machocka, {a.readingMinutes} min czytania</p>
      </PageIntro>

      <div className="mx-auto mt-12 max-w-[1400px] px-5 md:px-10">
        <div className="relative aspect-[16/8] overflow-hidden rounded-sm print:hidden">
          <img src={a.image.src} alt={a.image.alt} width={a.image.width} height={a.image.height} className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 pb-28 pt-16 md:px-10 lg:grid-cols-12">
        <div className="measure space-y-12 text-lg lg:col-span-7 lg:col-start-2">
          {!a.reviewed && <DraftNote>Tekst przykładowy — czeka na zatwierdzenie przez autorkę.</DraftNote>}
          {a.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-h3">{s.heading}</h2>
              <div className="mt-4 space-y-4">
                {s.paragraphs.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
              </div>
            </section>
          ))}
          <Precautions items={a.precautions} />
          <SourceList sources={a.sources} />
          <HealthDisclaimer />
        </div>

        <aside className="space-y-12 lg:col-span-3 lg:col-start-10 print:hidden">
          {herbs.length > 0 && (
            <div>
              <h2 className="font-display text-2xl">Rośliny w tekście</h2>
              <ul className="mt-4 space-y-3">
                {herbs.map((h) => (
                  <li key={h.slug}>
                    <Link to="/ziola-i-rosliny/$slug" params={{ slug: h.slug }} className="group block">
                      <span className="latin block text-lg group-hover:text-forest">{h.latin}</span>
                      <span className="text-[0.9375rem] text-brown">{h.polish}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {product && (
            <Link to="/ebooki/$slug" params={{ slug: product.slug }} className="group block border-t border-border pt-8">
              <p className="text-[0.9375rem] text-muted-foreground">Więcej w poradniku</p>
              <div className="mt-6 max-w-[180px]"><BookMockup product={product} interactive={false} /></div>
              <p className="mt-8 font-display text-xl group-hover:text-forest">{product.title}</p>
              <p className="mt-1 font-semibold">{product.priceZl} zł</p>
            </Link>
          )}
        </aside>
      </div>
    </article>
  );
}
