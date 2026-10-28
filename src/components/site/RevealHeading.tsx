import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The one site-wide headline reveal: text rises from a mask, once.
 * Visible by default (SSR / no JS); only headings still below the fold get hidden, then revealed.
 */
export function RevealHeading({ children, className, id, as: Tag = "h2" }: { children: ReactNode; className?: string; id?: string; as?: "h1" | "h2" }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.dataset.reveal = "pending";
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          el.dataset.reveal = "done";
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <Tag ref={ref} id={id} className={cn("reveal-mask", className)}>
      <span className="reveal-line">{children}</span>
    </Tag>
  );
}
