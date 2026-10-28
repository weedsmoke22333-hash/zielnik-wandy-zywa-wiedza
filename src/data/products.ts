/**
 * E-book catalogue (static fallback). When Supabase is configured, the shop reads the `products`
 * table instead (same shape, see supabase/migrations) — prices and status are then managed in /admin.
 *
 * All four listings are DRAFTS: sample titles, contents and preview pages written to show the
 * format. They are not purchasable until the owner supplies the final PDF and approves the copy.
 */
export type ProductStatus = "draft" | "published";
export type ProductCategory = "ziola" | "nawyki" | "uprawa" | "pakiet";

export type SamplePage =
  | { kind: "title"; heading: string; sub?: string }
  | { kind: "toc"; heading: string; items: string[] }
  | { kind: "text"; heading: string; paragraphs: string[]; latin?: string }
  | { kind: "note"; heading: string; paragraphs: string[] };

export type Product = {
  slug: string;
  title: string;
  description: string;
  longDescription: string[];
  category: ProductCategory;
  format: "PDF";
  priceZl: number;
  status: ProductStatus;
  cover: { variant: "forest" | "ivory" | "copper" | "bundle"; latin: string };
  toc: string[];
  forWhom: string[];
  safety?: string;
  samplePages: SamplePage[];
  relatedHerbs: string[];
  /** For bundles: slugs of included e-books. */
  includes?: string[];
};

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  ziola: "Zioła",
  nawyki: "Nawyki",
  uprawa: "Uprawa i zbiór",
  pakiet: "Pakiety",
};

const SAFETY =
  "Poradnik ma charakter edukacyjny i nie zastępuje porady lekarza ani farmaceuty. Przy przyjmowaniu leków, w ciąży, podczas karmienia piersią i w chorobach przewlekłych zawsze skonsultuj stosowanie ziół ze specjalistą.";

export const products: Product[] = [
  {
    slug: "ziola-w-codziennym-zyciu",
    title: "Zioła w codziennym życiu",
    description: "Przewodnik po kilkunastu popularnych roślinach: jak je rozpoznać, przechowywać i rozsądnie włączać do codzienności.",
    longDescription: [
      "Spokojny, praktyczny przewodnik po roślinach, które znamy z ogrodu, łąki i kuchennej półki. Każda ma swoją kartę: jak wygląda, którą część się wykorzystuje, co mówi tradycja, a co monografie Europejskiej Agencji Leków.",
      "Przy każdej roślinie znajdziesz też to, o czym poradniki często milczą: przeciwwskazania, możliwe interakcje z lekami i sytuacje, w których lepiej zrezygnować.",
    ],
    category: "ziola",
    format: "PDF",
    priceZl: 39,
    status: "draft",
    cover: { variant: "forest", latin: "Salvia officinalis" },
    toc: [
      "Jak czytać ten poradnik",
      "Tradycja a badania — dwa rodzaje wiedzy",
      "Karty roślin: melisa, szałwia, mięta, rumianek, lipa, nagietek i inne",
      "Suszenie i przechowywanie",
      "Bezpieczeństwo: przeciwwskazania i interakcje",
      "Słowniczek i źródła",
    ],
    forWhom: [
      "dla osób, które chcą korzystać z ziół świadomie, a nie „na oko”",
      "dla początkujących — bez specjalistycznego słownictwa",
      "dla tych, którzy chcą wiedzieć, kiedy zioła nie są dobrym pomysłem",
    ],
    safety: SAFETY,
    samplePages: [
      { kind: "title", heading: "Zioła w codziennym życiu", sub: "Wanda Machocka" },
      { kind: "toc", heading: "Spis treści", items: ["Jak czytać ten poradnik", "Tradycja a badania", "Karty roślin", "Suszenie i przechowywanie", "Bezpieczeństwo", "Źródła"] },
      { kind: "text", heading: "Melisa lekarska", latin: "Melissa officinalis", paragraphs: [
        "Liście zbieramy przed kwitnieniem, w suchy dzień, gdy rosa już opadnie. Najwięcej aromatu mają w czerwcu i lipcu.",
        "Tradycyjnie melisę stosuje się przy łagodnych objawach stresu i jako wsparcie zasypiania. To wiedza oparta na długiej tradycji, nie na badaniach klinicznych.",
      ] },
      { kind: "note", heading: "Zanim sięgniesz po napar", paragraphs: [
        "Według Europejskiej Agencji Leków melisy nie zaleca się dzieciom poniżej 12 lat.",
        "W ciąży i podczas karmienia piersią porozmawiaj najpierw z lekarzem.",
      ] },
    ],
    relatedHerbs: ["melisa-lekarska", "szalwia-lekarska", "rumianek-pospolity", "lipa-drobnolistna"],
  },
  {
    slug: "codzienne-nawyki-wspierajace-odpornosc",
    title: "Codzienne nawyki wspierające odporność",
    description: "Sen, ruch, sposób odżywiania i odpoczynek — proste, praktyczne nawyki opisane spokojnie i bez obietnic cudów.",
    longDescription: [
      "Ten poradnik nie obiecuje, że jakiekolwiek zioło „wzmocni odporność”. Zamiast tego pokazuje to, co naprawdę ma znaczenie i jest dobrze opisane w zaleceniach zdrowotnych: sen, ruch, sposób odżywiania, odpoczynek i rozmowę z lekarzem o profilaktyce.",
      "Każdy rozdział kończy się jednym małym krokiem do wprowadzenia od jutra.",
    ],
    category: "nawyki",
    format: "PDF",
    priceZl: 29,
    status: "draft",
    cover: { variant: "ivory", latin: "Tilia cordata" },
    toc: [
      "Co naprawdę wiemy o odporności",
      "Sen — fundament, o którym zapominamy",
      "Ruch na co dzień, także po sześćdziesiątce",
      "Talerz bez obsesji",
      "Stres i odpoczynek",
      "Profilaktyka: o co zapytać lekarza",
      "Mity, które warto odłożyć na półkę",
    ],
    forWhom: [
      "dla osób, które chcą zadbać o siebie bez kosztownych suplementów",
      "dla tych, którzy mają dość sprzecznych porad w internecie",
    ],
    safety: SAFETY,
    samplePages: [
      { kind: "title", heading: "Codzienne nawyki wspierające odporność", sub: "Wanda Machocka" },
      { kind: "toc", heading: "Spis treści", items: ["Co wiemy o odporności", "Sen", "Ruch", "Talerz bez obsesji", "Stres i odpoczynek", "Profilaktyka", "Mity"] },
      { kind: "text", heading: "Sen — fundament", paragraphs: [
        "Dorosłym zaleca się co najmniej siedem godzin snu na dobę. Brzmi prosto, a jednak to pierwszy nawyk, z którego rezygnujemy.",
        "Zacznij od stałej pory wstawania — także w weekend. To ona najmocniej porządkuje rytm dnia.",
      ] },
      { kind: "note", heading: "Mały krok na jutro", paragraphs: ["Ustaw budzik na tę samą godzinę przez siedem kolejnych dni i zapisz, jak się czujesz."] },
    ],
    relatedHerbs: ["lipa-drobnolistna", "bez-czarny"],
  },
  {
    slug: "domowy-zielnik-dla-poczatkujacych",
    title: "Domowy zielnik dla początkujących",
    description: "Jak założyć mały zielnik na parapecie lub w ogrodzie, zbierać rośliny i suszyć je bezpiecznie.",
    longDescription: [
      "Od pierwszej doniczki do własnej, opisanej kolekcji suszu. Poradnik prowadzi krok po kroku: co posadzić na parapecie, a co w ogrodzie, kiedy zbierać i jak suszyć, żeby roślina zachowała aromat.",
      "Osobny rozdział poświęcony jest bezpieczeństwu: roślinom chronionym i trującym sobowtórom, z którymi łatwo pomylić popularne zioła.",
    ],
    category: "uprawa",
    format: "PDF",
    priceZl: 49,
    status: "draft",
    cover: { variant: "copper", latin: "Calendula officinalis" },
    toc: [
      "Parapet, balkon czy ogród?",
      "Pierwszych dziesięć roślin",
      "Kalendarz zbioru",
      "Suszenie krok po kroku",
      "Przechowywanie i opisywanie suszu",
      "Rośliny chronione i trujące sobowtóry",
    ],
    forWhom: ["dla osób, które chcą mieć własne zioła pod ręką", "dla działkowców i miłośników parapetowych upraw"],
    safety: SAFETY,
    samplePages: [
      { kind: "title", heading: "Domowy zielnik dla początkujących", sub: "Wanda Machocka" },
      { kind: "toc", heading: "Spis treści", items: ["Parapet, balkon czy ogród?", "Pierwszych dziesięć roślin", "Kalendarz zbioru", "Suszenie", "Przechowywanie", "Bezpieczeństwo"] },
      { kind: "text", heading: "Suszenie krok po kroku", paragraphs: [
        "Zioła susz w cieniu, w przewiewnym miejscu, rozłożone cienką warstwą. Słońce wypala olejki eteryczne i kolor.",
        "Susz jest gotowy, gdy liście kruszą się w palcach. Przechowuj go w szczelnych słoikach z etykietą: nazwa, część rośliny, data zbioru.",
      ] },
      { kind: "note", heading: "Zasada jednego roku", paragraphs: ["Susz starszy niż rok zwykle traci aromat. Raz w roku przejrzyj zapasy i zrób miejsce na nowe zbiory."] },
    ],
    relatedHerbs: ["nagietek-lekarski", "mieta-pieprzowa", "czosnek-niedzwiedzi"],
  },
  {
    slug: "zielnik-kompletny",
    title: "Zielnik kompletny — pakiet trzech poradników",
    description: "Wszystkie trzy e-booki w jednym pakiecie: zioła, codzienne nawyki i domowy zielnik.",
    longDescription: [
      "Pakiet zawiera trzy poradniki: „Zioła w codziennym życiu”, „Codzienne nawyki wspierające odporność” i „Domowy zielnik dla początkujących”.",
      "Kupione osobno kosztują 117 zł. W pakiecie płacisz 99 zł.",
    ],
    category: "pakiet",
    format: "PDF",
    priceZl: 99,
    status: "draft",
    cover: { variant: "bundle", latin: "Herbarium" },
    toc: ["Zioła w codziennym życiu", "Codzienne nawyki wspierające odporność", "Domowy zielnik dla początkujących"],
    forWhom: ["dla osób, które chcą mieć całą bibliotekę w jednym miejscu", "na prezent"],
    safety: SAFETY,
    samplePages: [],
    relatedHerbs: [],
    includes: ["ziola-w-codziennym-zyciu", "codzienne-nawyki-wspierajace-odpornosc", "domowy-zielnik-dla-poczatkujacych"],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const singleProducts = products.filter((p) => p.category !== "pakiet");
export const bundle = products.find((p) => p.category === "pakiet");
export const bundleSeparateTotal = (b: Product) =>
  (b.includes ?? []).reduce((sum, s) => sum + (getProduct(s)?.priceZl ?? 0), 0);
