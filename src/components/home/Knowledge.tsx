import { Link } from "@tanstack/react-router";
import { articles } from "@/data/articles";
import { cn } from "@/lib/utils";

const layout = [
  "md:col-span-5 md:row-span-2 aspect-[3/4] md:aspect-auto",
  "md:col-span-7 aspect-[16/10]",
  "md:col-span-4 aspect-[4/3]",
  "md:col-span-3 aspect-[3/4]",
  "md:col-span-7 aspect-[16/9]",
  "md:col-span-5 aspect-[4/3] bg-paper",
];

export function Knowledge() {
  return (
    <section aria-labelledby="wiedza" className="bg-ivory py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-6 md:grid-cols-12">
          <h2 id="wiedza" className="text-h2 md:col-span-7">
            Wiedza o roślinach <span className="text-forest">i codzienności</span>
          </h2>
          <p className="measure text-muted-foreground md:col-span-5 md:self-end">
            Opisy ziół, tradycyjne zastosowania, nawyki i zasady bezpieczeństwa — wszystko w jednym, spokojnie
            prowadzonym zielniku.
          </p>
        </div>
        <ul className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-12">
          {articles.map((a, i) => (
            <li
              key={a.slug}
              className={cn("relative min-w-0", (layout[i] ?? "").split(" ").filter((c) => c.startsWith("md:")).join(" "))}
            >
              <Link to="/blog" className="group block h-full">
                <div className={cn("relative w-full overflow-hidden rounded-sm md:h-full md:min-h-[260px]", (layout[i] ?? "").split(" ").filter((c) => !c.startsWith("md:")).join(" "))}>
                  <img
                    src={a.image.src}
                    alt={a.image.alt}
                    width={a.image.width}
                    height={a.image.height}
                    loading="lazy"
                    className={cn(
                      "absolute inset-0 h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06] group-focus-visible:scale-[1.06]",
                      i === 5 ? "object-contain p-8" : "object-cover",
                    )}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-deep/80 p-5 text-ivory md:bg-deep/75">
                    <p className="latin text-[15px] text-sage">{a.category}</p>
                    <h3 className="mt-1 font-display text-xl leading-tight md:text-2xl">{a.title}</h3>
                    <p className="mt-2 hidden text-[15px] text-ivory/80 lg:block">{a.excerpt}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/blog" className="link-underline mt-12 inline-block text-lg font-semibold text-forest">
          Przejdź do bloga
        </Link>
      </div>
    </section>
  );
}
