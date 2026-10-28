import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { EVIDENCE_LABEL, type EvidenceLevel, type Source } from "@/data/herbs";
import { cn } from "@/lib/utils";

/** Page opening used by every inner page: Latin marginalia, H1, intro. */
export function PageIntro({
  latin,
  title,
  intro,
  crumbs,
  children,
  className,
}: {
  latin?: string;
  title: string;
  intro?: ReactNode;
  crumbs?: { to: string; label: string }[];
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mx-auto max-w-[1400px] px-5 pt-36 md:px-10 md:pt-44", className)}>
      {crumbs && (
        <nav aria-label="Ścieżka" className="mb-6 text-[0.9375rem] text-muted-foreground print:hidden">
          <ol className="flex flex-wrap items-center gap-x-2">
            <li>
              <Link to="/" className="link-underline">Strona główna</Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.to} className="flex items-center gap-2">
                <span aria-hidden>/</span>
                <Link to={c.to} className="link-underline">{c.label}</Link>
              </li>
            ))}
          </ol>
        </nav>
      )}
      {latin && <p className="latin text-xl text-brown">{latin}</p>}
      <h1 className="text-h2 mt-3 max-w-[22ch]">{title}</h1>
      {intro && <div className="measure mt-8 text-xl text-muted-foreground">{intro}</div>}
      {children}
    </header>
  );
}

export function EvidenceBadge({ level, className }: { level: EvidenceLevel; className?: string }) {
  const e = EVIDENCE_LABEL[level];
  const tone =
    level === "dobrze-udokumentowane"
      ? "border-forest bg-forest text-ivory"
      : level === "tradycyjne"
        ? "border-brown/60 text-brown"
        : "border-olive text-forest";
  return (
    <span title={e.description} className={cn("inline-flex min-h-8 items-center rounded-sm border px-3 text-[0.875rem] font-semibold", tone, className)}>
      {e.label}
    </span>
  );
}

export function SourceList({ sources, className }: { sources: Source[]; className?: string }) {
  return (
    <div className={cn("border-t border-border pt-6", className)}>
      <h2 className="font-display text-2xl">Źródła</h2>
      <ul className="mt-3 space-y-2 text-[0.9375rem] text-muted-foreground">
        {sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-brown/40 underline-offset-4 hover:decoration-brown print:no-underline">
              {s.label}
            </a>
            <span className="hidden break-all print:inline"> — {s.url}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Precautions({ items, title = "Zanim zastosujesz", className }: { items: string[]; title?: string; className?: string }) {
  return (
    <aside aria-label={title} className={cn("paper-grain border-l-4 border-copper bg-paper px-6 py-6 md:px-8", className)}>
      <h2 className="font-display text-2xl">{title}</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-copper">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </aside>
  );
}

export function HealthDisclaimer({ className }: { className?: string }) {
  return (
    <p className={cn("measure text-[0.9375rem] leading-relaxed text-muted-foreground", className)}>
      Treść ma charakter edukacyjny i nie zastępuje porady lekarza ani farmaceuty. Przy przyjmowaniu leków, w ciąży,
      podczas karmienia piersią i w chorobach przewlekłych skonsultuj stosowanie ziół ze specjalistą.
    </p>
  );
}

/** Typographic herbarium label used when a plant has no photograph yet. */
export function HerbLabel({ latin, polish, family, className, size = "md" }: { latin: string; polish: string; family?: string; className?: string; size?: "md" | "lg" }) {
  return (
    <div className={cn("paper-grain relative flex h-full flex-col justify-between bg-paper p-6 text-deep", className)}>
      <span className="tape -right-4 -top-2 w-20 rotate-[14deg] opacity-80" aria-hidden />
      <p className="text-[0.8125rem] font-semibold text-brown">Herbarium Wandy Machockiej</p>
      <div>
        <p className={cn("latin leading-[1.05]", size === "lg" ? "text-[2.6rem]" : "text-[1.9rem]")}>{latin}</p>
        <p className="mt-2 font-semibold text-brown">{polish}</p>
      </div>
      {family && <p className="border-t border-brown/30 pt-3 text-[0.875rem] text-muted-foreground">{family}</p>}
    </div>
  );
}

export function DraftNote({ children }: { children: ReactNode }) {
  return <p className="border-l-2 border-brown/50 pl-4 text-[0.9375rem] text-muted-foreground">{children}</p>;
}
