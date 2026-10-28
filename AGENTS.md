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
- Portrait only via `WandaPortrait` (auto-detects src/assets/wanda-portrait.*); never generate human imagery.
- Sample content lives in typed `src/data/*.ts`; services without a backend (e.g. newsletter) are stubs that must not report success.
