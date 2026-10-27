import { useId, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { newsletterSchema, subscribeNewsletter } from "@/lib/newsletter";

export function Newsletter() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; consent?: string }>({});
  const [status, setStatus] = useState<"idle" | "loading" | "info">("idle");
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
    const res = await subscribeNewsletter(parsed.data.email);
    setStatus("info");
    setMessage(res.ok ? "Dziękuję za zapis." : res.message);
  }

  return (
    <section aria-labelledby="newsletter" className="bg-deep py-28 text-ivory md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="newsletter" className="text-h2">Zostańmy w kontakcie.</h2>
          <p className="mt-6 max-w-md text-ivory/80">
            Raz na jakiś czas: nowy opis rośliny, sezonowa wskazówka i informacja o nowych poradnikach.
          </p>
        </div>
        <form noValidate onSubmit={onSubmit} className="lg:col-span-6 lg:col-start-7">
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
              {status === "loading" ? "Wysyłanie…" : "Zapisz się"}
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
            <label htmlFor={`${id}-consent`} className="text-[15px] leading-relaxed text-ivory/80">
              Wyrażam zgodę na przetwarzanie mojego adresu e-mail w celu otrzymywania newslettera, zgodnie
              z <a href="/polityka-prywatnosci" className="underline underline-offset-4">polityką prywatności</a> (RODO).
              Zgodę mogę wycofać w każdej chwili.
            </label>
          </div>
          {errors.consent && <p id={`${id}-consent-err`} className="mt-2 text-copper">{errors.consent}</p>}

          <p role="status" aria-live="polite" className="mt-6 min-h-7 border-l-2 border-copper pl-4 empty:border-0">
            {status === "info" ? message : ""}
          </p>
        </form>
      </div>
    </section>
  );
}
