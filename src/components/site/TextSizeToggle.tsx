import { useEffect, useState } from "react";
import { TEXT_SIZE_KEY, type TextSize } from "@/lib/site";
import { cn } from "@/lib/utils";

const OPTIONS: { value: TextSize; label: string; name: string; size: string }[] = [
  { value: "md", label: "A", name: "Tekst standardowy", size: "text-[0.95rem]" },
  { value: "lg", label: "A+", name: "Tekst większy", size: "text-[1.05rem]" },
  { value: "xl", label: "A++", name: "Tekst największy", size: "text-[1.15rem]" },
];

function apply(size: TextSize) {
  const el = document.documentElement;
  if (size === "md") delete el.dataset["textSize"];
  else el.dataset["textSize"] = size;
  try {
    if (size === "md") localStorage.removeItem(TEXT_SIZE_KEY);
    else localStorage.setItem(TEXT_SIZE_KEY, size);
  } catch {
    /* storage unavailable (private mode) — the choice still applies for this visit */
  }
}

/** A / A+ / A++ text size switch. Scales the whole site via the root font size. */
export function TextSizeToggle({ className, tone = "auto" }: { className?: string; tone?: "auto" | "light" }) {
  const [size, setSize] = useState<TextSize>("md");

  useEffect(() => {
    const current = document.documentElement.dataset["textSize"];
    setSize(current === "lg" || current === "xl" ? current : "md");
  }, []);

  return (
    <div role="group" aria-label="Rozmiar tekstu" className={cn("flex items-center", className)}>
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={size === o.value}
          aria-label={o.name}
          title={o.name}
          onClick={() => {
            setSize(o.value);
            apply(o.value);
          }}
          className={cn(
            "flex h-11 min-w-11 items-center justify-center px-1.5 font-display leading-none transition-colors",
            o.size,
            size === o.value
              ? "underline decoration-copper decoration-2 underline-offset-[6px]"
              : tone === "light"
                ? "opacity-70 hover:opacity-100"
                : "opacity-60 hover:opacity-100",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
