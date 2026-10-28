import { cn } from "@/lib/utils";

// Drop the real file as src/assets/wanda-portrait.jpg (or .webp) — it is picked up automatically.
const found = import.meta.glob("/src/assets/wanda-portrait.{jpg,jpeg,webp,png}", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const portraitSrc = Object.values(found)[0];

type Props = {
  className?: string;
  /** object-position for different crops */
  position?: string;
  eager?: boolean;
  tone?: "dark" | "light";
};

export function WandaPortrait({ className, position = "50% 25%", eager, tone = "dark" }: Props) {
  if (portraitSrc) {
    return (
      <div className={cn("relative overflow-hidden rounded-sm", className)}>
        <img
          src={portraitSrc}
          alt="Portret Wandy Machockiej"
          className="h-full w-full object-cover"
          style={{ objectPosition: position }}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          width={900}
          height={1200}
        />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label="Miejsce na portret Wandy Machockiej"
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-sm p-3",
        tone === "dark" ? "bg-forest" : "bg-forest/90",
        className,
      )}
    >
      <div className="paper-grain relative flex h-full w-full items-center justify-center border border-ivory/25 bg-paper/[0.06]">
        <div className="absolute inset-3 border border-ivory/10" />
        <p className="latin px-6 text-center text-xl text-ivory/80 md:text-2xl">Tu pojawi się portret Wandy</p>
      </div>
    </div>
  );
}
