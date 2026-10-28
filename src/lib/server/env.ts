/**
 * Server-only environment access. Secrets never use the VITE_ prefix, so Vite never
 * inlines them into the browser bundle.
 *
 * Works in Node (dev / vite preview) and on Cloudflare Workers (Nitro maps bindings onto process.env).
 */
type Key =
  | "SUPABASE_URL"
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "SUPABASE_ANON_KEY"
  | "STRIPE_SECRET_KEY"
  | "STRIPE_WEBHOOK_SECRET"
  | "MAILERLITE_API_KEY"
  | "MAILERLITE_GROUP_ID"
  | "RESEND_API_KEY"
  | "CONTACT_TO_EMAIL"
  | "CONTACT_FROM_EMAIL"
  | "PUBLIC_SITE_URL"
  | "PAYMENTS_ENABLED";

export function env(key: Key): string | undefined {
  const fromProcess = typeof process !== "undefined" ? process.env?.[key] : undefined;
  const fromGlobal = (globalThis as unknown as { __env__?: Record<string, string> }).__env__?.[key];
  const v = fromProcess ?? fromGlobal;
  return v && v.trim() !== "" ? v : undefined;
}

export const has = (...keys: Key[]) => keys.every((k) => !!env(k));

export const config = {
  supabase: () => has("SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"),
  /** Live/test payments only when keys exist AND the owner has flipped the switch on purpose. */
  payments: () => has("STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET") && env("PAYMENTS_ENABLED") === "true" && has("SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"),
  newsletter: () => has("MAILERLITE_API_KEY", "MAILERLITE_GROUP_ID"),
  contact: () => has("RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"),
};
