import { getProduct, type Product } from "@/data/products";
import { config } from "./env";
import { supabaseAdmin } from "./supabase";

export type DbProduct = {
  id: string;
  slug: string;
  title: string;
  price_grosze: number;
  status: "draft" | "published";
  pdf_path: string | null;
  includes: string[] | null;
};

/**
 * Resolves what may actually be sold. A product is purchasable only when:
 *  - payments are configured and deliberately enabled (PAYMENTS_ENABLED=true),
 *  - the product row is `published` in the database,
 *  - its PDF (or, for a bundle, every included PDF) has been uploaded to private storage.
 * The static catalogue is never purchasable — it only describes sample drafts.
 */
export async function resolveForSale(slug: string): Promise<
  | { ok: true; product: DbProduct; display: Product | undefined }
  | { ok: false; reason: "not_found" | "payments_off" | "draft" | "missing_file"; message: string }
> {
  const display = getProduct(slug);
  if (!config.payments()) {
    return { ok: false, reason: "payments_off", message: "Sprzedaż nie jest jeszcze uruchomiona." };
  }
  const sb = supabaseAdmin()!;
  const { data } = await sb.from("products").select("id, slug, title, price_grosze, status, pdf_path, includes").eq("slug", slug).maybeSingle<DbProduct>();
  if (!data) return { ok: false, reason: "not_found", message: "Nie znaleziono takiego e-booka." };
  if (data.status !== "published") return { ok: false, reason: "draft", message: "Ten e-book nie jest jeszcze opublikowany." };
  const files = await filesFor(data);
  if (files.length === 0 || files.some((f) => !f.pdf_path)) {
    return { ok: false, reason: "missing_file", message: "Plik e-booka nie został jeszcze dodany." };
  }
  return { ok: true, product: data, display };
}

/** PDF files delivered for a product: itself, or each included e-book for a bundle. */
export async function filesFor(p: DbProduct): Promise<{ slug: string; title: string; pdf_path: string | null }[]> {
  if (!p.includes || p.includes.length === 0) return [{ slug: p.slug, title: p.title, pdf_path: p.pdf_path }];
  const sb = supabaseAdmin()!;
  const { data } = await sb.from("products").select("slug, title, pdf_path").in("slug", p.includes);
  return (data ?? []) as { slug: string; title: string; pdf_path: string | null }[];
}
