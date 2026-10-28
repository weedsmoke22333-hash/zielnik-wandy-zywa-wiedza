import { createFileRoute, Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { herbs, MONTHS_PL, type PlantPart } from "@/data/herbs";
import { CalendarWheel } from "@/components/calendar/CalendarWheel";
import { HealthDisclaimer, PageIntro } from "@/components/site/Editorial";
import { Newsletter } from "@/components/home/Newsletter";
import { pageHead } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/kalendarz-zielarski")({
  head: () =>
    pageHead(
      "Kalendarz zielarski — co i kiedy zbierać",
      "Interaktywny kalendarz zbioru ziół dla Polski: które rośliny i którą ich część zbierać w każdym miesiącu. Z tabelą do druku.",
      "/kalendarz-zielarski",
    ),
  component: CalendarPage,
});

const PART_STYLE: Record<PlantPart, string> = {
  liść: "bg-forest text-ivory",
  kwiat: "bg-copper text-deep",
  ziele: "bg-olive text-deep",
  korzeń: "bg-brown text-ivory",
  owoc: "bg-[#9b3b2a] text-ivory",
  pęd: "bg-sage text-deep ring-1 ring-olive",
};
const PART_SHORT: Record<PlantPart, string> = { liść: "L", kwiat: "K", ziele: "Z", korzeń: "Kr", owoc: "O", pęd: "P" };

function CalendarPage() {
  return (
    <>
      <PageIntro
        latin="Annus herbarum"
        title="Kalendarz zielarski"
        intro="Obróć koło na dowolny miesiąc i sprawdź, co można zebrać. Terminy są orientacyjne dla Polski — pogoda i region potrafią przesunąć zbiór o kilka tygodni."
      />
      <section aria-label="Koło roku" className="mx-auto max-w-[1400px] px-5 py-16 md:px-10">
        <CalendarWheel />
      </section>

      <section aria-labelledby="tabela" className="bg-sage/50 py-24 print:bg-transparent print:py-4">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 id="tabela" className="text-h2">Cały rok na jednej kartce</h2>
              <p className="measure mt-4 text-muted-foreground">Ta sama tabela jest w darmowym kalendarzu PDF do wydrukowania.</p>
            </div>
            <a
              href="/materialy/kalendarz-zbioru-ziol.pdf"
              download
              className="inline-flex min-h-14 items-center gap-3 rounded-sm bg-forest px-7 font-semibold text-ivory transition-colors hover:bg-deep print:hidden"
            >
              <Download className="h-5 w-5" aria-hidden /> Pobierz PDF (A4)
            </a>
          </div>

          <div className="mt-12 overflow-x-auto rounded-sm border border-border bg-ivory">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <caption className="sr-only">Terminy zbioru: rośliny w wierszach, miesiące w kolumnach</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="w-[26%] px-4 py-3 font-display text-lg font-normal text-brown">Roślina</th>
                  {MONTHS_PL.map((m) => (
                    <th key={m} scope="col" className="px-1 py-3 text-center font-display text-base font-normal text-brown" title={m}>{m.slice(0, 3)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {herbs.map((h, r) => (
                  <tr key={h.slug} className={cn("border-b border-border/60", r % 2 === 0 && "bg-sage/25")}>
                    <th scope="row" className="px-4 py-2 font-normal">
                      <Link to="/ziola-i-rosliny/$slug" params={{ slug: h.slug }} className="group block">
                        <span className="latin block text-lg leading-tight group-hover:text-forest">{h.latin}</span>
                        <span className="text-[0.875rem] text-muted-foreground">{h.polish}</span>
                      </Link>
                    </th>
                    {MONTHS_PL.map((m, i) => {
                      const parts = h.harvest.filter((x) => x.months.includes((i + 1) as never));
                      return (
                        <td key={m} className="border-l border-border/50 px-1 py-2 text-center">
                          {parts.map((p) => (
                            <span key={p.part} title={`${h.polish}: ${p.part}`} className={cn("m-0.5 inline-block min-w-7 rounded-sm px-1 text-[0.75rem] font-semibold leading-6", PART_STYLE[p.part])}>
                              {PART_SHORT[p.part]}
                            </span>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem]">
            {(Object.keys(PART_SHORT) as PlantPart[]).map((p) => (
              <span key={p} className="inline-flex items-center gap-2">
                <span className={cn("inline-block min-w-7 rounded-sm px-1 text-center text-[0.75rem] font-semibold leading-6", PART_STYLE[p])}>{PART_SHORT[p]}</span>
                {p}
              </span>
            ))}
          </p>
          <div className="measure mt-10 space-y-3 text-muted-foreground">
            <p>Zbieraj w suchy dzień, z dala od ruchliwych dróg i pól opryskiwanych. Susz w cieniu i przechowuj w opisanych słoikach do roku.</p>
            <p>
              <strong className="text-deep">Nie zbieraj rośliny, której nie jesteś w 100% pewna.</strong> Zobacz{" "}
              <Link to="/trujace-sobowtory" className="link-underline font-semibold text-forest">trujące sobowtóry</Link>.
            </p>
          </div>
          <HealthDisclaimer className="mt-6" />
        </div>
      </section>
      <div className="print:hidden"><Newsletter source="kalendarz" /></div>
    </>
  );
}
