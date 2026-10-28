import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { bundle, bundleSeparateTotal, CATEGORY_LABEL, getProduct } from "@/data/products";
import { getHerb } from "@/data/herbs";
import { BookMockup } from "@/components/site/BookMockup";
import { DraftNote, PageIntro, Precautions } from "@/components/site/Editorial";
import { WandaVoice } from "@/components/site/WandaVoice";
import { Flipbook } from "@/components/shop/Flipbook";
import { BuyBox } from "@/components/shop/BuyBox";
import { useRichMotion } from "@/hooks/use-motion-prefs";
import { breadcrumbs, pageHead } from "@/lib/site";

export const Route = createFileRoute("/ebooki/$slug")({
  validateSearch: z.object({ anulowano: z.coerce.number().optional() }),
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "E-book niedostępny — Wanda Machocka" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.product;
    const path = `/ebooki/${params.slug}`;
    return pageHead(p.title, p.description, path, {
      type: "product",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.title,
          description: p.description,
          brand: { "@type": "Person", name: "Wanda Machocka" },
          category: "E-book (PDF)",
          // No Offer until the product is published and purchasable — never advertise a price you can't sell at.
          ...(p.status === "published" ? { offers: { "@type": "Offer", price: p.priceZl, priceCurrency: "PLN", availability: "https://schema.org/InStock" } } : {}),
        },
        breadcrumbs([["E-booki", "/ebooki"], [p.title, path]]),
      ],
    });
  },
  component: EbookPage,
});

function EbookPage() {
  const { product: p } = Route.useLoaderData();
  const { anulowano } = Route.useSearch();
  const { rich } = useRichMotion();
  const herbs = p.relatedHerbs.map(getHerb).filter((h) => !!h);
  const included = (p.includes ?? []).map(getProduct).filter((x) => !!x);
  const offerBundle = bundle && !p.includes && bundle.includes?.includes(p.slug) ? bundle : undefined;

  return (
    <>
      <PageIntro latin={CATEGORY_LABEL[p.category]} title={p.title} intro={p.description} crumbs={[{ to: "/ebooki", label: "E-booki" }]} />

      <div className="mx-auto grid max-w-[1400px] gap-16 px-5 pb-12 pt-14 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="mx-auto max-w-[300px] py-6"><BookMockup product={p} interactive={rich} /></div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          {p.status === "draft" && <DraftNote>Wersja przykładowa — treść i spis rozdziałów mogą się jeszcze zmienić.</DraftNote>}
          <div className="measure mt-6 space-y-4 text-lg">
            {p.longDescription.map((t) => <p key={t.slice(0, 30)}>{t}</p>)}
          </div>
          <div className="mt-10"><BuyBox product={p} cancelled={anulowano === 1} /></div>
          <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6 text-[0.9375rem]">
            <div><dt className="text-muted-foreground">Format</dt><dd className="font-semibold">PDF, do czytania i druku</dd></div>
            <div><dt className="text-muted-foreground">Dostawa</dt><dd className="font-semibold">link do pobrania od razu po płatności</dd></div>
          </dl>
        </div>
      </div>

      {p.samplePages.length > 0 && (
        <section aria-labelledby="podglad" className="bg-sage/50 py-24">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 id="podglad" className="text-h2">Zajrzyj do środka</h2>
            <p className="measure mt-4 text-muted-foreground">Kilka przykładowych stron. Przewracaj strzałkami lub przyciskami.</p>
            <div className="mt-12"><Flipbook pages={p.samplePages} title={p.title} /></div>
            <WandaVoice className="mx-auto mt-12 max-w-xl" />
          </div>
        </section>
      )}

      <div className="mx-auto grid max-w-[1400px] gap-16 px-5 py-24 md:px-10 lg:grid-cols-12">
        <section aria-labelledby="spis" className="lg:col-span-6">
          <h2 id="spis" className="text-h3">{p.includes ? "W pakiecie" : "Spis treści"}</h2>
          {included.length > 0 ? (
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {included.map((x) => (
                <li key={x.slug}>
                  <Link to="/ebooki/$slug" params={{ slug: x.slug }} className="flex items-baseline justify-between gap-6 py-4">
                    <span className="link-underline font-display text-xl">{x.title}</span>
                    <span className="text-muted-foreground">{x.priceZl} zł osobno</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <ol className="mt-6 divide-y divide-border border-y border-border">
              {p.toc.map((t, i) => (
                <li key={t} className="flex gap-5 py-3"><span className="w-6 text-brown">{i + 1}.</span>{t}</li>
              ))}
            </ol>
          )}
        </section>
        <div className="space-y-12 lg:col-span-5 lg:col-start-8">
          <section aria-labelledby="dla-kogo">
            <h2 id="dla-kogo" className="text-h3">Dla kogo</h2>
            <ul className="mt-5 list-disc space-y-2 pl-5 marker:text-copper">{p.forWhom.map((f) => <li key={f}>{f}</li>)}</ul>
          </section>
          {p.safety && <Precautions title="Bezpieczeństwo" items={[p.safety]} />}
          {herbs.length > 0 && (
            <section aria-labelledby="rosliny">
              <h2 id="rosliny" className="text-h3">Rośliny z poradnika w atlasie</h2>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {herbs.map((h) => (
                  <li key={h.slug}><Link to="/ziola-i-rosliny/$slug" params={{ slug: h.slug }} className="link-underline latin text-lg">{h.latin}</Link></li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      {offerBundle && (
        <section className="border-t border-border">
          <Link to="/ebooki/$slug" params={{ slug: offerBundle.slug }} className="group mx-auto grid max-w-[1400px] items-center gap-8 px-5 py-16 md:grid-cols-12 md:px-10">
            <div className="md:col-span-7">
              <p className="latin text-xl text-brown">Herbarium</p>
              <h2 className="text-h3 mt-2 group-hover:text-forest">Ten poradnik jest też w pakiecie „Zielnik kompletny”</h2>
              <p className="mt-2 text-muted-foreground">Trzy e-booki razem za {offerBundle.priceZl} zł zamiast {bundleSeparateTotal(offerBundle)} zł.</p>
            </div>
            <span className="link-underline font-semibold text-forest md:col-span-5 md:justify-self-end">Zobacz pakiet</span>
          </Link>
        </section>
      )}
    </>
  );
}
