import { createFileRoute } from "@tanstack/react-router";
import { herbs } from "@/data/herbs";
import { articles } from "@/data/articles";
import { products } from "@/data/products";
import { env } from "@/lib/server/env";

const STATIC = [
  "/", "/ziola-i-rosliny", "/kalendarz-zielarski", "/trujace-sobowtory", "/ziola-a-leki", "/zdrowe-nawyki", "/odpornosc",
  "/blog", "/ebooki", "/o-mnie", "/kontakt", "/regulamin", "/zwroty-i-reklamacje", "/polityka-prywatnosci", "/polityka-cookies",
];

/** XML sitemap generated from the same data as the pages, so it never drifts. */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = (env("PUBLIC_SITE_URL") ?? new URL(request.url).origin).replace(/\/$/, "");
        const paths = [
          ...STATIC,
          ...herbs.map((h) => `/ziola-i-rosliny/${h.slug}`),
          ...articles.map((a) => `/blog/${a.slug}`),
          ...products.map((p) => `/ebooki/${p.slug}`),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
          .map((p) => `  <url><loc>${origin}${p}</loc></url>`)
          .join("\n")}\n</urlset>\n`;
        return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
      },
    },
  },
});
