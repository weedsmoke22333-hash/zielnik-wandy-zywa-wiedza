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

export type SubscribeResult = { ok: true } | { ok: false; reason: "not_configured" | "error"; message: string };

/** Stub: there is no newsletter provider yet. Never reports success. */
export async function subscribeNewsletter(_email: string): Promise<SubscribeResult> {
  await new Promise((r) => setTimeout(r, 700));
  return {
    ok: false,
    reason: "not_configured",
    message: "Zapisy ruszą wkrótce — newsletter nie jest jeszcze aktywny.",
  };
}
