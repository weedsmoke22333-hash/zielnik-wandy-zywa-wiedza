# Wanda Machocka — herbal education & e-book shop

Polish-language site for Wanda Machocka: herb atlas, interactive harvesting calendar, poisonous
look-alikes, herb–drug interaction lookup, blog, and a digital e-book shop with secure downloads.

Stack: **TanStack Start (React 19 + TypeScript, SSR) · Vite · Tailwind v4 · Motion · GSAP ScrollTrigger ·
React Three Fiber · Supabase (Postgres, Auth, Storage) · Stripe Checkout (BLIK, Przelewy24, card) ·
MailerLite · Resend**. Deploys to Cloudflare Workers via Nitro (default for the Lovable template).

---

## Quick start

```bash
bun install            # or npm install
cp .env.example .env   # everything works without keys — integrations report "not configured"
bun run dev            # http://localhost:5173
bun run test           # routing + content compliance rules
bun run build
```

## Architecture

```
Browser ──► TanStack Start SSR pages (src/routes/*.tsx)
        └─► Server routes  (src/routes/api/*.ts)  ──► Supabase (service role, server only)
                                                  ├─► Stripe REST + verified webhooks
                                                  ├─► MailerLite (newsletter, lead magnet)
                                                  └─► Resend (contact, download e-mails)
```

**Why no Express server?** TanStack Start server routes *are* the Node/Workers backend: they run only on
the server, hold the secrets, validate with Zod, and ship in the same deploy. A separate Express app would
be a second backend to host and secure with no added capability. If you ever need one, the handlers in
`src/lib/server/*` are framework-agnostic (`Request → Response`) and can be mounted in Express/Hono as-is.

| Endpoint | Purpose |
|---|---|
| `POST /api/checkout` | Validates consent, reads the **price from the database**, creates a pending order + Stripe Checkout session (idempotency key = order id). |
| `POST /api/stripe-webhook` | Verifies `Stripe-Signature` (HMAC-SHA256, 5-min window). Idempotent via `stripe_events` table. **The only place an order becomes `paid`.** Sends the download e-mail incl. the digital-content consent confirmation. |
| `GET /api/order` | Order status for the confirmation page (by Stripe session id, or order id + secret token). |
| `GET /api/download` | Checks the order is paid + token matches, then 302 → 120-second signed URL to the PDF in the **private** `ebooks` bucket. Max 20 downloads. |
| `POST /api/newsletter` | MailerLite subscribe (double opt-in). Never reports success unless MailerLite accepted. |
| `POST /api/contact` | Resend e-mail, honeypot + rate limit. |
| `GET/PATCH /api/admin/products`, `POST /api/admin/upload-url`, `GET /api/admin/orders` | Admin API — Supabase JWT verified **and** `admin` role checked server-side. |
| `GET /api/public-config` | Non-secret runtime flags (which e-books are purchasable right now). |
| `GET /sitemap.xml` | Generated from the same data as the pages. |

Security: secrets never use the `VITE_` prefix; same-origin check on state-changing endpoints; Zod on
every payload; per-IP rate limit (best-effort, in-memory — also add a Cloudflare rate-limiting rule for
`/api/*` in production); structured JSON logs (`src/lib/server/http.ts`).

## Going live — checklist

1. **Supabase**: create a project, run `supabase/migrations/*.sql` (CLI `supabase db push` or SQL editor).
   Create Wanda's user in Auth, then grant admin with the SQL at the bottom of the migration.
2. **Env vars**: fill `.env` locally and the same keys as secrets in Cloudflare (Workers → Settings → Variables).
3. **Stripe**: enable BLIK and Przelewy24 in Payment methods. Add webhook endpoint
   `https://YOUR_DOMAIN/api/stripe-webhook` with events `checkout.session.completed`,
   `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`.
4. **Legal**: complete every `[PLACEHOLDER]` in `/regulamin`, `/polityka-prywatnosci`, `/polityka-cookies`,
   `/zwroty-i-reklamacje`; have a lawyer review; set `reviewed` on `LegalPage`. Confirm VAT status
   (e-books: 5% VAT in Poland, or the small-business exemption) and the invoicing/receipt flow with an accountant.
5. **Products**: in `/admin` upload each final PDF (+ cover), set prices, then **Publish**. The database refuses to
   publish an e-book without its file.
6. Set `PAYMENTS_ENABLED=true`. Test a full purchase in Stripe **test mode** first (BLIK test code `123456`).
7. **Newsletter**: MailerLite group with double opt-in + automation that e-mails
   `https://YOUR_DOMAIN/materialy/kalendarz-zbioru-ziol.pdf`.

## Content rules (enforced in code)

`src/test/content-rules.test.ts` fails the build if any herb, article or product:
- lacks an evidence level, contraindications, an interactions statement, or a verifiable https source;
- uses cure/prevention claims (`leczy`, `zapobiega`, `wzmacnia odporność`, `cudowny`, …);
- links to a missing look-alike, herb or product.

The same rules exist as `CHECK` constraints in Postgres (`herb_publish_rules`, `article_publish_rules`,
`published_needs_file`). Evidence levels follow EMA/HMPC categories (traditional vs. well-established use).

**Articles are drafts** (`reviewed: false`) and show "Tekst przykładowy — czeka na zatwierdzenie przez autorkę"
until Wanda approves them. Sample e-books are `draft` and not purchasable.

## Assets

- Portrait: `src/assets/wanda-portrait.jpg` (real photo, ~656 px — replace with the original high-res file;
  never AI-edit it). Add a high-res version via `PORTRAIT_SRCSET` in `WandaPortrait.tsx`.
- Wanda's voice: drop `src/assets/wanda-glos.mp3` and the audio player appears on `/o-mnie` and product pages.
- Lead magnet PDF: regenerate after editing herbs —
  `python3 scripts/make-pdf-fonts.py && bun run scripts/export-herbs.ts /tmp/h.json && node scripts/build-lead-magnet.cjs /tmp/h.json`
- Fonts are self-hosted (`@fontsource-variable`) — no requests to Google (GDPR).

## Lovable

This repo is connected to a Lovable project (two-way GitHub sync). Pushing to `main` updates Lovable.
Don't force-push or rewrite pushed history.
