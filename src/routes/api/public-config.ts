import { createFileRoute } from "@tanstack/react-router";
import { config, env } from "@/lib/server/env";
import { json } from "@/lib/server/http";
import { supabaseAdmin } from "@/lib/server/supabase";

/**
 * Public, non-secret runtime configuration for the browser: which integrations are live,
 * which e-books can be bought right now, and the Supabase anon credentials for the admin login
 * (the anon key is designed to be public; RLS protects the data).
 */
export const Route = createFileRoute("/api/public-config")({
  server: {
    handlers: {
      GET: async () => {
        let purchasable: { slug: string; price_grosze: number }[] = [];
        if (config.payments()) {
          const { data } = await supabaseAdmin()!.from("products").select("slug, price_grosze, pdf_path, includes, status").eq("status", "published");
          const rows = (data ?? []) as { slug: string; price_grosze: number; pdf_path: string | null; includes: string[] | null }[];
          const withFile = new Set(rows.filter((r) => r.pdf_path).map((r) => r.slug));
          purchasable = rows
            .filter((r) => (r.includes?.length ? r.includes.every((s) => withFile.has(s)) : !!r.pdf_path))
            .map(({ slug, price_grosze }) => ({ slug, price_grosze }));
        }
        return json(
          {
            payments: config.payments(),
            newsletter: config.newsletter(),
            contact: config.contact(),
            purchasable,
            supabase: config.supabase() && env("SUPABASE_ANON_KEY") ? { url: env("SUPABASE_URL"), anonKey: env("SUPABASE_ANON_KEY") } : null,
          },
          200,
          { "cache-control": "public, max-age=60" },
        );
      },
    },
  },
});
