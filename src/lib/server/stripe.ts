import { env } from "./env";

/**
 * Minimal Stripe REST client built on fetch + WebCrypto, so it runs unchanged on
 * Cloudflare Workers and Node. Only the two calls the shop needs.
 */
const API = "https://api.stripe.com/v1";

function form(data: Record<string, string | number | undefined>) {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(data)) if (v !== undefined) body.append(k, String(v));
  return body;
}

export type CheckoutInput = {
  orderId: string;
  productTitle: string;
  amountGrosze: number;
  email?: string | undefined;
  successUrl: string;
  cancelUrl: string;
};

export async function createCheckoutSession(input: CheckoutInput): Promise<{ id: string; url: string }> {
  const key = env("STRIPE_SECRET_KEY");
  if (!key) throw new Error("STRIPE_SECRET_KEY missing");
  const res = await fetch(`${API}/checkout/sessions`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${key}`,
      "content-type": "application/x-www-form-urlencoded",
      // Same order id → Stripe returns the same session instead of creating a duplicate.
      "idempotency-key": `checkout-${input.orderId}`,
    },
    body: form({
      mode: "payment",
      locale: "pl",
      client_reference_id: input.orderId,
      "metadata[order_id]": input.orderId,
      "payment_intent_data[metadata][order_id]": input.orderId,
      "line_items[0][quantity]": 1,
      "line_items[0][price_data][currency]": "pln",
      "line_items[0][price_data][unit_amount]": input.amountGrosze,
      "line_items[0][price_data][product_data][name]": input.productTitle,
      "payment_method_types[0]": "card",
      "payment_method_types[1]": "blik",
      "payment_method_types[2]": "p24",
      customer_email: input.email,
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
    }),
  });
  const body = (await res.json()) as { id?: string; url?: string; error?: { message?: string } };
  if (!res.ok || !body.id || !body.url) throw new Error(`Stripe checkout failed: ${body.error?.message ?? res.status}`);
  return { id: body.id, url: body.url };
}

function hex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/**
 * Verifies the Stripe-Signature header (v1 scheme, HMAC-SHA256 over `${t}.${rawBody}`)
 * with a 5-minute replay window. Returns the parsed event or null.
 */
export async function verifyStripeEvent(rawBody: string, header: string | null, toleranceSec = 300) {
  const secret = env("STRIPE_WEBHOOK_SECRET");
  if (!secret || !header) return null;
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=") as [string, string]));
  const t = parts["t"];
  const signatures = header.split(",").filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));
  if (!t || signatures.length === 0) return null;
  if (Math.abs(Date.now() / 1000 - Number(t)) > toleranceSec) return null;
  const keyData = new TextEncoder().encode(secret);
  const cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = hex(await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(`${t}.${rawBody}`)));
  if (!signatures.some((s) => safeEqual(s, sig))) return null;
  return JSON.parse(rawBody) as StripeEvent;
}

export type StripeEvent = {
  id: string;
  type: string;
  data: { object: { id: string; payment_status?: string; client_reference_id?: string; customer_details?: { email?: string }; payment_intent?: string; metadata?: Record<string, string> } };
};
