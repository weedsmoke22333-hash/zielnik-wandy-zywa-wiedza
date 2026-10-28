import { cn } from "@/lib/utils";

// Real portrait lives at src/assets/wanda-portrait.{jpg,webp}. Never retouch or AI-edit it.
const found = import.meta.glob("/src/assets/wanda-portrait.{jpg,jpeg,webp,png}", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const portraitSrc = Object.values(found)[0];

/** Native size of the current source — keep the rendered size at or below this on 1x screens. */
export const PORTRAIT_NATIVE = { width: 656, height: 654 };
/** Optional future high-res sources, e.g. `${hiRes} 1600w`. Fill here; no other code changes needed. */
export const PORTRAIT_SRCSET: string | undefined = undefined;

const ALT = "Wanda Machocka w swojej zielarni, wśród słoików z suszonymi ziołami";

type Props = {
  className?: string;
  /** object-position; default focuses her face */
  position?: string;
  /** >1 tightens the crop around the face (keep ≤1.3 at native res) */
  zoom?: number;
  eager?: boolean;
  sizes?: string;
  srcSet?: string;
};

export function WandaPortrait({ className, position = "57% 30%", zoom = 1, eager, sizes = "(min-width: 1024px) 520px, 90vw", srcSet = PORTRAIT_SRCSET }: Props) {
  if (portraitSrc) {
    return (
      <div className={cn("relative overflow-hidden rounded-sm bg-deep", className)}>
        <img
          src={portraitSrc}
          srcSet={srcSet ? `${portraitSrc} ${PORTRAIT_NATIVE.width}w, ${srcSet}` : undefined}
          sizes={srcSet ? sizes : undefined}
          alt={ALT}
          className="h-full w-full object-cover"
          style={{ objectPosition: position, transform: zoom !== 1 ? `scale(${zoom})` : undefined, transformOrigin: position }}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          width={PORTRAIT_NATIVE.width}
          height={PORTRAIT_NATIVE.height}
        />
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-forest/15 mix-blend-soft-light" />
        <span aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgb(24_42_34/0.35)]" />
      </div>
    );
  }
  return (
    <div role="img" aria-label="Miejsce na portret Wandy Machockiej" className={cn("relative flex items-center justify-center overflow-hidden rounded-sm bg-forest p-3", className)}>
      <div className="paper-grain relative flex h-full w-full items-center justify-center border border-ivory/25">
        <p className="latin px-6 text-center text-xl text-ivory/80 md:text-2xl">Tu pojawi się portret Wandy</p>
      </div>
    </div>
  );
}
