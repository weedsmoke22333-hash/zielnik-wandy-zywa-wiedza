/** Public site configuration. Values come from VITE_* env vars (safe to expose to the browser). */
const env = import.meta.env as Record<string, string | undefined>;

/** Absolute origin used for canonical URLs, Open Graph and the sitemap, e.g. https://wandamachocka.pl */
export const SITE_URL = (env["VITE_SITE_URL"] ?? "").replace(/\/$/, "");

/** Plausible Analytics domain (cookieless, no consent banner needed). Empty = analytics off. */
export const PLAUSIBLE_DOMAIN = env["VITE_PLAUSIBLE_DOMAIN"] ?? "";

export const SITE_NAME = "Wanda Machocka";

export function absoluteUrl(path: string) {
  return SITE_URL ? `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}` : path;
}

/** Shared head() helper: unique title, description, canonical, Open Graph. */
export function pageHead(
  title: string,
  description: string,
  path: string,
  opts: { type?: "website" | "article" | "product"; image?: string; noindex?: boolean; jsonLd?: object | object[] } = {},
) {
  const full = path === "/" ? title : `${title} — ${SITE_NAME}`;
  const meta: Array<Record<string, string>> = [
    { title: full },
    { name: "description", content: description },
    { property: "og:title", content: full },
    { property: "og:description", content: description },
    { property: "og:type", content: opts.type === "product" ? "product" : (opts.type ?? "website") },
    { property: "og:url", content: absoluteUrl(path) },
    { property: "og:locale", content: "pl_PL" },
  ];
  if (opts.image) meta.push({ property: "og:image", content: absoluteUrl(opts.image) });
  if (opts.noindex) meta.push({ name: "robots", content: "noindex" });
  const scripts = opts.jsonLd
    ? [{ type: "application/ld+json", children: JSON.stringify(opts.jsonLd) }]
    : undefined;
  return {
    meta,
    links: [{ rel: "canonical", href: absoluteUrl(path) }],
    ...(scripts ? { scripts } : {}),
  };
}

export function breadcrumbs(items: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: absoluteUrl(path) })),
  };
}

export const TEXT_SIZE_KEY = "wm-text-size";
export type TextSize = "md" | "lg" | "xl";

/** Runs before first paint (inlined in <head>) so a saved text size never flashes. */
export const textSizeBootScript = `try{var s=localStorage.getItem("${TEXT_SIZE_KEY}");if(s==="lg"||s==="xl")document.documentElement.dataset.textSize=s}catch(e){}`;
