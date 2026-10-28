import nettle from "@/assets/nettle.webp";
import jars from "@/assets/jars.webp";
import linden from "@/assets/linden.webp";
import specimen from "@/assets/specimen-melissa.webp";
import finalCta from "@/assets/final-cta.webp";
import sage from "@/assets/leaf-sage.webp";
import type { Source } from "./herbs";

/**
 * Blog articles. Every article MUST have precautions and at least one source
 * (enforced by src/test/content-rules.test.ts).
 *
 * `reviewed: false` = draft written as a starting point; the page shows a small note until
 * the author has read and approved the text.
 */
export type Article = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: { src: string; alt: string; width: number; height: number };
  readingMinutes: number;
  sections: { heading: string; paragraphs: string[] }[];
  precautions: string[];
  sources: Source[];
  relatedHerbs: string[];
  relatedProduct?: string;
  reviewed: boolean;
};

const EMA = (slug: string, label: string): Source => ({ label: `EMA/HMPC — ${label}`, url: `https://www.ema.europa.eu/en/medicines/herbal/${slug}` });
const NCCIH: Source = { label: "NCCIH — interakcje ziół z lekami", url: "https://www.nccih.nih.gov/health/providers/digest/herb-drug-interactions" };

export const articles: Article[] = [
  {
    slug: "pokrzywa-roslina-pod-plotem",
    category: "Wybrane zioła i rośliny",
    title: "Pokrzywa — roślina, którą mijamy codziennie",
    excerpt: "Jak rozpoznać pokrzywę zwyczajną, kiedy ją zbierać i dlaczego warto robić to z dala od dróg.",
    image: { src: nettle, alt: "Młode liście pokrzywy z kroplami rosy w porannym świetle", width: 912, height: 1200 },
    readingMinutes: 4,
    sections: [
      { heading: "Jak ją rozpoznać", paragraphs: [
        "Pokrzywę zwyczajną zna każdy, kto choć raz dotknął jej gołą ręką. Ma sercowate, grubo piłkowane liście i łodygę pokrytą włoskami parzącymi. Kwiaty są niepozorne — zielonkawe, zebrane w zwisające kłosy.",
      ] },
      { heading: "Kiedy i gdzie zbierać", paragraphs: [
        "Najlepsze są młode wierzchołki zbierane od kwietnia do czerwca, zanim roślina zakwitnie. Jeśli pokrzywy zostaną skoszone, we wrześniu można zebrać liście z młodych odrostów.",
        "Zbieraj z dala od ruchliwych dróg, pól opryskiwanych środkami ochrony roślin i miejsc, gdzie wyprowadza się psy. Załóż rękawice — po wysuszeniu lub krótkim sparzeniu liście przestają parzyć.",
      ] },
      { heading: "Co mówi tradycja", paragraphs: [
        "Według monografii Europejskiej Agencji Leków liść pokrzywy jest tradycyjnie stosowany jako wsparcie przy łagodnych dolegliwościach stawów oraz w celu zwiększenia ilości oddawanego moczu przy drobnych dolegliwościach dróg moczowych.",
        "To kategoria „tradycyjnego stosowania” — opiera się na długoletnim doświadczeniu, a nie na badaniach klinicznych.",
      ] },
      { heading: "W kuchni", paragraphs: [
        "Młode liście po krótkim blanszowaniu nadają się do zupy, farszu czy omletu — jak szpinak.",
      ] },
    ],
    precautions: [
      "Nie stosuj pokrzywy, jeśli lekarz zalecił Ci ograniczenie płynów (np. przy ciężkiej niewydolności serca lub nerek).",
      "Według EMA nie zaleca się stosowania u dzieci poniżej 12 lat.",
      "Jeśli przyjmujesz leki moczopędne, zapytaj farmaceutę.",
    ],
    sources: [EMA("urticae-folium", "Urticae folium")],
    relatedHerbs: ["pokrzywa-zwyczajna"],
    relatedProduct: "ziola-w-codziennym-zyciu",
    reviewed: false,
  },
  {
    slug: "tradycyjne-zastosowania-rumianku",
    category: "Tradycyjne zastosowania",
    title: "Rumianek i nagietek w domowej tradycji",
    excerpt: "Jak dawniej korzystano z tych kwiatów i co z tej wiedzy potwierdzają dziś monografie.",
    image: { src: jars, alt: "Słoje z bursztynowego szkła z suszonym rumiankiem i nagietkiem na lnianym obrusie", width: 1200, height: 912 },
    readingMinutes: 4,
    sections: [
      { heading: "Prawdziwy rumianek", paragraphs: [
        "Rumianek pospolity łatwo pomylić z podobnymi rumianami. Najprostszy test: przetnij koszyczek wzdłuż. Rumianek pospolity ma w środku puste, stożkowate dno; rumiany — pełne.",
        "Koszyczki zbiera się od maja do sierpnia, gdy białe płatki są rozłożone poziomo.",
      ] },
      { heading: "Nagietek z ogrodu", paragraphs: [
        "Nagietek to jedna z najłatwiejszych roślin ogrodowych. Kwitnie od czerwca aż do przymrozków, a im częściej zrywamy kwiaty, tym chętniej wypuszcza nowe.",
      ] },
      { heading: "Co mówią monografie", paragraphs: [
        "Europejska Agencja Leków opisuje tradycyjne stosowanie rumianku przy łagodnych dolegliwościach żołądkowo-jelitowych, do płukania przy drobnych podrażnieniach jamy ustnej i gardła oraz zewnętrznie na drobne podrażnienia skóry.",
        "Nagietek jest tradycyjnie stosowany zewnętrznie przy drobnych stanach zapalnych skóry i jako wsparcie gojenia drobnych ran.",
      ] },
    ],
    precautions: [
      "Obie rośliny należą do rodziny astrowatych — przy uczuleniu na bylicę, arnikę czy stokrotkę zachowaj ostrożność.",
      "Nie stosuj okładów z rumianku w okolicy oczu.",
    ],
    sources: [EMA("matricariae-flos", "Matricariae flos"), EMA("calendulae-flos", "Calendulae flos")],
    relatedHerbs: ["rumianek-pospolity", "nagietek-lekarski"],
    relatedProduct: "domowy-zielnik-dla-poczatkujacych",
    reviewed: false,
  },
  {
    slug: "sen-i-wieczorne-rytualy",
    category: "Sen i aktywność fizyczna",
    title: "Wieczór, który sprzyja spokojnemu snu",
    excerpt: "Światło, pora kolacji, krótki spacer — małe zmiany, które łatwo wprowadzić.",
    image: { src: linden, alt: "Gałązka kwitnącej lipy w ciepłym, porannym słońcu", width: 1200, height: 912 },
    readingMinutes: 5,
    sections: [
      { heading: "Ile snu potrzebujemy", paragraphs: [
        "Amerykańska Akademia Medycyny Snu zaleca dorosłym co najmniej siedem godzin snu na dobę. Potrzeby są indywidualne, ale stałe niedosypianie odbija się na samopoczuciu, koncentracji i zdrowiu.",
      ] },
      { heading: "Stała pora i światło", paragraphs: [
        "Najmocniej porządkuje sen stała pora wstawania — także w weekend. Rano wyjdź na dzienne światło choćby na kwadrans. Wieczorem przygaś lampy i odłóż telefon na godzinę przed snem.",
      ] },
      { heading: "Kolacja i kawa", paragraphs: [
        "Ciężki posiłek tuż przed snem utrudnia zasypianie. Kofeina działa wiele godzin — jeśli źle śpisz, ogranicz kawę i mocną herbatę po południu.",
      ] },
      { heading: "Gdzie miejsce na zioła", paragraphs: [
        "Melisa i lipa są tradycyjnie stosowane przy łagodnych objawach stresu, a melisa także jako wsparcie zasypiania. Ciepły napar może być częścią wieczornego rytuału — ale nie zastąpi stałych nawyków ani leczenia bezsenności.",
      ] },
    ],
    precautions: [
      "Jeśli bezsenność trwa dłużej niż kilka tygodni, głośno chrapiesz lub ktoś zauważył u Ciebie przerwy w oddychaniu we śnie — porozmawiaj z lekarzem.",
      "Melisy nie zaleca się dzieciom poniżej 12 lat.",
    ],
    sources: [
      { label: "AASM i SRS — zalecenia dotyczące długości snu u dorosłych (2015)", url: "https://jcsm.aasm.org/doi/10.5664/jcsm.4758" },
      EMA("melissae-folium", "Melissae folium"),
      EMA("tiliae-flos", "Tiliae flos"),
    ],
    relatedHerbs: ["melisa-lekarska", "lipa-drobnolistna"],
    relatedProduct: "codzienne-nawyki-wspierajace-odpornosc",
    reviewed: false,
  },
  {
    slug: "odpowiedzialne-stosowanie-ziol",
    category: "Odpowiedzialne stosowanie",
    title: "Naturalne nie znaczy obojętne",
    excerpt: "Dlaczego dawka, czas stosowania i źródło surowca mają znaczenie.",
    image: { src: specimen, alt: "Zasuszony okaz melisy lekarskiej na archiwalnym papierze zielnikowym", width: 800, height: 1040 },
    readingMinutes: 5,
    sections: [
      { heading: "Rośliny działają — dlatego wymagają uwagi", paragraphs: [
        "Gdyby zioła nie zawierały substancji czynnych, nie warto byłoby o nich pisać. Te same substancje mogą jednak wywołać działania niepożądane, uczulenia albo zmienić działanie leków.",
      ] },
      { heading: "Lek roślinny a suplement", paragraphs: [
        "W aptece spotkasz dwa rodzaje produktów z ziołami. Produkt leczniczy roślinny przechodzi rejestrację, ma określony skład, dawkowanie i ulotkę. Suplement diety jest żywnością — zgłasza się go do Głównego Inspektoratu Sanitarnego, ale nikt nie potwierdza jego skuteczności przed wprowadzeniem do sprzedaży.",
      ] },
      { heading: "Źródło surowca", paragraphs: [
        "Zioła zbierane przy drodze czy przy opryskiwanym polu mogą zawierać zanieczyszczenia. Bezpieczniej kupować susz z pewnego źródła albo uprawiać rośliny samodzielnie.",
      ] },
      { heading: "Kto powinien szczególnie uważać", paragraphs: [
        "Kobiety w ciąży i karmiące piersią, dzieci, osoby przyjmujące kilka leków na stałe oraz osoby przed planowaną operacją. Powiedz lekarzowi o wszystkich ziołach i suplementach, które stosujesz — także o herbatkach.",
      ] },
    ],
    precautions: [
      "Nie przekraczaj dawek podanych na opakowaniu i nie stosuj ziół dłużej, niż zaleca producent.",
      "Przed zabiegiem chirurgicznym poinformuj lekarza o wszystkich stosowanych ziołach i suplementach.",
    ],
    sources: [
      { label: "EMA — ziołowe produkty lecznicze", url: "https://www.ema.europa.eu/en/human-regulatory-overview/herbal-medicinal-products" },
      NCCIH,
    ],
    relatedHerbs: ["dziurawiec-zwyczajny", "szalwia-lekarska"],
    relatedProduct: "ziola-w-codziennym-zyciu",
    reviewed: false,
  },
  {
    slug: "interakcje-ziol-z-lekami",
    category: "Interakcje i środki ostrożności",
    title: "Zioła a leki — o czym porozmawiać z farmaceutą",
    excerpt: "Kilka dobrze znanych przykładów interakcji i pytania, które warto zadać przed rozpoczęciem.",
    image: { src: finalCta, alt: "Pęki suszących się ziół nad drewnianym stołem", width: 1600, height: 912 },
    readingMinutes: 4,
    sections: [
      { heading: "Interakcje są realne", paragraphs: [
        "Najlepiej opisanym przykładem jest dziurawiec. Przyspiesza rozkład wielu leków w wątrobie i może osłabiać działanie m.in. antykoncepcji hormonalnej, leków przeciwzakrzepowych czy leków stosowanych po przeszczepach.",
      ] },
      { heading: "Grupy leków, przy których warto uważać", paragraphs: [
        "Leki przeciwzakrzepowe, nasercowe, przeciwdepresyjne, przeciwcukrzycowe, leki na nadciśnienie i leki immunosupresyjne. Przy nich nawet „zwykła herbatka” zasługuje na pytanie do farmaceuty.",
      ] },
      { heading: "Pytania, które warto zadać", paragraphs: [
        "Czy to zioło może zmienić działanie moich leków? Czy powinnam zachować odstęp czasowy? Na jakie objawy mam zwrócić uwagę? Jak długo mogę je stosować?",
        "Przygotowaliśmy też wyszukiwarkę „Zioła a leki”, która pokazuje dobrze udokumentowane ostrzeżenia. Pamiętaj, że brak wpisu nie oznacza, że połączenie jest bezpieczne.",
      ] },
    ],
    precautions: [
      "Nie odstawiaj ani nie zmieniaj dawek leków na własną rękę.",
      "Zabierz do lekarza lub apteki listę wszystkich stosowanych ziół i suplementów.",
    ],
    sources: [NCCIH, EMA("hyperici-herba", "Hyperici herba")],
    relatedHerbs: ["dziurawiec-zwyczajny"],
    reviewed: false,
  },
  {
    slug: "zdrowe-nawyki-szalwia",
    category: "Zdrowy styl życia",
    title: "Szałwia na parapecie i inne małe nawyki",
    excerpt: "Uprawa kilku ziół w domu to dobry pretekst do codziennej uważności.",
    image: { src: sage, alt: "Gałązka świeżej szałwii lekarskiej", width: 1024, height: 1024 },
    readingMinutes: 3,
    sections: [
      { heading: "Pięć roślin na początek", paragraphs: [
        "Szałwia, mięta, melisa, tymianek i szczypiorek dobrze czują się w doniczkach. Potrzebują słońca, przepuszczalnej ziemi i umiarkowanego podlewania — więcej roślin ginie od nadmiaru wody niż od jej braku.",
      ] },
      { heading: "Mięta osobno", paragraphs: [
        "Mięta rozrasta się rozłogami i potrafi zagłuszyć sąsiadów. Najlepiej posadzić ją w osobnej doniczce.",
      ] },
      { heading: "Nawyk, nie obowiązek", paragraphs: [
        "Codzienne zajrzenie do roślin, podlanie i zerwanie kilku listków do kuchni to kilka minut uważności — bez aplikacji i bez wysiłku.",
      ] },
    ],
    precautions: ["Szałwii nie stosuj doustnie w ciąży, podczas karmienia piersią ani długotrwale — zawiera tujon."],
    sources: [EMA("salviae-officinalis-folium", "Salviae officinalis folium"), EMA("menthae-piperitae-folium", "Menthae piperitae folium")],
    relatedHerbs: ["szalwia-lekarska", "mieta-pieprzowa"],
    relatedProduct: "domowy-zielnik-dla-poczatkujacych",
    reviewed: false,
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
