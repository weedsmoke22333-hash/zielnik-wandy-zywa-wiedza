<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Motion for React handles component/entrance motion; GSAP+ScrollTrigger (dynamically imported, gsap.context reverted on unmount) only for scroll-scrubbed effects; never both on one element.
- Portrait only via `WandaPortrait` (auto-detects src/assets/wanda-portrait.*); never generate, retouch or AI-edit human imagery.
- Herb/article/product content lives in typed `src/data/*.ts`; `src/test/content-rules.test.ts` must pass (sources, precautions, no cure claims).
- Server code in `src/lib/server/*` and `src/routes/api/*` only; secrets never use the VITE_ prefix.
- Integrations without keys must answer "not configured" — never fake success (newsletter, contact, payments).
- An order becomes `paid` only in `/api/stripe-webhook`. Prices always come from the database.
- Font sizes in rem (the A/A+/A++ switch scales the root font size). No ALL-CAPS eyebrows, no gradient washes, radius 2px.
