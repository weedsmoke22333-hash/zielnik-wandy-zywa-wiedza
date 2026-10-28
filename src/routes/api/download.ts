import { createFileRoute } from "@tanstack/react-router";
import { filesFor, type DbProduct } from "@/lib/server/catalog";
import { config } from "@/lib/server/env";
import { fail, log, rateLimit } from "@/lib/server/http";
import { supabaseAdmin } from "@/lib/server/supabase";

const MAX_DOWNLOADS = 20;
const LINK_SECONDS = 120;

/**
 * Secure download: verifies on the server that the order is PAID and the secret token matches,
 * then redirects to a short-lived signed URL of the PDF in the private `ebooks` bucket.
 * PDF paths are never exposed to the frontend.
 */
export const Route = createFileRoute("/api/download")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const limited = rateLimit(request, "download", 30, 10 * 60_000);
        if (limited) return limited;
        if (!config.supabase()) return fail(503, "downloads_not_configured", "Pobieranie nie jest jeszcze dostępne.");
        const q = new URL(request.url).searchParams;
        const orderId = q.get("order") ?? "";
        const token = q.get("token") ?? "";
        const slug = q.get("slug") ?? "";
        if (!/^[0-9a-f-]{36}$/.test(orderId) || !/^[A-Za-z0-9]{32,128}$/.test(token) || !/^[a-z0-9-]{3,80}$/.test(slug)) {
          return fail(400, "bad_request", "Nieprawidłowy link do pobrania.");
        }
        const sb = supabaseAdmin()!;
        const { data: order } = await sb
          .from("orders")
          .select("id, status, product_id, download_count")
          .eq("id", orderId)
          .eq("download_token", token)
          .maybeSingle<{ id: string; status: string; product_id: string; download_count: number }>();
        if (!order || order.status !== "paid") return fail(403, "not_paid", "To zamówienie nie zostało opłacone albo link jest nieprawidłowy.");
        if (order.download_count >= MAX_DOWNLOADS) return fail(429, "download_limit", "Wykorzystano limit pobrań. Napisz do nas — pomożemy.");

        const { data: product } = await sb.from("products").select("id, slug, title, price_grosze, status, pdf_path, includes").eq("id", order.product_id).single<DbProduct>();
        const file = product ? (await filesFor(product)).find((f) => f.slug === slug) : undefined;
        if (!file?.pdf_path) return fail(404, "file_missing", "Nie znaleziono pliku. Napisz do nas — pomożemy.");

        const { data: signed, error } = await sb.storage.from("ebooks").createSignedUrl(file.pdf_path, LINK_SECONDS, { download: `${file.slug}.pdf` });
        if (error || !signed) {
          log("error", "download.sign_failed", { orderId, message: error?.message });
          return fail(500, "sign_failed", "Nie udało się przygotować pliku. Spróbuj ponownie.");
        }
        await sb.from("orders").update({ download_count: order.download_count + 1 }).eq("id", order.id);
        log("info", "download.granted", { orderId, slug });
        return new Response(null, { status: 302, headers: { location: signed.signedUrl, "cache-control": "no-store" } });
      },
    },
  },
});
