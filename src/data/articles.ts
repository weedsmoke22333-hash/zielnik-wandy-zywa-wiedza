import nettle from "@/assets/nettle.webp";
import jars from "@/assets/jars.webp";
import linden from "@/assets/linden.webp";
import specimen from "@/assets/specimen-melissa.webp";
import finalCta from "@/assets/final-cta.webp";
import sage from "@/assets/leaf-sage.webp";

export type Article = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image: { src: string; alt: string; width: number; height: number };
};

export const articles: Article[] = [
  {
    slug: "pokrzywa-roslina-pod-plotem",
    category: "Wybrane zioła i rośliny",
    title: "Pokrzywa — roślina, którą mijamy codziennie",
    excerpt: "Co wiemy o pokrzywie zwyczajnej, jak ją rozpoznać i dlaczego warto zbierać ją z dala od dróg.",
    image: { src: nettle, alt: "Młode liście pokrzywy z kroplami rosy w porannym świetle", width: 912, height: 1200 },
  },
  {
    slug: "tradycyjne-zastosowania-rumianku",
    category: "Tradycyjne zastosowania",
    title: "Rumianek i nagietek w domowej tradycji",
    excerpt: "Jak dawniej korzystano z tych kwiatów i co z tej wiedzy przetrwało próbę czasu.",
    image: { src: jars, alt: "Słoje z bursztynowego szkła z suszonym rumiankiem i nagietkiem na lnianym obrusie", width: 1200, height: 912 },
  },
  {
    slug: "sen-i-wieczorne-rytualy",
    category: "Sen i aktywność fizyczna",
    title: "Wieczór, który sprzyja spokojnemu snu",
    excerpt: "Światło, pora kolacji, krótki spacer — małe zmiany, które łatwo wprowadzić.",
    image: { src: linden, alt: "Gałązka kwitnącej lipy w ciepłym, porannym słońcu", width: 1200, height: 912 },
  },
  {
    slug: "odpowiedzialne-stosowanie-ziol",
    category: "Odpowiedzialne stosowanie",
    title: "Naturalne nie znaczy obojętne",
    excerpt: "Dlaczego dawka, czas stosowania i źródło surowca mają znaczenie.",
    image: { src: specimen, alt: "Zasuszony okaz melisy lekarskiej na archiwalnym papierze zielnikowym", width: 800, height: 1040 },
  },
  {
    slug: "interakcje-ziol-z-lekami",
    category: "Interakcje i środki ostrożności",
    title: "Zioła a leki — o czym porozmawiać z farmaceutą",
    excerpt: "Kilka znanych przykładów interakcji i pytania, które warto zadać przed rozpoczęciem.",
    image: { src: finalCta, alt: "Pęki suszących się ziół nad drewnianym stołem z filiżanką naparu", width: 1600, height: 912 },
  },
  {
    slug: "zdrowe-nawyki-szalwia",
    category: "Zdrowy styl życia",
    title: "Szałwia na parapecie i inne małe nawyki",
    excerpt: "Uprawa kilku ziół w domu to dobry pretekst do codziennej uważności.",
    image: { src: sage, alt: "Gałązka świeżej szałwii lekarskiej", width: 1024, height: 1024 },
  },
];
