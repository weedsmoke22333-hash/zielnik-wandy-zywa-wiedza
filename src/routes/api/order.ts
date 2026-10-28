import { createFileRoute } from "@tanstack/react-router";
import { filesFor, type DbProduct } from "@/lib/server/catalog";
import { config } from "@/lib/server/env";
import { fail, json, rateLimit } from "@/lib/server/http";
import { supabaseAdmin } from "@/lib/server/supabase";

type OrderRow = { id: string; status: string; product_title: string; download_token: string; product_id: string; stripe_session_id: string | null };

/**
 * Order status for the confirmation page. Looked up either by the Stripe session id (returned to
 * the browser by Stripe after payment) or by order id + secret token (link from the e-mail).
 */
export const Route = createFileRoute("/api/order")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const limited = rateLimit(request, "order", 60, 10 * 60_000);
        if (limited) return limited;
        if (!config.supabase()) return fail(503, "orders_not_configured", "Zamówienia nie są jeszcze obsługiwane.");
        const q = new URL(request.url).searchParams;
        const sessionId = q.get("session_id");
        const orderId = q.get("order");
        const token = q.get("token");
        const sb = supabaseAdmin()!;
        let query = sb.from("orders").select("id, status, product_title, download_token, product_id, stripe_session_id");
        if (sessionId && /^cs_[A-Za-z0-9_]{10,200}$/.test(sessionId)) query = query.eq("stripe_session_id", sessionId);
        else if (orderId && token && /^[0-9a-f-]{36}$/.test(orderId) && /^[A-Za-z0-9]{32,128}$/.test(token)) query = query.eq("id", orderId).eq("download_token", token);
        else return fail(400, "bad_request", "Brak danych zamówienia.");

        const { data: order } = await query.maybeSingle<OrderRow>();
        if (!order) return fail(404, "not_found", "Nie znaleziono zamówienia.");
        if (order.status !== "paid") return json({ ok: true, status: order.status, title: order.product_title });

        const { data: product } = await sb.from("products").select("id, slug, title, price_grosze, status, pdf_path, includes").eq("id", order.product_id).single<DbProduct>();
        const files = product ? (await filesFor(product)).map((f) => ({ slug: f.slug, title: f.title })) : [];
        return json({ ok: true, status: "paid", title: order.product_title, order: order.id, token: order.download_token, files });
      },
    },
  },
});
