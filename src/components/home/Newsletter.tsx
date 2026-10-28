import { useId, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { newsletterSchema, subscribeNewsletter } from "@/lib/newsletter";
import { cn } from "@/lib/utils";

/**
 * Newsletter with a lead magnet: the free printable harvesting calendar (PDF) is sent by the
 * newsletter provider after the subscriber confirms their address (double opt-in).
 */
export function Newsletter({ source = "home" }: { source?: "home" | "kalendarz" | "blog" }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string | undefined; consent?: string | undefined }>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "info" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = newsletterSchema.safeParse({ email, consent });
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      setErrors({ email: f.email?.[0], consent: f.consent?.[0] });
      return;
    }
    setErrors({});
    setStatus("loading");
    const res = await subscribeNewsletter(parsed.data.email, source);
    setStatus(res.ok ? "success" : res.reason === "not_configured" ? "info" : "error");
    setMessage(res.message);
  }

  return (
    <section id="newsletter" aria-labelledby={`${id}-h`} className="scroll-mt-20 bg-deep py-28 text-ivory md:py-36">
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id={`${id}-h`} className="text-h2">Zostańmy w kontakcie.</h2>
          <p className="measure mt-6 text-lg text-ivory/85">
            Zapisz się, a wyślę Ci <strong className="font-semibold text-ivory">Kalendarz zbioru ziół</strong> do druku:
            piętnaście roślin i dwanaście miesięcy na jednej kartce. Potem raz na jakiś czas — sezonowa wskazówka i
            informacja o nowych poradnikach.
          </p>

          <form noValidate onSubmit={onSubmit} className="mt-10">
            <label htmlFor={`${id}-email`} className="block font-semibold">Adres e-mail</label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                id={`${id}-email`}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? `${id}-email-err` : undefined}
                placeholder="np. anna@poczta.pl"
                className="min-h-14 flex-1 rounded-sm border border-ivory/40 bg-transparent px-4 text-lg text-ivory placeholder:text-ivory/50 focus-visible:border-copper"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-sm bg-copper px-7 font-semibold text-deep transition-colors hover:bg-ivory disabled:opacity-70"
              >
                {status === "loading" && <Loader2 className="h-5 w-5 animate-spin" aria-hidden />}
                {status === "loading" ? "Wysyłanie…" : "Wyślij mi kalendarz"}
              </button>
            </div>
            {errors.email && <p id={`${id}-email-err`} className="mt-2 text-copper">{errors.email}</p>}

            <div className="mt-6 flex gap-3">
              <input
                id={`${id}-consent`}
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? `${id}-consent-err` : undefined}
                className="mt-1 h-6 w-6 shrink-0 accent-copper"
              />
              <label htmlFor={`${id}-consent`} className="text-[0.9375rem] leading-relaxed text-ivory/80">
                Wyrażam zgodę na przetwarzanie mojego adresu e-mail w celu otrzymywania newslettera, zgodnie
                z <a href="/polityka-prywatnosci" className="underline underline-offset-4">polityką prywatności</a>.
                Zgodę mogę wycofać w każdej chwili.
              </label>
            </div>
            {errors.consent && <p id={`${id}-consent-err`} className="mt-2 text-copper">{errors.consent}</p>}

            <p
              role="status"
              aria-live="polite"
              className={cn(
                "mt-6 min-h-7 border-l-2 pl-4 empty:border-0",
                status === "error" ? "border-[#e0a48a] text-[#f2c9b6]" : "border-copper",
              )}
            >
              {status === "success" || status === "info" || status === "error" ? message : ""}
            </p>
          </form>
        </div>

        <figure className="relative lg:col-span-6 lg:col-start-7">
          <div className="paper-grain relative rotate-[1.2deg] bg-ivory p-3 shadow-[0_2px_4px_rgb(0_0_0/0.3),0_40px_60px_-24px_rgb(0_0_0/0.6)]">
            <span className="tape -left-5 -top-3 -rotate-[28deg]" aria-hidden />
            <span className="tape -right-5 -top-3 rotate-[24deg]" aria-hidden />
            <img
              src="/materialy/kalendarz-podglad.webp"
              alt="Podgląd kalendarza zbioru ziół: tabela piętnastu roślin i dwunastu miesięcy z zaznaczoną częścią rośliny do zbioru"
              width={1123}
              height={794}
              loading="lazy"
              className="h-auto w-full"
            />
          </div>
          <figcaption className="mt-6 text-[0.9375rem] text-ivory/70">PDF, format A4 — do wydrukowania i powieszenia w kuchni.</figcaption>
        </figure>
      </div>
    </section>
  );
}
