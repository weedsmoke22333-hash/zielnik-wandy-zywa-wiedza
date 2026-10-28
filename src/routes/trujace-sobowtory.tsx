import { createFileRoute, Link } from "@tanstack/react-router";
import { lookalikes } from "@/data/lookalikes";
import { PageIntro, SourceList } from "@/components/site/Editorial";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/trujace-sobowtory")({
  head: () =>
    pageHead(
      "Trujące sobowtóry — rośliny, które łatwo pomylić",
      "Czosnek niedźwiedzi i konwalia, dzika marchew i szczwół, bez czarny i bez hebd: jak odróżnić rośliny jadalne od trujących.",
      "/trujace-sobowtory",
    ),
  component: LookalikesPage,
});

function LookalikesPage() {
  return (
    <>
      <PageIntro
        latin="Cave"
        title="Trujące sobowtóry"
        intro="Najgroźniejsze pomyłki zdarzają się przy roślinach, które znamy. Poniżej pary i trójki, które co roku trafiają do ośrodków toksykologicznych — i cechy, które pomagają je odróżnić."
      >
        <p className="measure mt-8 border-l-4 border-[#9b3b2a] bg-paper px-6 py-5 text-lg">
          <strong>Zasada nadrzędna:</strong> nie zbieraj rośliny, której nie jesteś w 100% pewna. Ta strona pomaga
          zrozumieć różnice, ale nie zastąpi nauki w terenie z doświadczoną osobą. W razie podejrzenia zatrucia
          dzwoń pod <strong>112</strong>.
        </p>
      </PageIntro>

      <div className="mx-auto max-w-[1400px] space-y-24 px-5 py-24 md:px-10">
        {lookalikes.map((l) => (
          <section key={l.slug} id={l.slug} aria-labelledby={`${l.slug}-h`} className="scroll-mt-28">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <h2 id={`${l.slug}-h`} className="text-h3 font-display">{l.title}</h2>
                <p className="mt-3 text-muted-foreground">{l.season}</p>
                <dl className="mt-6 space-y-4">
                  <div className="border-l-4 border-forest pl-4">
                    <dt className="text-[0.875rem] font-semibold text-forest">Jadalna / użytkowa</dt>
                    <dd>
                      {l.safe.herbSlug ? (
                        <Link to="/ziola-i-rosliny/$slug" params={{ slug: l.safe.herbSlug }} className="link-underline">
                          {l.safe.polish}
                        </Link>
                      ) : l.safe.polish}{" "}
                      <span className="latin">({l.safe.latin})</span>
                    </dd>
                  </div>
                  {l.dangerous.map((d) => (
                    <div key={d.latin} className="border-l-4 border-[#9b3b2a] pl-4">
                      <dt className="text-[0.875rem] font-semibold text-[#9b3b2a]">Trująca</dt>
                      <dd>
                        {d.polish} <span className="latin">({d.latin})</span>
                        <span className="block text-[0.9375rem] text-muted-foreground">zawiera: {d.toxin}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="lg:col-span-8">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-left">
                    <caption className="sr-only">Porównanie cech: {l.title}</caption>
                    <thead>
                      <tr className="border-b-2 border-deep/20">
                        <th scope="col" className="w-1/4 py-3 pr-4 font-display text-lg font-normal text-brown">Cecha</th>
                        <th scope="col" className="py-3 pr-4 font-display text-lg font-normal text-forest">{l.safe.polish}</th>
                        <th scope="col" className="py-3 font-display text-lg font-normal text-[#9b3b2a]">{l.dangerous.map((d) => d.polish).join(" / ")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {l.differences.map((d) => (
                        <tr key={d.feature} className="border-b border-border align-top">
                          <th scope="row" className="py-4 pr-4 font-semibold">{d.feature}</th>
                          <td className="py-4 pr-4">{d.safe}</td>
                          <td className="py-4">{d.dangerous}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-6 bg-paper px-5 py-4 font-semibold">{l.rule}</p>
                <SourceList sources={l.sources} className="mt-8" />
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
