import { createFileRoute, Link } from "@tanstack/react-router";
import { WandaPortrait } from "@/components/site/WandaPortrait";
import { WandaVoice } from "@/components/site/WandaVoice";
import { PageIntro } from "@/components/site/Editorial";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/o-mnie")({
  head: () =>
    pageHead("O mnie", "Wanda Machocka — o tym, dlaczego dzielę się wiedzą o ziołach i jak podchodzę do tradycji, badań i bezpieczeństwa.", "/o-mnie", {
      jsonLd: { "@context": "https://schema.org", "@type": "AboutPage", about: { "@type": "Person", name: "Wanda Machocka" } },
    }),
  component: AboutPage,
});

const approach = [
  { title: "Tradycja i badania osobno", text: "Przy każdej roślinie zaznaczam, czy jej stosowanie opiera się na tradycji, czy na badaniach — tak, jak robi to Europejska Agencja Leków." },
  { title: "Bezpieczeństwo na pierwszym miejscu", text: "Przeciwwskazania, interakcje z lekami i trujące sobowtóry są przy każdym opisie, a nie w przypisie." },
  { title: "Źródła, które można sprawdzić", text: "Pod każdym tekstem znajdziesz źródła. Jeśli czegoś nie da się potwierdzić, nie piszę o tym jak o fakcie." },
];

function AboutPage() {
  return (
    <>
      <PageIntro latin="De me" title="Poznajmy się bliżej" />
      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 pb-28 pt-14 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <figure className="paper-grain relative -rotate-[1deg] bg-ivory p-4 pb-5 specimen-shadow">
              <span className="tape -left-4 -top-3 w-24 -rotate-[30deg] opacity-80" aria-hidden />
              <span className="tape -right-4 -top-3 w-24 rotate-[28deg] opacity-80" aria-hidden />
              <WandaPortrait eager className="aspect-[4/5] w-full" sizes="460px" />
              <figcaption className="mt-4">
                <span className="block font-display text-xl">Wanda Machocka</span>
                <span className="block text-sm text-muted-foreground">w swojej zielarni</span>
              </figcaption>
            </figure>
          </div>
        </div>
        <div className="measure space-y-14 text-lg lg:col-span-6 lg:col-start-7">
          <section className="space-y-5">
            <p>
              Tworzę to miejsce, żeby dzielić się wiedzą o ziołach w sposób spokojny i uważny. Zależy mi na tym, by
              każda informacja była zrozumiała, a jednocześnie ostrożna.
            </p>
            <p className="text-muted-foreground">
              Piszę o roślinach, które znamy z ogrodu, łąki i kuchennej półki, i o codziennych nawykach, które naprawdę
              mają sens. Bez obietnic cudów.
            </p>
          </section>

          <section aria-labelledby="historia" className="border-l-4 border-brown/40 bg-paper px-6 py-6">
            <h2 id="historia" className="font-display text-2xl">Moja historia</h2>
            <p className="mt-3 text-muted-foreground">
              Tę część napiszę sama, własnymi słowami — pojawi się tu wkrótce.
            </p>
          </section>

          <WandaVoice title="Posłuchaj, jak opowiadam o swoim zielniku" />

          <section aria-labelledby="podejscie">
            <h2 id="podejscie" className="text-h3">Jak pracuję</h2>
            <dl className="mt-6 space-y-8">
              {approach.map((a) => (
                <div key={a.title}>
                  <dt className="font-display text-2xl">{a.title}</dt>
                  <dd className="mt-2 text-muted-foreground">{a.text}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="flex flex-wrap gap-4">
            <Link to="/ziola-i-rosliny" className="inline-flex min-h-14 items-center rounded-sm bg-forest px-7 font-semibold text-ivory transition-colors hover:bg-deep">Otwórz atlas roślin</Link>
            <Link to="/kontakt" className="inline-flex min-h-14 items-center rounded-sm border border-forest px-7 font-semibold text-forest transition-colors hover:bg-forest hover:text-ivory">Napisz do mnie</Link>
          </div>
        </div>
      </div>
    </>
  );
}
