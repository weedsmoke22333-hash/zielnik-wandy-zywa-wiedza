import { useEffect, useRef, type ReactNode } from "react";

const TONES: Record<string, string> = { ivory: "#F7F5EF", sage: "#DDE3D5" };

/**
 * One continuous background-tone story across its child sections.
 * Each direct child section declares data-tone; a single scrubbed timeline tweens --story-bg.
 */
export function Story({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const sections = () => Array.from(el.querySelectorAll<HTMLElement>(":scope > [data-tone]"));
    const first = sections()[0]?.dataset["tone"] ?? "ivory";
    el.style.setProperty("--story-bg", TONES[first] ?? TONES["ivory"]!);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // static: each section keeps its own tone
      sections().forEach((s) => (s.style.backgroundColor = TONES[s.dataset["tone"] ?? "ivory"]!));
      return;
    }

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    let ctxCleanup = () => {};
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const build = () => {
        ctx?.revert();
        ctx = gsap.context(() => {
          const vh = window.innerHeight;
          const total = el.offsetHeight - vh;
          if (total <= 0) return;
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 },
          });
          tl.set(el, { "--story-bg": TONES[first] }, 0);
          sections().forEach((s, i) => {
            if (i === 0) return;
            const startPx = Math.max(0, s.offsetTop - vh * 0.75);
            const len = vh * 0.5;
            tl.to(el, { "--story-bg": TONES[s.dataset["tone"] ?? "ivory"], duration: len / total }, startPx / total);
          });
          tl.to({}, { duration: Math.max(0, 1 - tl.duration()) });
        }, el);
      };

      build();
      const refresh = () => {
        build();
        ScrollTrigger.refresh();
      };
      void document.fonts?.ready.then(refresh);
      if (document.readyState !== "complete") window.addEventListener("load", refresh, { once: true });
      window.addEventListener("resize", refresh);
      ctxCleanup = () => {
        window.removeEventListener("load", refresh);
        window.removeEventListener("resize", refresh);
      };
    })();

    return () => {
      cancelled = true;
      ctxCleanup();
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={root} className="story">
      {children}
    </div>
  );
}
