import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { z } from "zod";
import { PageIntro } from "@/components/site/Editorial";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/zamowienie")({
  validateSearch: z.object({
    session_id: z.string().optional(),
    order: z.string().optional(),
    token: z.string().optional(),
  }),
  head: () => pageHead("Twoje zamówienie", "Potwierdzenie zamówienia i pobieranie e-booka.", "/zamowienie", { noindex: true }),
  component: OrderPage,
});

type OrderState =
  | { kind: "loading" }
  | { kind: "pending"; title?: string }
  | { kind: "paid"; title: string; order: string; token: string; files: { slug: string; title: string }[] }
  | { kind: "failed"; title?: string; status: string }
  | { kind: "error"; message: string };

function OrderPage() {
  const search = Route.useSearch();
  const [state, setState] = useState<OrderState>({ kind: "loading" });

  useEffect(() => {
    const qs = search.session_id
      ? `session_id=${encodeURIComponent(search.session_id)}`
      : search.order && search.token
        ? `order=${encodeURIComponent(search.order)}&token=${encodeURIComponent(search.token)}`
        : null;
    if (!qs) {
      setState({ kind: "error", message: "Brak danych zamówienia w adresie strony." });
      return;
    }
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;
    let alive = true;
    const poll = async () => {
      attempts++;
      try {
        const res = await fetch(`/api/order?${qs}`);
        const body = (await res.json().catch(() => ({}))) as { status?: string; title?: string; order?: string; token?: string; files?: { slug: string; title: string }[]; message?: string };
        if (!alive) return;
        if (!res.ok) return setState({ kind: "error", message: body.message ?? "Nie udało się sprawdzić zamówienia." });
        if (body.status === "paid" && body.order && body.token) return setState({ kind: "paid", title: body.title ?? "", order: body.order, token: body.token, files: body.files ?? [] });
        if (body.status === "failed" || body.status === "expired" || body.status === "refunded") return setState({ kind: "failed", status: body.status, ...(body.title ? { title: body.title } : {}) });
        setState({ kind: "pending", ...(body.title ? { title: body.title } : {}) });
        // Webhook usually lands within seconds; BLIK / P24 may take a little longer.
        if (attempts < 40) timer = setTimeout(poll, attempts < 10 ? 2000 : 5000);
      } catch {
        if (alive) setState({ kind: "error", message: "Brak połączenia z serwerem. Odśwież stronę za chwilę." });
      }
    };
    void poll();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [search.session_id, search.order, search.token]);

  return (
    <>
      <PageIntro latin="Gratias" title={state.kind === "paid" ? "Dziękuję za zakup!" : "Twoje zamówienie"} />
      <section className="mx-auto max-w-[1400px] px-5 pb-32 pt-12 md:px-10" aria-live="polite">
        <div className="measure">
          {state.kind === "loading" && <p className="flex items-center gap-3 text-lg"><Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Sprawdzam zamówienie…</p>}
          {state.kind === "pending" && (
            <div className="space-y-4 text-lg">
              <p className="flex items-center gap-3"><Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Czekam na potwierdzenie płatności{state.title ? ` za „${state.title}”` : ""}.</p>
              <p className="text-muted-foreground">Zwykle trwa to kilka sekund. Jeśli płacisz przelewem, może potrwać dłużej — link do pobrania wyślę też e-mailem.</p>
            </div>
          )}
          {state.kind === "paid" && (
            <div className="space-y-6 text-lg">
              <p>Płatność za <strong>{state.title}</strong> została potwierdzona. Pobierz swój e-book:</p>
              <ul className="space-y-3">
                {state.files.map((f) => (
                  <li key={f.slug}>
                    <a
                      href={`/api/download?order=${state.order}&token=${state.token}&slug=${f.slug}`}
                      className="inline-flex min-h-14 items-center gap-3 rounded-sm bg-forest px-7 font-semibold text-ivory transition-colors hover:bg-deep"
                    >
                      <Download className="h-5 w-5" aria-hidden /> Pobierz: {f.title} (PDF)
                    </a>
                  </li>
                ))}
              </ul>
              <p className="text-[0.9375rem] text-muted-foreground">
                Zapisz tę stronę w zakładkach albo skorzystaj z linku z e-maila. Link jest przypisany do Twojego zamówienia — nie udostępniaj go innym.
              </p>
            </div>
          )}
          {state.kind === "failed" && (
            <div className="space-y-4 text-lg">
              <p>Płatność {state.status === "expired" ? "wygasła" : "nie została zrealizowana"}. Nic nie zostało pobrane z Twojego konta.</p>
              <Link to="/ebooki" className="inline-flex min-h-14 items-center rounded-sm bg-forest px-7 font-semibold text-ivory">Wróć do e-booków</Link>
            </div>
          )}
          {state.kind === "error" && (
            <div className="space-y-4 text-lg">
              <p>{state.message}</p>
              <p className="text-muted-foreground">
                Jeśli zapłaciłaś / zapłaciłeś, a link nie działa, <Link to="/kontakt" className="underline underline-offset-4">napisz do mnie</Link> — pomogę.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
