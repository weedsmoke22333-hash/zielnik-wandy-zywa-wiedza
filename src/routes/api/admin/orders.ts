import { createFileRoute } from "@tanstack/react-router";
import { fail, json } from "@/lib/server/http";
import { requireAdmin, supabaseAdmin } from "@/lib/server/supabase";

/** Recent orders + basic sales report (paid revenue per month and per product). */
export const Route = createFileRoute("/api/admin/orders")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = await requireAdmin(request);
        if ("status" in auth) return fail(auth.status, "unauthorized", auth.message);
        const sb = supabaseAdmin()!;
        const { data: orders, error } = await sb
          .from("orders")
          .select("id, created_at, paid_at, product_title, amount_grosze, status, email, download_count")
          .order("created_at", { ascending: false })
          .limit(300);
        if (error) return fail(500, "db_error", "Nie udało się pobrać zamówień.");

        const paid = (orders ?? []).filter((o) => o.status === "paid");
        const byMonth = new Map<string, { count: number; grosze: number }>();
        const byProduct = new Map<string, { count: number; grosze: number }>();
        for (const o of paid) {
          const m = (o.paid_at ?? o.created_at).slice(0, 7);
          const bm = byMonth.get(m) ?? { count: 0, grosze: 0 };
          bm.count++; bm.grosze += o.amount_grosze; byMonth.set(m, bm);
          const bp = byProduct.get(o.product_title) ?? { count: 0, grosze: 0 };
          bp.count++; bp.grosze += o.amount_grosze; byProduct.set(o.product_title, bp);
        }
        return json({
          ok: true,
          orders,
          report: {
            totalGrosze: paid.reduce((s, o) => s + o.amount_grosze, 0),
            paidCount: paid.length,
            byMonth: [...byMonth.entries()].sort().reverse().map(([month, v]) => ({ month, ...v })),
            byProduct: [...byProduct.entries()].map(([title, v]) => ({ title, ...v })),
          },
        });
      },
    },
  },
});
