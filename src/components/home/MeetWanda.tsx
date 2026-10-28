import { Link } from "@tanstack/react-router";
import { WandaPortrait } from "@/components/site/WandaPortrait";
import { RevealHeading } from "@/components/site/RevealHeading";

const principles = [
  {
    title: "Poznaj świat roślin.",
    text: "Zaczynam od rzetelnego opisu: jak roślinę rozpoznać, którą jej część się wykorzystuje i co mówią na jej temat źródła.",
  },
  {
    title: "Dbaj o codzienne nawyki.",
    text: "Sen, ruch, posiłki i odpoczynek robią dla nas więcej niż jakikolwiek pojedynczy napar. Zioła mogą być dopełnieniem, nie zastępstwem.",
  },
  {
    title: "Korzystaj z wiedzy odpowiedzialnie.",
    text: "Oddzielam tradycję od tego, co zostało zbadane, i zawsze piszę o przeciwwskazaniach.",
  },
];

export function MeetWanda() {
  return (
    <section data-tone="ivory" aria-labelledby="poznajmy" className="py-28 md:py-40">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 md:px-10 lg:grid-cols-12">
        {/* hidden on phones: the hero directly above already shows the portrait */}
        <div className="hidden lg:col-span-5 lg:block">
          <div className="lg:sticky lg:top-28">
            <WandaPortrait position="57% 32%" zoom={1.28} sizes="400px" className="aspect-[4/5] w-full max-w-[400px]" />
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <RevealHeading id="poznajmy" className="text-h2">Poznajmy się bliżej.</RevealHeading>
          <div className="measure mt-8 space-y-5 text-lg">
            <p>
              Tworzę to miejsce, żeby dzielić się wiedzą o ziołach w sposób spokojny i uważny. Zależy mi na tym, by
              każda informacja była zrozumiała, a jednocześnie ostrożna.
            </p>
            <p className="text-muted-foreground">
              Piszę o praktycznych, codziennych nawykach — takich, które łatwo wprowadzić i które naprawdę mają sens.
            </p>
          </div>

          <dl className="mt-14 space-y-10 border-l border-brown/30 pl-8">
            {principles.map((p) => (
              <div key={p.title}>
                <dt className="text-h3 font-display">{p.title}</dt>
                <dd className="measure mt-2 text-muted-foreground">{p.text}</dd>
              </div>
            ))}
          </dl>

          <Link to="/o-mnie" className="mt-14 inline-flex min-h-14 items-center rounded-sm bg-forest px-7 font-semibold text-ivory transition-colors hover:bg-deep">
            Moja historia
          </Link>
        </div>
      </div>
    </section>
  );
}
