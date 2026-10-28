import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { fail, json, parseJson, sameOrigin } from "@/lib/server/http";
import { requireAdmin, supabaseAdmin } from "@/lib/server/supabase";

const Body = z.object({
  productId: z.string().uuid(),
  kind: z.enum(["pdf", "cover"]),
  fileName: z.string().min(1).max(200),
});

/**
 * Issues a one-time signed upload URL so the browser uploads straight to Supabase Storage:
 * PDFs → private `ebooks` bucket, covers → public `covers` bucket.
 */
export const Route = createFileRoute("/api/admin/upload-url")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!sameOrigin(request)) return fail(403, "forbidden", "Niedozwolone żądanie.");
        const auth = await requireAdmin(request);
        if ("status" in auth) return fail(auth.status, "unauthorized", auth.message);
        const parsed = await parseJson(request, Body);
        if ("response" in parsed) return parsed.response;
        const { productId, kind, fileName } = parsed.data;
        const ext = fileName.toLowerCase().split(".").pop() ?? "";
        if (kind === "pdf" && ext !== "pdf") return fail(400, "bad_type", "Wybierz plik PDF.");
        if (kind === "cover" && !["webp", "jpg", "jpeg", "png"].includes(ext)) return fail(400, "bad_type", "Okładka musi być w formacie WebP, JPG lub PNG.");

        const sb = supabaseAdmin()!;
        const { data: product } = await sb.from("products").select("slug").eq("id", productId).maybeSingle<{ slug: string }>();
        if (!product) return fail(404, "not_found", "Nie znaleziono produktu.");
        const path = `${product.slug}/${Date.now()}.${ext}`;
        const bucket = kind === "pdf" ? "ebooks" : "covers";
        const { data, error } = await sb.storage.from(bucket).createSignedUploadUrl(path);
        if (error || !data) return fail(500, "storage_error", "Nie udało się przygotować wysyłki pliku.");
        return json({ ok: true, bucket, path, token: data.token, signedUrl: data.signedUrl });
      },
    },
  },
});
