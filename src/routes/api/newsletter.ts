import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { config, env } from "@/lib/server/env";
import { fail, json, log, notConfigured, parseJson, rateLimit, sameOrigin } from "@/lib/server/http";

const Body = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  consent: z.literal(true),
  source: z.enum(["home", "kalendarz", "blog"]).default("home"),
});

/**
 * Newsletter + lead magnet sign-up. Subscribes to a MailerLite group; the group's
 * double opt-in and automation send the confirmation and the free PDF calendar.
 * Never reports success unless MailerLite accepted the subscriber.
 */
export const Route = createFileRoute("/api/newsletter")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!sameOrigin(request)) return fail(403, "forbidden", "Niedozwolone żądanie.");
        const limited = rateLimit(request, "newsletter", 5, 10 * 60_000);
        if (limited) return limited;
        const parsed = await parseJson(request, Body);
        if ("response" in parsed) return parsed.response;
        if (!config.newsletter()) {
          return notConfigured("newsletter", "Zapisy ruszą wkrótce — newsletter nie jest jeszcze aktywny.");
        }
        try {
          const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
            method: "POST",
            headers: {
              authorization: `Bearer ${env("MAILERLITE_API_KEY")}`,
              "content-type": "application/json",
              accept: "application/json",
            },
            body: JSON.stringify({
              email: parsed.data.email,
              groups: [env("MAILERLITE_GROUP_ID")],
              fields: { signup_source: parsed.data.source },
            }),
          });
          if (!res.ok) {
            log("warn", "newsletter.provider_error", { status: res.status });
            return fail(502, "provider_error", "Nie udało się zapisać adresu. Spróbuj ponownie za chwilę.");
          }
          log("info", "newsletter.subscribed", { source: parsed.data.source });
          return json({ ok: true, message: "Sprawdź skrzynkę i potwierdź zapis — potem wyślę Ci kalendarz." });
        } catch (e) {
          log("error", "newsletter.exception", { message: (e as Error).message });
          return fail(502, "provider_error", "Nie udało się zapisać adresu. Spróbuj ponownie za chwilę.");
        }
      },
    },
  },
});
