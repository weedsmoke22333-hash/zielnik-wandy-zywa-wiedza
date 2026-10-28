import { createFileRoute } from "@tanstack/react-router";
import { useId, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { PageIntro } from "@/components/site/Editorial";
import { pageHead } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/kontakt")({
  head: () => pageHead("Kontakt", "Napisz do Wandy Machockiej — pytania o e-booki, zamówienia i współpracę.", "/kontakt"),
  component: ContactPage,
});

const CONTACT_EMAIL = (import.meta.env as Record<string, string | undefined>)["VITE_CONTACT_EMAIL"];

const schema = z.object({
  name: z.string().trim().min(2, "Wpisz imię (co najmniej 2 znaki)."),
  email: z.string().trim().email("Ten adres e-mail wygląda na niepoprawny."),
  message: z.string().trim().min(10, "Wiadomość powinna mieć co najmniej 10 znaków.").max(5000, "Wiadomość jest za długa."),
  consent: z.literal(true, { errorMap: () => ({ message: "Zaznacz zgodę, abym mogła odpowiedzieć." }) }),
});
type Errors = { [K in keyof z.infer<typeof schema>]?: string | undefined };

function ContactPage() {
  const id = useId();
  const [form, setForm] = useState({ name: "", email: "", message: "", consent: false, website: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "info" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      setErrors({ name: f.name?.[0], email: f.email?.[0], message: f.message?.[0], consent: f.consent?.[0] });
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...parsed.data, website: form.website }) });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      setStatus(res.ok && body.ok ? "success" : res.status === 503 ? "info" : "error");
      setMsg(body.message ?? "Nie udało się wysłać wiadomości. Spróbuj ponownie.");
      if (res.ok && body.ok) setForm({ name: "", email: "", message: "", consent: false, website: "" });
    } catch {
      setStatus("error");
      setMsg("Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie.");
    }
  }

  const field = "mt-2 min-h-14 w-full rounded-sm border border-input bg-white px-4 text-lg aria-[invalid=true]:border-[#9b3b2a]";

  return (
    <>
      <PageIntro latin="Epistula" title="Kontakt" intro="Masz pytanie o e-book, zamówienie albo współpracę? Napisz — odpowiadam osobiście." />
      <div className="mx-auto grid max-w-[1400px] gap-16 px-5 pb-28 pt-14 md:px-10 lg:grid-cols-12">
        <form noValidate onSubmit={submit} className="space-y-6 lg:col-span-7">
          <div>
            <label htmlFor={`${id}-n`} className="font-semibold">Imię</label>
            <input id={`${id}-n`} autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!errors.name} aria-describedby={`${id}-n-e`} className={field} />
            {errors.name && <p id={`${id}-n-e`} className="mt-2 text-[#9b3b2a]">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor={`${id}-e`} className="font-semibold">Adres e-mail</label>
            <input id={`${id}-e`} type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={!!errors.email} aria-describedby={`${id}-e-e`} className={field} />
            {errors.email && <p id={`${id}-e-e`} className="mt-2 text-[#9b3b2a]">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor={`${id}-m`} className="font-semibold">Wiadomość</label>
            <textarea id={`${id}-m`} rows={7} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} aria-invalid={!!errors.message} aria-describedby={`${id}-m-e`} className={cn(field, "py-3")} />
            {errors.message && <p id={`${id}-m-e`} className="mt-2 text-[#9b3b2a]">{errors.message}</p>}
          </div>
          {/* honeypot for bots — hidden from people and screen readers */}
          <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          <div className="flex gap-3">
            <input id={`${id}-c`} type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} aria-invalid={!!errors.consent} className="mt-1 h-6 w-6 shrink-0 accent-forest" />
            <label htmlFor={`${id}-c`} className="text-[0.9375rem] text-muted-foreground">
              Zgadzam się na przetwarzanie moich danych w celu udzielenia odpowiedzi, zgodnie z{" "}
              <a href="/polityka-prywatnosci" className="underline underline-offset-4">polityką prywatności</a>.
            </label>
          </div>
          {errors.consent && <p className="text-[#9b3b2a]">{errors.consent}</p>}
          <button type="submit" disabled={status === "loading"} className="inline-flex min-h-14 items-center gap-2 rounded-sm bg-forest px-8 font-semibold text-ivory transition-colors hover:bg-deep disabled:opacity-70">
            {status === "loading" && <Loader2 className="h-5 w-5 animate-spin" aria-hidden />}
            {status === "loading" ? "Wysyłanie…" : "Wyślij wiadomość"}
          </button>
          <p role="status" aria-live="polite" className={cn("min-h-7 border-l-2 pl-4 empty:border-0", status === "error" ? "border-[#9b3b2a]" : "border-copper")}>
            {status === "success" || status === "info" || status === "error" ? msg : ""}
          </p>
        </form>
        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="paper-grain border border-brown/30 bg-paper p-7">
            <h2 className="font-display text-2xl">Napisz bezpośrednio</h2>
            {CONTACT_EMAIL ? (
              <a href={`mailto:${CONTACT_EMAIL}`} className="link-underline mt-3 inline-block text-lg font-semibold text-forest">{CONTACT_EMAIL}</a>
            ) : (
              <p className="mt-3 text-muted-foreground">Adres e-mail pojawi się tu wkrótce.</p>
            )}
            <p className="mt-6 text-[0.9375rem] text-muted-foreground">
              Nie udzielam porad medycznych przez internet. W sprawach zdrowia skontaktuj się z lekarzem lub farmaceutą.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
