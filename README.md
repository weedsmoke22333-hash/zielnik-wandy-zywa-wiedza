# Zielnik Wandy Zywa Wiedza

# Wanda Machocka — Premium Botanical Digital Editorial (PHASE 1 of 5)

Build the foundation and a visually outstanding, fully working HOMEPAGE for the Polish personal brand "Wanda Machocka" — herbal knowledge, responsible natural-wellness education, healthy habits, premium e-books. Audience: Polish adults 40–75. All UI copy in Polish. Stack: React + TypeScript + Vite + Tailwind + shadcn/ui (heavily restyled — must NOT look like shadcn defaults), Motion for React (framer-motion) for component motion, GSAP + ScrollTrigger only for scroll storytelling, Lucide icons, React Router. Do NOT build backend, payments or admin in this phase.

## Creative concept: "Żywy zielnik" (The Living Herbarium)
The single memorable idea: the site is a curated herbarium journal. Botanical photos are presented like pressed specimens on archival paper — mounted with thin paper-tape strips, accompanied by small handwritten-feel specimen notes (Latin name in italic serif + Polish name + one line). This motif appears in a few deliberate places, not everywhere. Everything else stays quiet, disciplined and editorial. Spend boldness in the hero and the herbarium motif only.

## Design tokens (exact)
Colors as CSS variables + Tailwind theme:
- ivory #F7F5EF (page bg), sage #DDE3D5 (secondary bg), forest #263D31 (primary), deep #182A22 (hero/footer bg), olive #879276, brown #78614D, copper #B88B66 (used sparingly — max one accent per viewport), white #FFFFFF.
- Text on ivory: deep #182A22; muted text: #4F5A4A (check WCAG AA ≥4.5:1). Text on deep: ivory.
Typography (Google Fonts):
- Display/headlines: "Newsreader" (use optical size display axis, weights 300–500, generous negative tracking on large sizes, true italics for Latin plant names only).
- Body/UI: "Manrope" 400/500/600.
- Body base size 18px (older readers), line-height 1.65, max line length ~68ch. Type scale ratio 1.333. Hero headline clamp(3.25rem, 7vw, 7rem), line-height 0.98.
Forbidden tells: no ALL-CAPS tracked eyebrow labels above every heading, no "01/02/03" numbering unless content is a real sequence, no middle-dot meta strings, no "→" appended to every button, no gradient washes, no glassmorphism, no identical rounded card grids, no generic soft grey shadow on everything. Border radius: 2px on images and buttons (archival, crisp), never pill-shaped buttons.

## Portrait — CRITICAL
The real portrait of Wanda Machocka will be supplied later. Create a single reusable `<WandaPortrait />` component that loads `/src/assets/wanda-portrait.jpg` (or webp). Until the real file exists, render an elegant placeholder: a deep-green archival frame with a subtle paper texture and the text "Tu pojawi się portret Wandy". NEVER generate, use stock, or AI-render a human face or person anywhere on the site.

## Imagery
Generate realistic, editorial botanical photography (no people, no hands, no faces): macro leaves (sage, mint, nettle, lemon balm), dried chamomile and calendula, linden blossoms, amber glass jars on linen, pressed specimens on aged paper, warm low morning sunlight, soft natural shadows. Muted, desaturated greens that match the palette. Also generate a subtle dark botanical-texture background for the hero (deep green, low contrast leaf veins). Optimize as webp, provide width/height to avoid CLS, lazy-load everything below the fold, eager-load the hero.

## Layout & navigation
- Shared `<Layout>` with header + footer + skip-to-content link.
- Header: wordmark "Wanda Machocka" in Newsreader. Transparent over the hero with ivory text, transitions to a solid ivory background with deep-green text after ~80px scroll. Links: O mnie, Zioła i rośliny, Odporność, Zdrowe nawyki, Blog, E-booki, Kontakt. Animated understated underline on hover AND focus-visible. Mobile: accessible drawer (focus trap, Esc closes, aria-expanded), tap targets ≥ 48px.
- Create routes now with tasteful placeholder pages (correct titles, H1, short intro) so every nav link works: /o-mnie, /ziola-i-rosliny, /odpornosc, /zdrowe-nawyki, /blog, /ebooki, /ebooki/:slug, /kontakt, /polityka-prywatnosci, /polityka-cookies, /regulamin, /zwroty-i-reklamacje.
- Footer (deep bg): wordmark, tagline, nav columns, legal links, and the educational disclaimer: "Treści na tej stronie mają charakter wyłącznie edukacyjny i nie zastępują porady lekarza ani farmaceuty. Przed zastosowaniem ziół, szczególnie przy przyjmowaniu leków, w ciąży lub w trakcie leczenia, skonsultuj się ze specjalistą."

## HOMEPAGE sections

### A. Hero (100svh, deep #182A22 bg + botanical texture)
Left: small specimen-note label "Zielnik · wiedza · codzienność" is NOT allowed — instead use a small italic serif line: "Herbarium codziennej troski". Then headline on two controlled lines:
"Blisko natury.
Świadomie dla zdrowia."
Supporting copy: "Wiedza o ziołach, naturalne inspiracje i praktyczne poradniki, które pomagają świadomie troszczyć się o siebie każdego dnia."
Primary CTA (copper fill, deep text): "Odkryj moje e-booki" → /ebooki. Secondary CTA (ivory outline): "Poznaj moją historię" → /o-mnie.
Right: `<WandaPortrait />` large, tall archival crop, with 2–3 cut-out botanical elements (transparent PNG leaves/sprigs generated for this) layered — one behind the portrait, one partially in front at the lower edge. Never over the face.
Cinematic entrance (one orchestrated sequence, ~1.8s total, Motion for React): bg fade → italic line → headline reveals line-by-line (mask/clip from below) → supporting text fades up 12px → buttons stagger → portrait reveals through a vertical clip-path mask wipe → foreground leaves settle → a single soft warm light sweep (diagonal, low-opacity radial highlight) passes across the portrait once.
Parallax (desktop only, transform-only, rAF/useScroll): texture slowest, portrait subtle, foreground leaves faster, a few very slow dust-in-sunlight particles (max ~12, CSS/canvas, cheap). Subtle pointer tilt on the portrait group (max 3°) desktop only. Minimal scroll indicator at bottom (thin line that draws downward, label "Przewiń").
Mobile: stack (portrait first, cropped shorter), no tilt, no particles, minimal parallax.

### B. Brand philosophy (ivory)
Headline: "Natura inspiruje. Wiedza pomaga wybierać świadomie."
Asymmetric editorial layout: large headline spanning left, three principles flowing in an offset column — NOT three equal cards. Principles (these are not a sequence, so no numbers): "Poznaj świat roślin.", "Dbaj o codzienne nawyki.", "Korzystaj z wiedzy odpowiedzialnie." each with 1–2 sentences of warm, factual copy. Two botanical photos in masked containers with restrained parallax (image moves inside its mask), one of them presented as a herbarium specimen with paper tape and a specimen note (e.g. "Melissa officinalis — melisa lekarska").

### C. Meet Wanda (background transitions ivory → sage as you scroll in)
Headline: "Poznajmy się bliżej." Portrait (same component, different crop) + warm first-person introductory copy explaining the educational purpose of the site: sharing herbal knowledge carefully, separating tradition from evidence, practical everyday habits. DO NOT invent biography, qualifications, years of experience, certifications, or personal stories — keep it about purpose and approach. CTA "Moja historia" → /o-mnie.

### D. Featured e-books (sage)
Headline: "Wiedza, do której możesz wracać."
Three physically convincing CSS-3D book mockups (front cover + visible spine thickness + page edges + realistic contact shadow; perspective; on desktop hover the book tilts a few degrees toward the pointer and the shadow shifts accordingly; keyboard focus gives equivalent state). Design each cover yourself in the brand language (typographic, botanical photo, different per book). Products (sample data in a typed `src/data/products.ts`, status "draft"):
1. "Zioła w codziennym życiu" — 39 zł
2. "Codzienne nawyki wspierające odporność" — 29 zł
3. "Domowy zielnik dla początkujących" — 49 zł
Each: title, short description, format "PDF", price, link to /ebooki/:slug. Show a small, honest note: "Wersje przykładowe — publikacja wkrótce".

### E. Botanical knowledge (ivory)
Immersive asymmetric image grid of article teasers (typed sample data in `src/data/articles.ts`): selected herbs and plants, traditional herbal use, healthy lifestyle habits, sleep and physical activity, responsible herbal use, interactions and precautions. Varied tile sizes, image zoom/secondary-crop on hover, soft reveal as they enter (one reveal pattern, not on every element). Link to /blog.

### F. Newsletter (deep bg)
Headline: "Zostańmy w kontakcie." Email field + consent checkbox (RODO wording) + button "Zapisz się". Client-side validation with clear Polish error messages. IMPORTANT: there is no newsletter backend yet — the submit must NOT pretend success. Wire it to a `subscribeNewsletter()` service stub that returns a "not configured" error, and show the honest message: "Zapisy ruszą wkrótce — newsletter nie jest jeszcze aktywny." Include loading state.

### G. Final CTA
Full-bleed warm botanical photo with subtle parallax background, deep overlay for contrast, message: "Zrób miejsce na wiedzę, która pomaga świadomie troszczyć się o siebie." Button "Poznaj moje e-booki" → /ebooki.

## Motion system rules
- A `useReducedMotion` / `prefers-reduced-motion` path everywhere: no parallax, no tilt, no particles, simple opacity fades only.
- Desktop-only magnetic micro-interaction on the two hero CTAs (max 6px pull).
- Never scroll-hijack; native scrolling only. No smooth-scroll libraries.
- Clean up all listeners, GSAP contexts (gsap.context + revert), observers, rAF loops on unmount.
- Transforms/opacity only; never animate layout properties.
- Don't run GSAP and Motion on the same element.

## Quality floor
Semantic HTML, one H1 per page, visible focus-visible rings (copper, 2px offset), all images with descriptive Polish alt text, no horizontal overflow at 360px, unique <title> and meta description per route (react-helmet-async), lang="pl". No console errors.

After building, reply with a short summary of what was implemented and what is placeholder.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/98c95080-854f-411a-9c21-4c09c074758e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
