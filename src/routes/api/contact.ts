import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { config, env } from "@/lib/server/env";
import { fail, json, log, notConfigured, parseJson, rateLimit, sameOrigin } from "@/lib/server/http";

const Body = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(10).max(5000),
  consent: z.literal(true),
  /** honeypot: must stay empty */
  website: z.string().max(0).optional(),
});

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!sameOrigin(request)) return fail(403, "forbidden", "Niedozwolone żądanie.");
        const limited = rateLimit(request, "contact", 3, 10 * 60_000);
        if (limited) return limited;
        const parsed = await parseJson(request, Body);
        if ("response" in parsed) return parsed.response;
        if (!config.contact()) {
          return notConfigured("contact", "Formularz nie jest jeszcze podłączony do poczty. Napisz bezpośrednio na adres e-mail podany obok.");
        }
        const { name, email, message } = parsed.data;
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { authorization: `Bearer ${env("RESEND_API_KEY")}`, "content-type": "application/json" },
          body: JSON.stringify({
            from: env("CONTACT_FROM_EMAIL"),
            to: [env("CONTACT_TO_EMAIL")],
            reply_to: email,
            subject: `Wiadomość ze strony od: ${name}`,
            html: `<p><strong>${esc(name)}</strong> &lt;${esc(email)}&gt;</p><p style="white-space:pre-wrap">${esc(message)}</p>`,
          }),
        });
        if (!res.ok) {
          log("warn", "contact.provider_error", { status: res.status });
          return fail(502, "provider_error", "Nie udało się wysłać wiadomości. Spróbuj ponownie za chwilę.");
        }
        log("info", "contact.sent");
        return json({ ok: true, message: "Dziękuję za wiadomość. Odpowiem najszybciej, jak to możliwe." });
      },
    },
  },
});
