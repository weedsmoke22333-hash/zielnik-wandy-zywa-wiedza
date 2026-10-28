import { z } from "zod";

/** Structured server log line (shows up in Cloudflare / Node logs as JSON). */
export function log(level: "info" | "warn" | "error", event: string, data: Record<string, unknown> = {}) {
  const line = JSON.stringify({ level, event, at: new Date().toISOString(), ...data });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

const SECURITY_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
};

export function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...SECURITY_HEADERS, ...headers } });
}

export type ApiError = { ok: false; code: string; message: string; fields?: Record<string, string[] | undefined> };
export const fail = (status: number, code: string, message: string, fields?: ApiError["fields"]) =>
  json({ ok: false, code, message, ...(fields ? { fields } : {}) } satisfies ApiError, status);

export const notConfigured = (what: string, message: string) => fail(503, `${what}_not_configured`, message);

/** Same-origin check for state-changing JSON endpoints (CSRF defence in depth; CORS stays closed). */
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser clients (curl, server-to-server) — protected by other means
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

/** Parse + validate a JSON body with Zod. Returns either data or a ready 400/415 response. */
export async function parseJson<T extends z.ZodTypeAny>(request: Request, schema: T): Promise<{ data: z.infer<T> } | { response: Response }> {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return { response: fail(415, "unsupported_media_type", "Oczekiwano danych JSON.") };
  }
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { response: fail(400, "invalid_json", "Nie udało się odczytać danych formularza.") };
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { response: fail(400, "validation_error", "Sprawdź poprawność pól formularza.", parsed.error.flatten().fieldErrors) };
  }
  return { data: parsed.data };
}

/**
 * Best-effort in-memory rate limit (per server instance). For production at scale put
 * Cloudflare's rate limiting rule in front of /api/* as well — see README.
 */
const buckets = new Map<string, { count: number; reset: number }>();
export function rateLimit(request: Request, key: string, max: number, windowMs: number) {
  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const id = `${key}:${ip}`;
  const now = Date.now();
  const b = buckets.get(id);
  if (!b || b.reset < now) {
    buckets.set(id, { count: 1, reset: now + windowMs });
    if (buckets.size > 5000) for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
    return null;
  }
  b.count++;
  if (b.count > max) {
    return fail(429, "rate_limited", "Zbyt wiele prób. Spróbuj ponownie za kilka minut.");
  }
  return null;
}
