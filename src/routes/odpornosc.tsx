import { createFileRoute, Link } from "@tanstack/react-router";
import { HealthDisclaimer, PageIntro, SourceList } from "@/components/site/Editorial";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/odpornosc")({
  head: () =>
    pageHead(
      "Odporność: fakty i mity",
      "Co naprawdę wspiera codzienne funkcjonowanie organizmu: sen, ruch, sposób odżywiania, szczepienia. I mity, które warto odłożyć na półkę.",
      "/odpornosc",
    ),
  component: ImmunityPage,
});

const facts = [
  { title: "Sen", text: "Dorosłym zaleca się co najmniej siedem godzin snu na dobę. Stałe niedosypianie odbija się na samopoczuciu i zdrowiu." },
  { title: "Ruch", text: "Światowa Organizacja Zdrowia zaleca dorosłym 150–300 minut umiarkowanej aktywności tygodniowo oraz ćwiczenia wzmacniające mięśnie co najmniej dwa razy w tygodniu — także po sześćdziesiątce, z ćwiczeniami równowagi." },
  { title: "Talerz", text: "Różnorodne posiłki z dużą ilością warzyw, owoców, roślin strączkowych i pełnego ziarna. Bez obsesji i bez diet cud." },
  { title: "Szczepienia", text: "Zapytaj lekarza, które szczepienia są zalecane w Twoim wieku i stanie zdrowia. To jedna z najlepiej udokumentowanych form profilaktyki." },
  { title: "Witamina D", text: "W Polsce zalecenia przewidują suplementację witaminy D jesienią i zimą. Dawkę dobierz z lekarzem — nadmiar też szkodzi." },
  { title: "Odpoczynek", text: "Przewlekły stres rozregulowuje sen i apetyt. Krótki spacer, rozmowa, chwila ciszy — to nie luksus, tylko higiena." },
];

const myths = [
  { myth: "Zioła „wzmacniają odporność”.", truth: "Unia Europejska nie zatwierdziła takich oświadczeń zdrowotnych dla roślin. Zioła bywają dopełnieniem codziennej troski o siebie, ale nie zastąpią snu, ruchu ani szczepień." },
  { myth: "Witamina C chroni przed przeziębieniem.", truth: "Przegląd badań Cochrane pokazał, że regularne przyjmowanie witaminy C nie zmniejsza liczby przeziębień w ogólnej populacji; może nieznacznie skracać ich czas." },
  { myth: "Im więcej suplementów, tym lepiej.", truth: "Nadmiar niektórych witamin, np. D czy A, może szkodzić. Suplementy diety nie przechodzą badań skuteczności przed wprowadzeniem do sprzedaży." },
];

function ImmunityPage() {
  return (
    <>
      <PageIntro
        latin="Fundamenta"
        title="Odporność: fakty i mity"
        intro="Nie ma jednego produktu, który „wzmocni odporność”. Są za to nawyki, które dobrze opisują zalecenia zdrowotne — i kilka popularnych mitów."
      />
      <section aria-labelledby="fakty" className="mx-auto max-w-[1400px] px-5 py-20 md:px-10">
        <h2 id="fakty" className="text-h2">Co ma znaczenie</h2>
        <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {facts.map((f) => (
            <div key={f.title} className="border-t border-deep/20 pt-5">
              <dt className="font-display text-2xl">{f.title}</dt>
              <dd className="mt-3 text-muted-foreground">{f.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="mity" className="bg-sage/50 py-24">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <h2 id="mity" className="text-h2">Mity do odłożenia na półkę</h2>
          <ul className="mt-12 space-y-10">
            {myths.map((m) => (
              <li key={m.myth} className="grid gap-4 border-b border-deep/15 pb-10 lg:grid-cols-12">
                <p className="font-display text-2xl text-brown line-through decoration-brown/40 lg:col-span-5">{m.myth}</p>
                <p className="measure text-lg lg:col-span-7">{m.truth}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-10">
        <div className="grid gap-10 md:grid-cols-2">
          <Link to="/zdrowe-nawyki" className="group block border-t border-border pt-6">
            <h2 className="text-h3 group-hover:text-forest">Zdrowe nawyki na co dzień</h2>
            <p className="mt-2 text-muted-foreground">Sen, ruch, talerz i odpoczynek w praktyce.</p>
          </Link>
          <Link to="/ebooki/$slug" params={{ slug: "codzienne-nawyki-wspierajace-odpornosc" }} className="group block border-t border-border pt-6">
            <h2 className="text-h3 group-hover:text-forest">E-book: Codzienne nawyki wspierające odporność</h2>
            <p className="mt-2 text-muted-foreground">Mały krok na każdy dzień — bez obietnic cudów.</p>
          </Link>
        </div>
        <SourceList
          className="mt-16"
          sources={[
            { label: "WHO — wytyczne dotyczące aktywności fizycznej (2020)", url: "https://www.who.int/publications/i/item/9789240015128" },
            { label: "AASM i SRS — zalecenia dotyczące długości snu u dorosłych (2015)", url: "https://jcsm.aasm.org/doi/10.5664/jcsm.4758" },
            { label: "Cochrane — witamina C a przeziębienie (2013)", url: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD000980.pub4/full" },
            { label: "Wytyczne suplementacji witaminy D w Polsce (Nutrients, 2023)", url: "https://www.mdpi.com/2072-6643/15/3/695" },
            { label: "Komisja Europejska — rejestr oświadczeń zdrowotnych", url: "https://ec.europa.eu/food/food-feed-portal/screen/health-claims/eu-register" },
          ]}
        />
        <HealthDisclaimer className="mt-8" />
      </section>
    </>
  );
}
