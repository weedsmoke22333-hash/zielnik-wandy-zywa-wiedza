import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

let admin: SupabaseClient | null = null;

/**
 * Service-role client. Bypasses RLS — use ONLY in server routes after your own authorisation checks.
 * Returns null when Supabase is not configured.
 */
export function supabaseAdmin(): SupabaseClient | null {
  const url = env("SUPABASE_URL");
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return null;
  if (!admin) admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return admin;
}

/**
 * Verifies the bearer token from the admin panel and checks the `admin` role server-side
 * (user_roles table). Never trust a client-side flag for this.
 */
export async function requireAdmin(request: Request): Promise<{ userId: string } | { status: number; message: string }> {
  const sb = supabaseAdmin();
  if (!sb) return { status: 503, message: "Panel wymaga skonfigurowania Supabase." };
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { status: 401, message: "Zaloguj się, aby kontynuować." };
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data.user) return { status: 401, message: "Sesja wygasła. Zaloguj się ponownie." };
  const { data: role } = await sb.from("user_roles").select("role").eq("user_id", data.user.id).eq("role", "admin").maybeSingle();
  if (!role) return { status: 403, message: "To konto nie ma uprawnień administratora." };
  return { userId: data.user.id };
}
