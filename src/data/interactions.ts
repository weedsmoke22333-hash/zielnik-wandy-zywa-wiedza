import type { Source } from "./herbs";

/**
 * "Zioła a leki — na co uważać". A lookup of well-documented warnings, NOT a safety checker:
 * a missing entry never means a combination is safe (the UI says so explicitly).
 */
export type DrugGroup =
  | "antykoncepcja"
  | "przeciwzakrzepowe"
  | "przeciwdepresyjne"
  | "nasercowe"
  | "nadcisnienie"
  | "sterydy"
  | "uspokajajace"
  | "immunosupresyjne"
  | "przeciwcukrzycowe"
  | "zgaga"
  | "doustne";

export const DRUG_GROUPS: Record<DrugGroup, { label: string; examples: string }> = {
  antykoncepcja: { label: "Antykoncepcja hormonalna", examples: "tabletki, plastry, krążki hormonalne" },
  przeciwzakrzepowe: { label: "Leki przeciwzakrzepowe i przeciwpłytkowe", examples: "np. acenokumarol, warfaryna, kwas acetylosalicylowy, klopidogrel" },
  przeciwdepresyjne: { label: "Leki przeciwdepresyjne", examples: "np. leki z grupy SSRI" },
  nasercowe: { label: "Leki nasercowe", examples: "np. digoksyna, leki przeciwarytmiczne" },
  nadcisnienie: { label: "Leki na nadciśnienie i moczopędne", examples: "np. leki moczopędne (diuretyki)" },
  sterydy: { label: "Kortykosteroidy (sterydy)", examples: "np. prednizon w tabletkach" },
  uspokajajace: { label: "Leki uspokajające i nasenne", examples: "np. benzodiazepiny; także alkohol" },
  immunosupresyjne: { label: "Leki immunosupresyjne", examples: "np. po przeszczepach: cyklosporyna, takrolimus" },
  przeciwcukrzycowe: { label: "Leki przeciwcukrzycowe", examples: "tabletki i insulina" },
  zgaga: { label: "Leki na zgagę", examples: "leki zobojętniające, inhibitory pompy protonowej (np. omeprazol)" },
  doustne: { label: "Wszystkie leki doustne", examples: "dotyczy przyjmowania w tym samym czasie" },
};

export type Severity = "istotna" | "ostroznosc";

export type Interaction = {
  herb: string; // display name
  herbLatin: string;
  herbSlug?: string; // atlas page, when it exists
  group: DrugGroup;
  severity: Severity;
  effect: string;
  advice: string;
  sources: Source[];
};

const NCCIH: Source = { label: "NCCIH — interakcje ziół z lekami", url: "https://www.nccih.nih.gov/health/providers/digest/herb-drug-interactions" };
const EMA_HYPERICUM: Source = { label: "EMA/HMPC — Hyperici herba", url: "https://www.ema.europa.eu/en/medicines/herbal/hyperici-herba" };
const EMA_VALERIAN: Source = { label: "EMA/HMPC — Valerianae radix", url: "https://www.ema.europa.eu/en/medicines/herbal/valerianae-radix" };
const EMA_MINT: Source = { label: "EMA/HMPC — Menthae piperitae folium", url: "https://www.ema.europa.eu/en/medicines/herbal/menthae-piperitae-folium" };

const ASK = "Porozmawiaj z lekarzem lub farmaceutą, zanim zaczniesz lub przestaniesz stosować to zioło.";

export const interactions: Interaction[] = [
  { herb: "Dziurawiec", herbLatin: "Hypericum perforatum", herbSlug: "dziurawiec-zwyczajny", group: "antykoncepcja", severity: "istotna",
    effect: "Może osłabiać skuteczność antykoncepcji hormonalnej (krwawienia międzymiesiączkowe, ryzyko nieplanowanej ciąży).", advice: ASK, sources: [EMA_HYPERICUM, NCCIH] },
  { herb: "Dziurawiec", herbLatin: "Hypericum perforatum", herbSlug: "dziurawiec-zwyczajny", group: "przeciwzakrzepowe", severity: "istotna",
    effect: "Może osłabiać działanie leków przeciwzakrzepowych takich jak acenokumarol czy warfaryna.", advice: ASK, sources: [EMA_HYPERICUM, NCCIH] },
  { herb: "Dziurawiec", herbLatin: "Hypericum perforatum", herbSlug: "dziurawiec-zwyczajny", group: "przeciwdepresyjne", severity: "istotna",
    effect: "Łączenie z lekami przeciwdepresyjnymi grozi zespołem serotoninowym.", advice: ASK, sources: [EMA_HYPERICUM, NCCIH] },
  { herb: "Dziurawiec", herbLatin: "Hypericum perforatum", herbSlug: "dziurawiec-zwyczajny", group: "nasercowe", severity: "istotna",
    effect: "Może obniżać stężenie digoksyny we krwi i osłabiać jej działanie.", advice: ASK, sources: [EMA_HYPERICUM, NCCIH] },
  { herb: "Dziurawiec", herbLatin: "Hypericum perforatum", herbSlug: "dziurawiec-zwyczajny", group: "immunosupresyjne", severity: "istotna",
    effect: "Może obniżać stężenie leków stosowanych po przeszczepach (np. cyklosporyny), co grozi odrzuceniem narządu.", advice: ASK, sources: [EMA_HYPERICUM, NCCIH] },
  { herb: "Miłorząb japoński", herbLatin: "Ginkgo biloba", group: "przeciwzakrzepowe", severity: "ostroznosc",
    effect: "Może zwiększać ryzyko krwawień przy jednoczesnym stosowaniu leków przeciwzakrzepowych lub przeciwpłytkowych.", advice: "Poinformuj lekarza, zwłaszcza przed zabiegiem lub operacją.", sources: [NCCIH] },
  { herb: "Lukrecja", herbLatin: "Glycyrrhiza glabra", group: "nadcisnienie", severity: "istotna",
    effect: "Przy dłuższym stosowaniu podnosi ciśnienie i obniża poziom potasu — przeciwdziała lekom na nadciśnienie, a z lekami moczopędnymi nasila utratę potasu.", advice: ASK, sources: [NCCIH] },
  { herb: "Lukrecja", herbLatin: "Glycyrrhiza glabra", group: "nasercowe", severity: "istotna",
    effect: "Niedobór potasu wywołany lukrecją zwiększa ryzyko działań niepożądanych digoksyny i leków przeciwarytmicznych.", advice: ASK, sources: [NCCIH] },
  { herb: "Lukrecja", herbLatin: "Glycyrrhiza glabra", group: "sterydy", severity: "ostroznosc",
    effect: "Może nasilać utratę potasu przy stosowaniu kortykosteroidów.", advice: ASK, sources: [NCCIH] },
  { herb: "Senes, kruszyna (zioła przeczyszczające)", herbLatin: "Senna, Frangula", group: "nasercowe", severity: "istotna",
    effect: "Długotrwałe stosowanie powoduje utratę potasu, co nasila działanie digoksyny i leków przeciwarytmicznych.", advice: "Zioła przeczyszczające stosuj krótko, a przy lekach nasercowych tylko po konsultacji.", sources: [NCCIH] },
  { herb: "Senes, kruszyna (zioła przeczyszczające)", herbLatin: "Senna, Frangula", group: "nadcisnienie", severity: "ostroznosc",
    effect: "Razem z lekami moczopędnymi zwiększa ryzyko niedoboru potasu.", advice: ASK, sources: [NCCIH] },
  { herb: "Senes, kruszyna (zioła przeczyszczające)", herbLatin: "Senna, Frangula", group: "sterydy", severity: "ostroznosc",
    effect: "Razem z kortykosteroidami zwiększa ryzyko niedoboru potasu.", advice: ASK, sources: [NCCIH] },
  { herb: "Babka jajowata, siemię lniane (śluz i błonnik)", herbLatin: "Plantago ovata, Linum usitatissimum", group: "doustne", severity: "ostroznosc",
    effect: "Może opóźniać lub zmniejszać wchłanianie innych leków przyjętych w tym samym czasie.", advice: "Zachowaj odstęp co najmniej 30–60 minut od innych leków.", sources: [NCCIH] },
  { herb: "Babka jajowata, siemię lniane (śluz i błonnik)", herbLatin: "Plantago ovata, Linum usitatissimum", group: "przeciwcukrzycowe", severity: "ostroznosc",
    effect: "Może wpływać na poziom cukru po posiłku — czasem trzeba skorygować dawkę leków.", advice: ASK, sources: [NCCIH] },
  { herb: "Kozłek lekarski (waleriana)", herbLatin: "Valeriana officinalis", group: "uspokajajace", severity: "ostroznosc",
    effect: "Może nasilać senność przy łączeniu z lekami uspokajającymi, nasennymi lub alkoholem.", advice: "Nie prowadź pojazdów, jeśli czujesz senność, i zapytaj farmaceutę o łączenie.", sources: [EMA_VALERIAN, NCCIH] },
  { herb: "Olejek miętowy w kapsułkach", herbLatin: "Mentha × piperita, aetheroleum", herbSlug: "mieta-pieprzowa", group: "zgaga", severity: "ostroznosc",
    effect: "Leki na zgagę mogą powodować zbyt wczesne uwalnianie olejku z kapsułek, co nasila zgagę.", advice: "Zachowaj odstęp czasowy i zapytaj farmaceutę.", sources: [EMA_MINT] },
  { herb: "Żeń-szeń", herbLatin: "Panax ginseng", group: "przeciwcukrzycowe", severity: "ostroznosc",
    effect: "Może obniżać poziom cukru i nasilać działanie leków przeciwcukrzycowych.", advice: ASK, sources: [NCCIH] },
  { herb: "Żeń-szeń", herbLatin: "Panax ginseng", group: "przeciwzakrzepowe", severity: "ostroznosc",
    effect: "Opisywano osłabienie działania warfaryny.", advice: ASK, sources: [NCCIH] },
  { herb: "Czosnek (suplementy)", herbLatin: "Allium sativum", group: "przeciwzakrzepowe", severity: "ostroznosc",
    effect: "Suplementy czosnku mogą zwiększać ryzyko krwawień przy lekach przeciwzakrzepowych.", advice: "Poinformuj lekarza, zwłaszcza przed zabiegiem.", sources: [NCCIH] },
  { herb: "Jeżówka purpurowa", herbLatin: "Echinacea purpurea", group: "immunosupresyjne", severity: "ostroznosc",
    effect: "Może teoretycznie przeciwdziałać lekom osłabiającym układ odpornościowy.", advice: ASK, sources: [NCCIH] },
];

export const interactionHerbs = Array.from(new Map(interactions.map((i) => [i.herb, i.herbLatin])).entries())
  .map(([name, latin]) => ({ name, latin }))
  .sort((a, b) => a.name.localeCompare(b.name, "pl"));
