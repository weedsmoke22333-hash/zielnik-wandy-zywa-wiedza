import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  latin: string;
  polish: string;
  note: string;
  className?: string;
};

/** Herbarium specimen: photo mounted on archival paper with tape strips and a specimen note. */
export function Specimen({ src, alt, width, height, latin, polish, note, className }: Props) {
  return (
    <figure className={cn("paper-grain specimen-shadow relative bg-paper p-4 pb-5 md:p-6", className)}>
      <span className="tape -left-5 top-6 -rotate-[24deg]" aria-hidden />
      <span className="tape -right-6 bottom-28 rotate-[18deg]" aria-hidden />
      <div className="overflow-hidden rounded-sm">
        <img src={src} alt={alt} width={width} height={height} loading="lazy" className="h-auto w-full" />
      </div>
      <figcaption className="ml-auto mt-4 w-fit max-w-[18rem] border border-brown/40 bg-ivory px-4 py-3 text-sm leading-snug">
        <span className="latin block text-lg text-deep">{latin}</span>
        <span className="block font-semibold text-brown">{polish}</span>
        <span className="mt-1 block text-muted-foreground">{note}</span>
      </figcaption>
    </figure>
  );
}
