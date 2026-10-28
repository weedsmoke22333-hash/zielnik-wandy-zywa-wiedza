import { createFileRoute } from "@tanstack/react-router";
import { config, env } from "@/lib/server/env";
import { fail, json, log } from "@/lib/server/http";
import { verifyStripeEvent } from "@/lib/server/stripe";
import { supabaseAdmin } from "@/lib/server/supabase";

/**
 * Stripe webhook — the ONLY place an order becomes `paid`.
 * Idempotent: every event id is recorded in `stripe_events` (primary key) before processing,
 * so Stripe's retries are acknowledged without double-processing.
 */
export const Route = createFileRoute("/api/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!config.payments()) return fail(503, "payments_not_configured", "Płatności nie są skonfigurowane.");
        const raw = await request.text();
        const event = await verifyStripeEvent(raw, request.headers.get("stripe-signature"));
        if (!event) {
          log("warn", "stripe.bad_signature");
          return fail(400, "bad_signature", "Invalid signature");
        }
        const sb = supabaseAdmin()!;

        const { error: dup } = await sb.from("stripe_events").insert({ id: event.id, type: event.type });
        if (dup) {
          if (dup.code === "23505") return json({ received: true, duplicate: true });
          log("error", "stripe.event_record_failed", { id: event.id, message: dup.message });
          return fail(500, "db_error", "Retry later");
        }

        const s = event.data.object;
        const orderId = s.client_reference_id ?? s.metadata?.["order_id"];
        try {
          if ((event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") && orderId) {
            if (s.payment_status === "paid") {
              const { data: order } = await sb
                .from("orders")
                .update({
                  status: "paid",
                  paid_at: new Date().toISOString(),
                  stripe_payment_intent: s.payment_intent ?? null,
                  email: s.customer_details?.email ?? undefined,
                })
                .eq("id", orderId)
                .eq("stripe_session_id", s.id)
                .neq("status", "paid")
                .select("id, email, product_title, download_token")
                .maybeSingle<{ id: string; email: string | null; product_title: string; download_token: string }>();
              log("info", "order.paid", { orderId });
              if (order?.email) await sendDownloadEmail(order);
            } else {
              log("info", "order.awaiting_async_payment", { orderId });
            }
          } else if ((event.type === "checkout.session.async_payment_failed" || event.type === "checkout.session.expired") && orderId) {
            await sb.from("orders").update({ status: event.type.endsWith("expired") ? "expired" : "failed" }).eq("id", orderId).neq("status", "paid");
            log("info", "order.not_paid", { orderId, type: event.type });
          }
        } catch (e) {
          // allow Stripe to retry: forget the event so the retry is processed
          await sb.from("stripe_events").delete().eq("id", event.id);
          log("error", "stripe.processing_failed", { id: event.id, message: (e as Error).message });
          return fail(500, "processing_failed", "Retry later");
        }
        return json({ received: true });
      },
    },
  },
});

async function sendDownloadEmail(order: { id: string; email: string | null; product_title: string; download_token: string }) {
  const key = env("RESEND_API_KEY");
  const from = env("CONTACT_FROM_EMAIL");
  const site = env("PUBLIC_SITE_URL");
  if (!key || !from || !site || !order.email) return;
  const link = `${site}/zamowienie?order=${order.id}&token=${order.download_token}`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from,
      to: [order.email],
      subject: `Twój e-book: ${order.product_title}`,
      html: `<p>Dziękuję za zakup!</p><p>Pobierzesz e-book tutaj: <a href="${link}">${link}</a></p><p>Link jest przypisany do Twojego zamówienia — nie udostępniaj go innym.</p><p style="color:#555;font-size:13px">Potwierdzenie: przed płatnością wyraziłaś / wyraziłeś zgodę na dostarczenie treści cyfrowej przed upływem terminu do odstąpienia od umowy i przyjęłaś / przyjąłeś do wiadomości utratę prawa odstąpienia (art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta).</p><p>Wanda Machocka</p>`,
    }),
  });
  if (!res.ok) log("warn", "order.email_failed", { orderId: order.id, status: res.status });
}
