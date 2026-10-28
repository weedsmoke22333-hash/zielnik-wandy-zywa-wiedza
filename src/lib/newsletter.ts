import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Wpisz swój adres e-mail." })
    .max(255, { message: "Adres e-mail jest zbyt długi." })
    .email({ message: "Ten adres e-mail wygląda na niepoprawny." }),
  consent: z.literal(true, { errorMap: () => ({ message: "Aby się zapisać, zaznacz zgodę." }) }),
});

export type SubscribeResult = { ok: true; message: string } | { ok: false; reason: "not_configured" | "error" | "invalid"; message: string };

/** Posts to /api/newsletter. Reports success only when the server confirms the provider accepted it. */
export async function subscribeNewsletter(email: string, source: "home" | "kalendarz" | "blog" = "home"): Promise<SubscribeResult> {
  try {
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, consent: true, source }),
    });
    const body = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; code?: string };
    if (res.ok && body.ok) return { ok: true, message: body.message ?? "Dziękuję za zapis." };
    if (res.status === 503) return { ok: false, reason: "not_configured", message: body.message ?? "Zapisy ruszą wkrótce." };
    if (res.status === 400) return { ok: false, reason: "invalid", message: body.message ?? "Sprawdź adres e-mail." };
    return { ok: false, reason: "error", message: body.message ?? "Nie udało się zapisać adresu. Spróbuj ponownie za chwilę." };
  } catch {
    return { ok: false, reason: "error", message: "Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie." };
  }
}
