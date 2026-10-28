import type { Source } from "./herbs";

/**
 * "Trujące sobowtóry" — useful plants and their dangerous look-alikes.
 * Kept deliberately conservative: the message is always "if unsure, do not pick".
 */
export type Lookalike = {
  slug: string;
  title: string;
  safe: { polish: string; latin: string; herbSlug?: string };
  dangerous: { polish: string; latin: string; toxin: string }[];
  season: string;
  differences: { feature: string; safe: string; dangerous: string }[];
  rule: string;
  sources: Source[];
};

const wiki = (title: string): Source => ({
  label: `Wikipedia — ${title.replace(/_/g, " ")}`,
  url: `https://pl.wikipedia.org/wiki/${encodeURIComponent(title)}`,
});
const ISAP_PROTECTION: Source = {
  label: "Rozporządzenie w sprawie ochrony gatunkowej roślin (Dz.U. 2014 poz. 1409)",
  url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20140001409",
};

export const lookalikes: Lookalike[] = [
  {
    slug: "czosnek-niedzwiedzi-konwalia-zimowit",
    title: "Czosnek niedźwiedzi, konwalia i zimowit",
    safe: { polish: "czosnek niedźwiedzi", latin: "Allium ursinum", herbSlug: "czosnek-niedzwiedzi" },
    dangerous: [
      { polish: "konwalia majowa", latin: "Convallaria majalis", toxin: "glikozydy nasercowe" },
      { polish: "zimowit jesienny", latin: "Colchicum autumnale", toxin: "kolchicyna" },
    ],
    season: "Marzec–maj: wszystkie trzy rośliny mają wtedy podobne, lancetowate liście.",
    differences: [
      { feature: "Jak wyrastają liście", safe: "każdy liść osobno, na własnym, cienkim ogonku", dangerous: "konwalia: zwykle dwa liście obejmujące się u nasady; zimowit: kępa liści bez ogonków, jak u tulipana" },
      { feature: "Zapach", safe: "po roztarciu wyraźny zapach czosnku", dangerous: "bez czosnkowego zapachu — ale zapach z rąk po wcześniejszych liściach potrafi zmylić" },
      { feature: "Spód liścia", safe: "matowy", dangerous: "konwalia: błyszczący" },
    ],
    rule: "Sprawdzaj każdy liść osobno, a najlepiej kupuj czosnek niedźwiedzi z upraw — w naturze jest pod ochroną.",
    sources: [ISAP_PROTECTION, wiki("Konwalia_majowa"), wiki("Zimowit_jesienny")],
  },
  {
    slug: "baldaszkowate-i-szczwol",
    title: "Dzika marchew i trujące baldaszkowate",
    safe: { polish: "marchew zwyczajna (dzika)", latin: "Daucus carota" },
    dangerous: [
      { polish: "szczwół plamisty", latin: "Conium maculatum", toxin: "koniina" },
      { polish: "szalej jadowity", latin: "Cicuta virosa", toxin: "cykutoksyna" },
      { polish: "blekot pospolity", latin: "Aethusa cynapium", toxin: "alkaloidy podobne do koniiny" },
    ],
    season: "Cały sezon wegetacyjny; młode liście są szczególnie podobne.",
    differences: [
      { feature: "Łodyga", safe: "owłosiona, bez plam", dangerous: "szczwół: gładka, z czerwonofioletowymi plamami, często z sinym nalotem" },
      { feature: "Zapach", safe: "marchewkowy", dangerous: "szczwół: nieprzyjemny, „mysi”" },
      { feature: "Środek baldachu", safe: "często jeden ciemny, purpurowy kwiat", dangerous: "brak ciemnego kwiatu" },
    ],
    rule: "Nie zbieraj dziko rosnących roślin baldaszkowatych (selerowatych) bez nadzoru doświadczonego botanika. Różnice są subtelne, a pomyłka bywa śmiertelna.",
    sources: [wiki("Szczwół_plamisty"), wiki("Szalej_jadowity"), wiki("Blekot_pospolity")],
  },
  {
    slug: "bez-czarny-i-bez-hebd",
    title: "Bez czarny i bez hebd",
    safe: { polish: "bez czarny", latin: "Sambucus nigra", herbSlug: "bez-czarny" },
    dangerous: [{ polish: "bez hebd", latin: "Sambucus ebulus", toxin: "glikozydy i saponiny wywołujące silne zatrucia" }],
    season: "Maj–wrzesień: kwitnienie i owocowanie obu gatunków.",
    differences: [
      { feature: "Pokrój", safe: "zdrewniały krzew lub drzewko", dangerous: "bylina — co roku zasycha do ziemi" },
      { feature: "Owoce", safe: "zwisają w dół", dangerous: "baldachy owoców sterczą w górę" },
      { feature: "Pylniki i zapach", safe: "żółte pylniki, słodki zapach kwiatów", dangerous: "fioletowe pylniki, nieprzyjemny zapach" },
    ],
    rule: "Owoce bzu czarnego zbieraj tylko z krzewów, a i tak spożywaj je wyłącznie dojrzałe i po obróbce termicznej.",
    sources: [wiki("Bez_hebd"), wiki("Bez_czarny")],
  },
  {
    slug: "skrzyp-polny-i-skrzyp-blotny",
    title: "Skrzyp polny i skrzyp błotny",
    safe: { polish: "skrzyp polny", latin: "Equisetum arvense", herbSlug: "skrzyp-polny" },
    dangerous: [{ polish: "skrzyp błotny", latin: "Equisetum palustre", toxin: "alkaloid palustryna" }],
    season: "Maj–lipiec: zielone pędy letnie.",
    differences: [
      { feature: "Pierwszy odcinek gałązki", safe: "dłuższy niż pochwa liściowa na łodydze", dangerous: "krótszy niż pochwa liściowa na łodydze" },
      { feature: "Siedlisko", safe: "pola, przydroża, nasypy", dangerous: "podmokłe łąki, brzegi rowów i stawów" },
    ],
    rule: "Jeśli roślina rośnie w mokrym miejscu albo nie potrafisz sprawdzić długości odcinków gałązek — nie zbieraj jej.",
    sources: [wiki("Skrzyp_błotny"), wiki("Skrzyp_polny")],
  },
  {
    slug: "naparstnica-zywokost-dziewanna",
    title: "Naparstnica, żywokost i dziewanna",
    safe: { polish: "dziewanna drobnokwiatowa", latin: "Verbascum thapsus" },
    dangerous: [{ polish: "naparstnica purpurowa", latin: "Digitalis purpurea", toxin: "glikozydy nasercowe" }],
    season: "Wiosna: rozety liści przed kwitnieniem wyglądają bardzo podobnie.",
    differences: [
      { feature: "Powierzchnia liścia", safe: "dziewanna: gruby, wełnisty filc; żywokost: szorstki, kłujący", dangerous: "miękko omszona, z siateczką wyraźnych nerwów od spodu" },
      { feature: "Brzeg liścia", safe: "dziewanna: prawie gładki", dangerous: "drobno karbowany" },
    ],
    rule: "Nie zbieraj roślin z samej rozety liściowej. Żywokost i tak nie jest przeznaczony do stosowania wewnętrznego.",
    sources: [wiki("Naparstnica_purpurowa")],
  },
];

export const getLookalike = (slug: string) => lookalikes.find((l) => l.slug === slug);
