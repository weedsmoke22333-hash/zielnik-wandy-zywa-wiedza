import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { fail, json, log, parseJson, sameOrigin } from "@/lib/server/http";
import { requireAdmin, supabaseAdmin } from "@/lib/server/supabase";

const Patch = z
  .object({
    id: z.string().uuid(),
    title: z.string().trim().min(3).max(160).optional(),
    description: z.string().trim().max(2000).optional(),
    price_grosze: z.number().int().min(100).max(100_000).optional(),
    status: z.enum(["draft", "published"]).optional(),
    pdf_path: z.string().regex(/^[a-z0-9-]+\/[\w.-]+\.pdf$/).optional(),
    cover_path: z.string().regex(/^[a-z0-9-]+\/[\w.-]+\.(webp|jpg|jpeg|png)$/).optional(),
  })
  .strict();

const COLUMNS = "id, slug, title, description, price_grosze, status, pdf_path, cover_path, includes, updated_at";

export const Route = createFileRoute("/api/admin/products")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await requireAdmin(request);
        if ("status" in auth) return fail(auth.status, "unauthorized", auth.message);
        const { data, error } = await supabaseAdmin()!.from("products").select(COLUMNS).order("sort_order");
        if (error) return fail(500, "db_error", "Nie udało się pobrać produktów.");
        return json({ ok: true, products: data });
      },
      PATCH: async ({ request }) => {
        if (!sameOrigin(request)) return fail(403, "forbidden", "Niedozwolone żądanie.");
        const auth = await requireAdmin(request);
        if ("status" in auth) return fail(auth.status, "unauthorized", auth.message);
        const parsed = await parseJson(request, Patch);
        if ("response" in parsed) return parsed.response;
        const { id, ...changes } = parsed.data;
        const sb = supabaseAdmin()!;

        const { data: current } = await sb.from("products").select("slug, pdf_path, includes").eq("id", id).maybeSingle<{ slug: string; pdf_path: string | null; includes: string[] | null }>();
        if (!current) return fail(404, "not_found", "Nie znaleziono produktu.");
        for (const p of [changes.pdf_path, changes.cover_path]) {
          if (p && !p.startsWith(`${current.slug}/`)) return fail(400, "bad_path", "Nieprawidłowa ścieżka pliku.");
        }
        if (changes.status === "published") {
          if (current.includes?.length) {
            const { data: inc } = await sb.from("products").select("pdf_path").in("slug", current.includes);
            if (!inc || inc.length !== current.includes.length || inc.some((r) => !r.pdf_path)) {
              return fail(409, "missing_file", "Najpierw dodaj pliki PDF wszystkich e-booków z pakietu.");
            }
          } else if (!(changes.pdf_path ?? current.pdf_path)) {
            return fail(409, "missing_file", "Nie można opublikować e-booka bez pliku PDF.");
          }
        }
        const { data, error } = await sb.from("products").update(changes).eq("id", id).select(COLUMNS).single();
        if (error) return fail(500, "db_error", error.message);
        log("info", "admin.product_updated", { id, by: auth.userId, fields: Object.keys(changes) });
        return json({ ok: true, product: data });
      },
    },
  },
});
