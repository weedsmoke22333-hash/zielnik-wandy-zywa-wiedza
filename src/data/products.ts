export type ProductStatus = "draft" | "published";

export type Product = {
  slug: string;
  title: string;
  description: string;
  format: "PDF";
  priceZl: number;
  status: ProductStatus;
  cover: { variant: "forest" | "ivory" | "copper"; latin: string };
};

export const products: Product[] = [
  {
    slug: "ziola-w-codziennym-zyciu",
    title: "Zioła w codziennym życiu",
    description: "Przewodnik po kilkunastu popularnych roślinach: jak je rozpoznać, przechowywać i rozsądnie włączać do codzienności.",
    format: "PDF",
    priceZl: 39,
    status: "draft",
    cover: { variant: "forest", latin: "Salvia officinalis" },
  },
  {
    slug: "codzienne-nawyki-wspierajace-odpornosc",
    title: "Codzienne nawyki wspierające odporność",
    description: "Sen, ruch, sposób odżywiania i odpoczynek — proste, praktyczne nawyki opisane spokojnie i bez obietnic cudów.",
    format: "PDF",
    priceZl: 29,
    status: "draft",
    cover: { variant: "ivory", latin: "Tilia cordata" },
  },
  {
    slug: "domowy-zielnik-dla-poczatkujacych",
    title: "Domowy zielnik dla początkujących",
    description: "Jak założyć mały zielnik na parapecie lub w ogrodzie, zbierać rośliny i suszyć je bezpiecznie.",
    format: "PDF",
    priceZl: 49,
    status: "draft",
    cover: { variant: "copper", latin: "Calendula officinalis" },
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
