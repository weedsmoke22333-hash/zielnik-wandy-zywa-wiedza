import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function PlaceholderPage({ latin, title, intro, children }: { latin: string; title: string; intro: string; children?: ReactNode }) {
  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-32 pt-40 md:px-10 md:pt-48">
      <p className="latin text-xl text-brown">{latin}</p>
      <h1 className="text-h2 mt-3 max-w-4xl">{title}</h1>
      <p className="measure mt-8 text-xl text-muted-foreground">{intro}</p>
      {children}
      <div className="mt-14 border-t border-border pt-6 text-muted-foreground">
        Ta strona jest w przygotowaniu.{" "}
        <Link to="/" className="link-underline font-semibold text-forest">Wróć na stronę główną</Link>
      </div>
    </section>
  );
}

export function pageHead(title: string, description: string, path: string) {
  const full = `${title} — Wanda Machocka`;
  return {
    meta: [
      { title: full },
      { name: "description", content: description },
      { property: "og:title", content: full },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: path },
    ],
    links: [{ rel: "canonical", href: path }],
  };
}
