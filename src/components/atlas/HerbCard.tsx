import { Link } from "@tanstack/react-router";
import type { Herb } from "@/data/herbs";
import { MONTHS_PL } from "@/data/herbs";
import { EvidenceBadge, HerbLabel } from "@/components/site/Editorial";

export function harvestSummary(h: Herb) {
  return h.harvest
    .map((x) => {
      const ms = x.months;
      const range = ms.length > 1 ? `${MONTHS_PL[ms[0]! - 1]}–${MONTHS_PL[ms[ms.length - 1]! - 1]}` : MONTHS_PL[ms[0]! - 1];
      return `${x.part}: ${range}`;
    })
    .join("; ");
}

export function HerbCard({ herb }: { herb: Herb }) {
  return (
    <Link to="/ziola-i-rosliny/$slug" params={{ slug: herb.slug }} className="group block h-full">
      <article className="flex h-full flex-col">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
          {herb.image ? (
            <img
              src={herb.image.src}
              alt={herb.image.alt}
              width={herb.image.width}
              height={herb.image.height}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05] group-focus-visible:scale-[1.05]"
            />
          ) : (
            <HerbLabel latin={herb.latin} polish={herb.polish} family={herb.family} className="transition-colors duration-500 group-hover:bg-[#e8e1cf]" />
          )}
          {herb.lookalike && (
            <span className="absolute left-3 top-3 rounded-sm bg-deep/85 px-2.5 py-1 text-[0.8125rem] font-semibold text-ivory">
              Ma trującego sobowtóra
            </span>
          )}
        </div>
        <div className="mt-5 flex flex-1 flex-col">
          <h3 className="latin text-2xl leading-tight group-hover:text-forest">{herb.latin}</h3>
          <p className="font-semibold text-brown">{herb.polish}</p>
          <p className="mt-3 text-[0.9375rem] text-muted-foreground">{harvestSummary(herb)}</p>
          <div className="mt-4">
            <EvidenceBadge level={herb.evidence} />
          </div>
        </div>
      </article>
    </Link>
  );
}
