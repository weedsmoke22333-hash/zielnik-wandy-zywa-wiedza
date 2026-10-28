import nettle from "@/assets/nettle.webp";
import linden from "@/assets/linden.webp";
import specimenMelissa from "@/assets/specimen-melissa.webp";
import leafSage from "@/assets/leaf-sage.webp";
import jars from "@/assets/jars.webp";

/**
 * Herb atlas — the single source for the atlas, herb pages and the harvesting calendar.
 *
 * Compliance rules (enforced by src/test/content-rules.test.ts — the build of a herb page
 * is not allowed without them):
 *  - every herb names its evidence level, at least one contraindication, an interactions
 *    statement and at least one real, verifiable source;
 *  - wording describes traditional use ("tradycyjnie stosowany…"), never cure/treat/prevent claims.
 *
 * Evidence levels follow the EU herbal framework (Directive 2004/24/EC, EMA/HMPC monographs):
 *  - "tradycyjne": traditional use — based on long-standing use, not on clinical trials;
 *  - "dobrze-udokumentowane": well-established use — supported by scientific literature (applies to
 *    specific preparations sold as medicines);
 *  - "kulinarna": a food plant with no EMA monograph.
 */

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type PlantPart = "liść" | "kwiat" | "ziele" | "korzeń" | "owoc" | "pęd";
export type EvidenceLevel = "tradycyjne" | "dobrze-udokumentowane" | "kulinarna";
export type Source = { label: string; url: string };

export type Herb = {
  slug: string;
  latin: string;
  polish: string;
  family: string;
  /** What to collect and when (Polish climate, typical years). */
  harvest: { part: PlantPart; months: Month[]; note?: string }[];
  habitat: string;
  recognize: string;
  evidence: EvidenceLevel;
  evidenceNote?: string;
  traditionalUse: string;
  contraindications: string[];
  interactions: string;
  /** Slug in src/data/lookalikes.ts when a dangerous look-alike exists. */
  lookalike?: string;
  /** Legal or ecological note, e.g. species protection. */
  legalNote?: string;
  image?: { src: string; alt: string; width: number; height: number };
  sources: Source[];
};

export const EMA_HERBAL_URL = "https://www.ema.europa.eu/en/human-regulatory-overview/herbal-medicinal-products";
const ema = (slug: string, latinLabel: string): Source => ({
  label: `EMA/HMPC — ${latinLabel}`,
  url: `https://www.ema.europa.eu/en/medicines/herbal/${slug}`,
});
const EMA_GENERAL: Source = { label: "EMA — ziołowe produkty lecznicze (przegląd monografii)", url: EMA_HERBAL_URL };
const NO_INTERACTIONS =
  "W monografii nie opisano interakcji z lekami. Nie oznacza to, że ich nie ma — jeśli stale przyjmujesz leki, zapytaj farmaceutę.";

export const MONTHS_PL = [
  "styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec",
  "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień",
] as const;
export const MONTHS_PL_LOC = [
  "styczniu", "lutym", "marcu", "kwietniu", "maju", "czerwcu",
  "lipcu", "sierpniu", "wrześniu", "październiku", "listopadzie", "grudniu",
] as const;
export const MONTHS_PL_GEN = [
  "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
  "lipca", "sierpnia", "września", "października", "listopada", "grudnia",
] as const;

export const herbs: Herb[] = [
  {
    slug: "melisa-lekarska",
    latin: "Melissa officinalis",
    polish: "melisa lekarska",
    family: "jasnotowate (Lamiaceae)",
    harvest: [{ part: "liść", months: [6, 7, 8], note: "przed kwitnieniem, w suchy dzień" }],
    habitat: "W Polsce głównie z uprawy — w ogrodzie, w donicy na słonecznym parapecie.",
    recognize: "Jajowate, karbowane na brzegu liście o wyraźnym cytrynowym zapachu po roztarciu. Łodyga czterokanciasta.",
    evidence: "tradycyjne",
    traditionalUse:
      "Tradycyjnie stosowana przy łagodnych objawach stresu psychicznego, jako wsparcie zasypiania oraz przy łagodnych dolegliwościach trawiennych, takich jak wzdęcia.",
    contraindications: [
      "Nadwrażliwość na roślinę.",
      "Według EMA nie zaleca się stosowania u dzieci poniżej 12 lat.",
      "W ciąży i podczas karmienia piersią — brak wystarczających danych, skonsultuj się z lekarzem.",
    ],
    interactions: NO_INTERACTIONS,
    image: { src: specimenMelissa, alt: "Zasuszony okaz melisy lekarskiej na archiwalnym papierze", width: 800, height: 1040 },
    sources: [ema("melissae-folium", "Melissae folium")],
  },
  {
    slug: "szalwia-lekarska",
    latin: "Salvia officinalis",
    polish: "szałwia lekarska",
    family: "jasnotowate (Lamiaceae)",
    harvest: [{ part: "liść", months: [5, 6, 7, 8, 9], note: "z roślin uprawnych, najlepiej przed kwitnieniem" }],
    habitat: "Krzewinka z rejonu Morza Śródziemnego; w Polsce uprawiana w ogrodach.",
    recognize: "Podłużne, szarozielone, aksamitne w dotyku liście o pomarszczonej powierzchni i mocnym, korzennym zapachu.",
    evidence: "tradycyjne",
    traditionalUse:
      "Tradycyjnie stosowana do płukania przy podrażnieniach jamy ustnej i gardła, przy łagodnych dolegliwościach trawiennych oraz przy nadmiernym poceniu się.",
    contraindications: [
      "Ciąża i karmienie piersią — zawiera tujon.",
      "Nie stosuj doustnie długotrwale ani w dużych ilościach.",
      "Nie podawaj doustnie dzieciom bez konsultacji z lekarzem.",
    ],
    interactions: NO_INTERACTIONS,
    image: { src: leafSage, alt: "Gałązka świeżej szałwii lekarskiej", width: 1024, height: 1024 },
    sources: [ema("salviae-officinalis-folium", "Salviae officinalis folium")],
  },
  {
    slug: "mieta-pieprzowa",
    latin: "Mentha × piperita",
    polish: "mięta pieprzowa",
    family: "jasnotowate (Lamiaceae)",
    harvest: [{ part: "liść", months: [6, 7, 8], note: "tuż przed kwitnieniem" }],
    habitat: "Mieszaniec uprawny; łatwo rośnie w ogrodzie i rozrasta się rozłogami.",
    recognize: "Lancetowate, piłkowane liście, często z fioletowym nalotem na łodydze; intensywny, chłodzący zapach mentolu.",
    evidence: "tradycyjne",
    evidenceNote: "Olejek miętowy w kapsułkach ma status dobrze udokumentowanego stosowania — to inny preparat niż napar z liści.",
    traditionalUse: "Tradycyjnie stosowana przy łagodnych dolegliwościach trawiennych, takich jak niestrawność i wzdęcia.",
    contraindications: [
      "Może nasilać zgagę i objawy refluksu.",
      "Przy kamicy żółciowej i chorobach dróg żółciowych — tylko po konsultacji z lekarzem.",
      "Według EMA nie zaleca się naparu u dzieci poniżej 4 lat.",
    ],
    interactions: NO_INTERACTIONS,
    sources: [ema("menthae-piperitae-folium", "Menthae piperitae folium")],
  },
  {
    slug: "rumianek-pospolity",
    latin: "Matricaria chamomilla",
    polish: "rumianek pospolity",
    family: "astrowate (Asteraceae)",
    harvest: [{ part: "kwiat", months: [5, 6, 7, 8], note: "całe koszyczki, gdy płatki są rozłożone poziomo" }],
    habitat: "Pola, przydroża, ugory; także w uprawie.",
    recognize: "Białe płatki wokół żółtego, stożkowatego dna koszyczka, które w środku jest puste (to odróżnia go od podobnych rumianów).",
    evidence: "tradycyjne",
    traditionalUse:
      "Tradycyjnie stosowany przy łagodnych dolegliwościach żołądkowo-jelitowych, do płukania przy drobnych podrażnieniach jamy ustnej i gardła oraz zewnętrznie przy drobnych podrażnieniach skóry.",
    contraindications: [
      "Uczulenie na rośliny astrowate (np. bylicę, arnikę, nagietek).",
      "Nie stosuj okładów w okolicy oczu.",
    ],
    interactions: NO_INTERACTIONS,
    image: { src: jars, alt: "Słoje z suszonym rumiankiem i nagietkiem na lnianym obrusie", width: 1200, height: 912 },
    sources: [ema("matricariae-flos", "Matricariae flos")],
  },
  {
    slug: "pokrzywa-zwyczajna",
    latin: "Urtica dioica",
    polish: "pokrzywa zwyczajna",
    family: "pokrzywowate (Urticaceae)",
    harvest: [
      { part: "liść", months: [4, 5, 6], note: "młode wierzchołki przed kwitnieniem; z dala od dróg i pól opryskiwanych" },
      { part: "liść", months: [9], note: "drugi zbiór z odrostów po skoszeniu" },
    ],
    habitat: "Wilgotne, żyzne miejsca: brzegi lasów, zarośla, okolice zabudowań.",
    recognize: "Sercowate, grubo piłkowane liście pokryte włoskami parzącymi; kwiaty w zwisających, zielonkawych kłosach.",
    evidence: "tradycyjne",
    traditionalUse:
      "Tradycyjnie stosowana jako wsparcie przy łagodnych dolegliwościach stawów oraz w celu zwiększenia ilości oddawanego moczu przy drobnych dolegliwościach dróg moczowych.",
    contraindications: [
      "Stany, w których lekarz zalecił ograniczenie płynów (np. ciężka niewydolność serca lub nerek).",
      "Według EMA nie zaleca się stosowania u dzieci poniżej 12 lat.",
    ],
    interactions: NO_INTERACTIONS,
    image: { src: nettle, alt: "Młode liście pokrzywy z kroplami rosy", width: 912, height: 1200 },
    sources: [ema("urticae-folium", "Urticae folium")],
  },
  {
    slug: "lipa-drobnolistna",
    latin: "Tilia cordata",
    polish: "lipa drobnolistna",
    family: "ślazowate (Malvaceae)",
    harvest: [{ part: "kwiat", months: [6, 7], note: "kwiatostany z podsadką, na początku kwitnienia" }],
    habitat: "Lasy liściaste, parki, aleje. Lipa szerokolistna kwitnie około dwóch tygodni wcześniej.",
    recognize: "Sercowate liście z rudawymi kępkami włosków w kątach nerwów od spodu; pachnące kwiaty zwisają z jasnej, języczkowatej podsadki.",
    evidence: "tradycyjne",
    traditionalUse: "Tradycyjnie stosowana przy objawach przeziębienia oraz przy łagodnych objawach stresu psychicznego.",
    contraindications: [
      "Nadwrażliwość na roślinę.",
      "Nie zbieraj z drzew przy ruchliwych ulicach.",
    ],
    interactions: NO_INTERACTIONS,
    image: { src: linden, alt: "Gałązka kwitnącej lipy w porannym słońcu", width: 1200, height: 912 },
    sources: [ema("tiliae-flos", "Tiliae flos")],
  },
  {
    slug: "nagietek-lekarski",
    latin: "Calendula officinalis",
    polish: "nagietek lekarski",
    family: "astrowate (Asteraceae)",
    harvest: [{ part: "kwiat", months: [6, 7, 8, 9], note: "w pełni rozwinięte koszyczki, w słoneczne przedpołudnie" }],
    habitat: "Roślina ogrodowa; kwitnie od czerwca do przymrozków.",
    recognize: "Pomarańczowe lub żółte koszyczki, lepkie, aromatyczne liście; nasiona zakrzywione jak małe półksiężyce.",
    evidence: "tradycyjne",
    traditionalUse:
      "Tradycyjnie stosowany zewnętrznie przy drobnych stanach zapalnych skóry i jako wsparcie gojenia drobnych ran, a także do płukania jamy ustnej i gardła.",
    contraindications: ["Uczulenie na rośliny astrowate."],
    interactions: NO_INTERACTIONS,
    sources: [ema("calendulae-flos", "Calendulae flos")],
  },
  {
    slug: "dziurawiec-zwyczajny",
    latin: "Hypericum perforatum",
    polish: "dziurawiec zwyczajny",
    family: "dziurawcowate (Hypericaceae)",
    harvest: [{ part: "ziele", months: [6, 7, 8], note: "szczyty pędów w czasie kwitnienia" }],
    habitat: "Suche łąki, przydroża, skraje lasów.",
    recognize: "Liście pod światło wyglądają na „podziurawione” (przejrzyste gruczoły); żółte kwiaty po roztarciu barwią palce na czerwono.",
    evidence: "dobrze-udokumentowane",
    evidenceNote:
      "Status dobrze udokumentowanego stosowania dotyczy standaryzowanych wyciągów w lekach, stosowanych wyłącznie po decyzji lekarza. Napar z ziela to stosowanie tradycyjne.",
    traditionalUse:
      "Tradycyjnie stosowany przy przejściowym wyczerpaniu psychicznym, a zewnętrznie (olej) przy drobnych podrażnieniach skóry.",
    contraindications: [
      "Wchodzi w istotne interakcje z wieloma lekami — zobacz sekcję o interakcjach.",
      "Zwiększa wrażliwość skóry na słońce; unikaj opalania i solarium.",
      "Ciąża, karmienie piersią, dzieci i młodzież poniżej 18 lat.",
    ],
    interactions:
      "Dziurawiec przyspiesza rozkład wielu leków w wątrobie. Może osłabiać działanie m.in. antykoncepcji hormonalnej, leków przeciwzakrzepowych, digoksyny i leków po przeszczepach, a z lekami przeciwdepresyjnymi grozi zespołem serotoninowym. Jeśli przyjmujesz jakiekolwiek leki — nie stosuj go bez rozmowy z lekarzem.",
    sources: [
      ema("hyperici-herba", "Hyperici herba"),
      { label: "NCCIH — interakcje ziół z lekami", url: "https://www.nccih.nih.gov/health/providers/digest/herb-drug-interactions" },
    ],
  },
  {
    slug: "bez-czarny",
    latin: "Sambucus nigra",
    polish: "bez czarny",
    family: "piżmaczkowate (Adoxaceae)",
    harvest: [
      { part: "kwiat", months: [5, 6], note: "całe baldachy, gdy większość kwiatów jest rozwinięta" },
      { part: "owoc", months: [8, 9], note: "wyłącznie dojrzałe, czarne — i tylko po obróbce termicznej" },
    ],
    habitat: "Zarośla, skraje lasów, okolice domów. Krzew lub niewielkie drzewo.",
    recognize: "Krzew o pierzastych liściach; kremowe, płaskie baldachy kwiatów; czarne owoce zwisają w dół.",
    evidence: "tradycyjne",
    traditionalUse: "Kwiaty tradycyjnie stosowane przy pierwszych objawach przeziębienia.",
    contraindications: [
      "Surowe lub niedojrzałe owoce, liście i kora zawierają związki wywołujące nudności i wymioty.",
      "Według EMA nie zaleca się stosowania kwiatów u dzieci poniżej 12 lat.",
    ],
    interactions: NO_INTERACTIONS,
    lookalike: "bez-czarny-i-bez-hebd",
    sources: [ema("sambuci-flos", "Sambuci flos")],
  },
  {
    slug: "mniszek-lekarski",
    latin: "Taraxacum officinale",
    polish: "mniszek lekarski",
    family: "astrowate (Asteraceae)",
    harvest: [
      { part: "liść", months: [4, 5], note: "młode liście przed kwitnieniem" },
      { part: "korzeń", months: [9, 10], note: "jesienią, gdy roślina gromadzi zapasy" },
    ],
    habitat: "Łąki, trawniki, przydroża — niemal wszędzie.",
    recognize: "Różyczka głęboko wcinanych liści, puste łodygi z mlecznym sokiem, jeden żółty koszyczek na łodydze.",
    evidence: "tradycyjne",
    traditionalUse:
      "Liście tradycyjnie stosowane w celu zwiększenia ilości oddawanego moczu, a korzeń przy przejściowym braku apetytu i łagodnych dolegliwościach trawiennych.",
    contraindications: [
      "Uczulenie na rośliny astrowate.",
      "Choroby dróg żółciowych, kamica żółciowa, choroba wrzodowa — tylko po konsultacji z lekarzem.",
    ],
    interactions: NO_INTERACTIONS,
    sources: [ema("taraxaci-officinalis-radix", "Taraxaci officinalis radix"), EMA_GENERAL],
  },
  {
    slug: "krwawnik-pospolity",
    latin: "Achillea millefolium",
    polish: "krwawnik pospolity",
    family: "astrowate (Asteraceae)",
    harvest: [{ part: "ziele", months: [6, 7, 8, 9], note: "kwitnące szczyty pędów" }],
    habitat: "Łąki, miedze, przydroża.",
    recognize: "Drobno, wielokrotnie podzielone liście („tysiąc listków”); białe lub różowawe kwiaty w płaskich podbaldachach.",
    evidence: "tradycyjne",
    traditionalUse:
      "Tradycyjnie stosowany przy przejściowym braku apetytu oraz łagodnych, skurczowych dolegliwościach trawiennych.",
    contraindications: ["Uczulenie na rośliny astrowate.", "Ciąża i karmienie piersią — skonsultuj się z lekarzem."],
    interactions: NO_INTERACTIONS,
    lookalike: "baldaszkowate-i-szczwol",
    sources: [EMA_GENERAL],
  },
  {
    slug: "czosnek-niedzwiedzi",
    latin: "Allium ursinum",
    polish: "czosnek niedźwiedzi",
    family: "amarylkowate (Amaryllidaceae)",
    harvest: [{ part: "liść", months: [3, 4], note: "przed kwitnieniem — wyłącznie z upraw" }],
    habitat: "Wilgotne lasy liściaste. W ogrodzie rośnie w półcieniu.",
    recognize: "Każdy liść wyrasta osobno na własnym ogonku; po roztarciu wyraźny zapach czosnku. Kwiaty białe, w kulistych baldachach.",
    evidence: "kulinarna",
    traditionalUse: "Roślina jadalna, używana w kuchni jak szczypiorek czy czosnek. Nie ma monografii EMA.",
    contraindications: [
      "Łatwo pomylić go ze śmiertelnie trującą konwalią i zimowitem — zobacz porównanie.",
      "Osoby przyjmujące leki przeciwzakrzepowe — duże ilości tylko po rozmowie z lekarzem.",
    ],
    interactions: "Brak monografii EMA. W ilościach kulinarnych nie opisano istotnych interakcji.",
    lookalike: "czosnek-niedzwiedzi-konwalia-zimowit",
    legalNote:
      "W Polsce czosnek niedźwiedzi jest objęty częściową ochroną gatunkową — nie zbieraj go ze stanowisk naturalnych. Kupuj z upraw albo posadź go w ogrodzie.",
    sources: [
      { label: "Rozporządzenie Ministra Środowiska w sprawie ochrony gatunkowej roślin (Dz.U. 2014 poz. 1409)", url: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20140001409" },
    ],
  },
  {
    slug: "glog",
    latin: "Crataegus monogyna, C. laevigata",
    polish: "głóg",
    family: "różowate (Rosaceae)",
    harvest: [
      { part: "kwiat", months: [5], note: "kwiatostany z liśćmi, na początku kwitnienia" },
      { part: "owoc", months: [9, 10], note: "dojrzałe, czerwone owoce" },
    ],
    habitat: "Zarośla, miedze, skraje lasów, żywopłoty.",
    recognize: "Ciernisty krzew o klapowanych liściach, białych kwiatach w baldachogronach i czerwonych, mącznych owocach.",
    evidence: "tradycyjne",
    traditionalUse:
      "Tradycyjnie stosowany przy przejściowych, nerwowych dolegliwościach sercowych (np. uczuciu kołatania) — po wykluczeniu poważnych chorób przez lekarza — oraz przy łagodnych objawach stresu.",
    contraindications: [
      "Każda dolegliwość sercowa wymaga najpierw konsultacji lekarskiej.",
      "Według EMA nie zaleca się stosowania u dzieci poniżej 12 lat.",
    ],
    interactions: "Jeśli przyjmujesz leki nasercowe lub na nadciśnienie, stosuj głóg wyłącznie po rozmowie z lekarzem.",
    sources: [EMA_GENERAL],
  },
  {
    slug: "dzika-roza",
    latin: "Rosa canina",
    polish: "róża dzika (psia)",
    family: "różowate (Rosaceae)",
    harvest: [{ part: "owoc", months: [9, 10, 11], note: "dojrzałe, czerwone owoce; przed suszeniem usuń włoski i nasiona" }],
    habitat: "Zarośla, miedze, skraje lasów.",
    recognize: "Krzew o łukowatych pędach z hakowatymi kolcami, bladoróżowych kwiatach i czerwonych, owalnych owocach.",
    evidence: "kulinarna",
    traditionalUse: "Roślina jadalna: owoce na przetwory, herbaty owocowe i konfitury.",
    contraindications: ["Włoski z wnętrza owoców podrażniają przewód pokarmowy i skórę — usuń je przed użyciem."],
    interactions: "Brak monografii EMA. W ilościach kulinarnych nie opisano istotnych interakcji.",
    sources: [EMA_GENERAL],
  },
  {
    slug: "skrzyp-polny",
    latin: "Equisetum arvense",
    polish: "skrzyp polny",
    family: "skrzypowate (Equisetaceae)",
    harvest: [{ part: "pęd", months: [5, 6, 7], note: "zielone, płonne pędy letnie" }],
    habitat: "Pola, przydroża, nasypy, wilgotne łąki.",
    recognize: "Zielone pędy z okółkami cienkich gałązek; wiosną wcześniej pojawiają się brązowe pędy zarodnikowe.",
    evidence: "tradycyjne",
    traditionalUse: "Tradycyjnie stosowany w celu zwiększenia ilości oddawanego moczu przy drobnych dolegliwościach dróg moczowych.",
    contraindications: [
      "Obrzęki wynikające z niewydolności serca lub nerek.",
      "Według EMA nie zaleca się stosowania u dzieci poniżej 12 lat.",
      "Nie stosuj długotrwale.",
    ],
    interactions: NO_INTERACTIONS,
    lookalike: "skrzyp-polny-i-skrzyp-blotny",
    sources: [EMA_GENERAL],
  },
];

export const getHerb = (slug: string) => herbs.find((h) => h.slug === slug);

export const EVIDENCE_LABEL: Record<EvidenceLevel, { label: string; description: string }> = {
  tradycyjne: {
    label: "Tradycyjne stosowanie",
    description: "Oparte na długoletniej tradycji, a nie na badaniach klinicznych (kategoria EMA).",
  },
  "dobrze-udokumentowane": {
    label: "Dobrze udokumentowane stosowanie",
    description: "Potwierdzone literaturą naukową dla określonych preparatów leczniczych (kategoria EMA).",
  },
  kulinarna: {
    label: "Roślina jadalna",
    description: "Używana w kuchni. Nie ma monografii EMA, więc nie opisujemy działania leczniczego.",
  },
};

/** Calendar view: what can be collected in a given month. */
export function harvestFor(month: Month) {
  return herbs.flatMap((h) =>
    h.harvest
      .filter((x) => x.months.includes(month))
      .map((x) => ({ herb: h, part: x.part, note: x.note })),
  );
}
