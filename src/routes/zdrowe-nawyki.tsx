import { createFileRoute, Link } from "@tanstack/react-router";
import { articles } from "@/data/articles";
import { HealthDisclaimer, PageIntro } from "@/components/site/Editorial";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/zdrowe-nawyki")({
  head: () => pageHead("Zdrowe nawyki", "Sen, ruch, talerz, odpoczynek i domowy zielnik — małe kroki, które łatwo wprowadzić i utrzymać.", "/zdrowe-nawyki"),
  component: HabitsPage,
});

const habits = [
  { title: "Stała pora wstawania", text: "Najmocniej porządkuje sen. Także w weekend.", step: "Przez tydzień wstawaj o tej samej godzinie." },
  { title: "Dzienne światło", text: "Kwadrans na dworze rano pomaga ustawić rytm dnia.", step: "Wypij poranną herbatę przy otwartym oknie albo na balkonie." },
  { title: "Ruch, który lubisz", text: "Spacer, ogród, taniec, rower — liczy się regularność.", step: "Dodaj 10 minut spaceru po obiedzie." },
  { title: "Równowaga i siła", text: "Po sześćdziesiątce ćwiczenia równowagi chronią przed upadkami.", step: "Myjąc zęby, stań na jednej nodze — po minucie zmień nogę." },
  { title: "Warzywa na talerzu", text: "Połowa talerza warzyw to prosta zasada bez liczenia kalorii.", step: "Do każdego obiadu dołóż jedną porcję warzyw." },
  { title: "Chwila uważności", text: "Kilka minut przy roślinach na parapecie to zwykła, dobra przerwa.", step: "Posadź jedno zioło w doniczce i zaglądaj do niego codziennie." },
];

function HabitsPage() {
  const reads = articles.filter((a) => ["sen-i-wieczorne-rytualy", "zdrowe-nawyki-szalwia", "odpowiedzialne-stosowanie-ziol"].includes(a.slug));
  return (
    <>
      <PageIntro latin="Consuetudines" title="Zdrowe nawyki" intro="Nie potrzebujesz rewolucji. Wybierz jeden nawyk, wprowadź go na tydzień, potem dodaj następny." />
      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-10">
        <ul className="grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {habits.map((h) => (
            <li key={h.title} className="border-t border-deep/20 pt-5">
              <h2 className="font-display text-2xl">{h.title}</h2>
              <p className="mt-3 text-muted-foreground">{h.text}</p>
              <p className="mt-4 border-l-2 border-copper pl-4"><span className="font-semibold">Mały krok:</span> {h.step}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="bg-sage/50 py-20">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <h2 className="text-h2">Czytaj dalej</h2>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {reads.map((a) => (
              <li key={a.slug}>
                <Link to="/blog/$slug" params={{ slug: a.slug }} className="group block">
                  <p className="latin text-brown">{a.category}</p>
                  <h3 className="mt-1 font-display text-2xl leading-tight group-hover:text-forest">{a.title}</h3>
                  <p className="mt-2 text-muted-foreground">{a.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-12">
            <Link to="/odpornosc" className="link-underline font-semibold text-forest">Odporność: fakty i mity</Link>
          </p>
          <HealthDisclaimer className="mt-8" />
        </div>
      </section>
    </>
  );
}
