import { Link } from "@tanstack/react-router";
import { useId, useState, type FormEvent } from "react";
import { Loader2, Lock } from "lucide-react";
import type { Product } from "@/data/products";
import { usePublicConfig } from "@/lib/public-config";
import { cn } from "@/lib/utils";

/**
 * Purchase box. The button is live only when the server says this e-book is purchasable
 * (payments enabled + published + file uploaded). Price shown here is informational —
 * the server always charges the price stored in the database.
 */
export function BuyBox({ product, cancelled }: { product: Product; cancelled?: boolean }) {
  const id = useId();
  const cfg = usePublicConfig();
  const live = cfg?.purchasable.find((p) => p.slug === product.slug);
  const price = live ? live.price_grosze / 100 : product.priceZl;
  const [email, setEmail] = useState("");
  const [terms, setTerms] = useState(false);
  const [digital, setDigital] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function buy(e: FormEvent) {
    e.preventDefault();
    if (!terms || !digital) {
      setState("error");
      setError("Zaznacz obie zgody, aby przejść do płatności.");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug: product.slug, email: email.trim() || undefined, termsAccepted: true, digitalConsent: true }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string; message?: string };
      if (res.ok && body.url) {
        window.location.assign(body.url);
        return;
      }
      setState("error");
      setError(body.message ?? "Nie udało się rozpocząć płatności. Spróbuj ponownie.");
    } catch {
      setState("error");
      setError("Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie.");
    }
  }

  return (
    <div className="paper-grain border border-brown/30 bg-ivory p-6 md:p-8">
      <p className="flex items-baseline gap-4">
        <span className="font-display text-5xl">{price} zł</span>
        <span className="text-muted-foreground">e-book, {product.format}</span>
      </p>
      {cancelled && <p className="mt-4 border-l-2 border-copper pl-4">Płatność została przerwana. Nic nie zostało pobrane z Twojego konta.</p>}

      {cfg === null ? (
        <div className="mt-6 h-14 animate-pulse rounded-sm bg-sage/60" aria-hidden />
      ) : live ? (
        <form noValidate onSubmit={buy} className="mt-6 space-y-4">
          <div>
            <label htmlFor={`${id}-mail`} className="text-[0.9375rem] font-semibold">E-mail do wysyłki linku (opcjonalnie)</label>
            <input id={`${id}-mail`} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 min-h-12 w-full rounded-sm border border-input bg-white px-4" placeholder="Podasz go też w płatności" />
          </div>
          <label className="flex gap-3 text-[0.9375rem]">
            <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-forest" />
            <span>
              Akceptuję <Link to="/regulamin" className="underline underline-offset-4">regulamin sklepu</Link> i zapoznałam się / zapoznałem się z{" "}
              <Link to="/polityka-prywatnosci" className="underline underline-offset-4">polityką prywatności</Link>.
            </span>
          </label>
          <label className="flex gap-3 text-[0.9375rem]">
            <input type="checkbox" checked={digital} onChange={(e) => setDigital(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-forest" />
            <span>
              Wyrażam zgodę na dostarczenie e-booka przed upływem 14 dni od zawarcia umowy i przyjmuję do wiadomości, że
              tracę wtedy prawo odstąpienia od umowy.
            </span>
          </label>
          <button type="submit" disabled={state === "loading"} className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-sm bg-forest px-7 font-semibold text-ivory transition-colors hover:bg-deep disabled:opacity-70">
            {state === "loading" ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Lock className="h-4 w-4" aria-hidden />}
            {state === "loading" ? "Łączenie z płatnością…" : `Kupuję i płacę ${price} zł`}
          </button>
          <p className="text-center text-[0.875rem] text-muted-foreground">BLIK, Przelewy24 lub karta. Płatność obsługuje Stripe.</p>
          <p role="alert" className={cn("min-h-6 text-[0.9375rem] text-[#9b3b2a]", state !== "error" && "sr-only")}>{state === "error" ? error : ""}</p>
        </form>
      ) : (
        <div className="mt-6">
          <button type="button" disabled className="inline-flex min-h-14 w-full cursor-not-allowed items-center justify-center rounded-sm bg-sage px-7 font-semibold text-deep/70">
            Sprzedaż ruszy wkrótce
          </button>
          <p className="mt-4 text-[0.9375rem] text-muted-foreground">
            To wersja przykładowa. Zapisz się do newslettera na{" "}
            <Link to="/" hash="newsletter" className="underline underline-offset-4">stronie głównej</Link>, a dam znać, gdy poradnik będzie dostępny.
          </p>
        </div>
      )}
    </div>
  );
}
