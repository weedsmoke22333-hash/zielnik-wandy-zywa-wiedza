import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { resolveForSale } from "@/lib/server/catalog";
import { env } from "@/lib/server/env";
import { fail, json, log, parseJson, rateLimit, sameOrigin } from "@/lib/server/http";
import { createCheckoutSession } from "@/lib/server/stripe";
import { supabaseAdmin } from "@/lib/server/supabase";

const Body = z.object({
  slug: z.string().regex(/^[a-z0-9-]{3,80}$/),
  email: z.string().trim().email().max(255).optional(),
  /** Art. 38 pkt 13 ustawy o prawach konsumenta — consent to immediate delivery of digital content. */
  digitalConsent: z.literal(true),
  termsAccepted: z.literal(true),
});

/**
 * Creates a pending order and a Stripe Checkout session. The price ALWAYS comes from the
 * database, never from the request. The order becomes `paid` only via the verified webhook.
 */
export const Route = createFileRoute("/api/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!sameOrigin(request)) return fail(403, "forbidden", "Niedozwolone żądanie.");
        const limited = rateLimit(request, "checkout", 10, 10 * 60_000);
        if (limited) return limited;
        const parsed = await parseJson(request, Body);
        if ("response" in parsed) return parsed.response;

        const sale = await resolveForSale(parsed.data.slug);
        if (!sale.ok) return fail(sale.reason === "not_found" ? 404 : 409, sale.reason, sale.message);

        const sb = supabaseAdmin()!;
        const now = new Date().toISOString();
        const { data: order, error } = await sb
          .from("orders")
          .insert({
            product_id: sale.product.id,
            product_slug: sale.product.slug,
            product_title: sale.product.title,
            amount_grosze: sale.product.price_grosze,
            currency: "pln",
            email: parsed.data.email ?? null,
            status: "pending",
            digital_consent_at: now,
            terms_accepted_at: now,
          })
          .select("id")
          .single<{ id: string }>();
        if (error || !order) {
          log("error", "checkout.order_insert_failed", { message: error?.message });
          return fail(500, "order_failed", "Nie udało się utworzyć zamówienia. Spróbuj ponownie.");
        }

        const origin = env("PUBLIC_SITE_URL") ?? new URL(request.url).origin;
        try {
          const session = await createCheckoutSession({
            orderId: order.id,
            productTitle: sale.product.title,
            amountGrosze: sale.product.price_grosze,
            email: parsed.data.email,
            successUrl: `${origin}/zamowienie?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${origin}/ebooki/${sale.product.slug}?anulowano=1`,
          });
          await sb.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);
          log("info", "checkout.session_created", { orderId: order.id, slug: sale.product.slug });
          return json({ ok: true, url: session.url });
        } catch (e) {
          log("error", "checkout.stripe_failed", { orderId: order.id, message: (e as Error).message });
          await sb.from("orders").update({ status: "failed" }).eq("id", order.id);
          return fail(502, "payment_provider_error", "Nie udało się połączyć z systemem płatności. Spróbuj ponownie za chwilę.");
        }
      },
    },
  },
});
