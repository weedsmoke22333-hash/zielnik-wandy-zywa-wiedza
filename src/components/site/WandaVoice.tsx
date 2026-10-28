import { cn } from "@/lib/utils";

// Drop a recording at src/assets/wanda-glos.mp3 (or .m4a) and the player appears automatically.
const found = import.meta.glob("/src/assets/wanda-glos.{mp3,m4a}", { eager: true, import: "default" }) as Record<string, string>;
const src = Object.values(found)[0];

/** Wanda reading a short fragment in her own voice. Renders nothing until the file exists. */
export function WandaVoice({ title = "Posłuchaj fragmentu czytanego przez Wandę", className }: { title?: string; className?: string }) {
  if (!src) return null;
  return (
    <figure className={cn("border-l-4 border-copper bg-paper px-6 py-5", className)}>
      <figcaption className="font-display text-xl">{title}</figcaption>
      <audio controls preload="none" src={src} className="mt-4 w-full">
        Twoja przeglądarka nie odtwarza nagrań audio.
      </audio>
    </figure>
  );
}
