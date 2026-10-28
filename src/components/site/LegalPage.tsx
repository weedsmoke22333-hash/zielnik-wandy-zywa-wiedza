import type { ReactNode } from "react";
import { PageIntro } from "./Editorial";

/**
 * Legal page shell. Text in [NAWIASACH] must be completed by the owner; the banner stays until
 * a lawyer has reviewed the documents (set `reviewed` to true then).
 */
export function LegalPage({ title, latin, updated, reviewed = false, children }: { title: string; latin: string; updated: string; reviewed?: boolean; children: ReactNode }) {
  return (
    <>
      <PageIntro latin={latin} title={title}>
        <p className="mt-6 text-[0.9375rem] text-muted-foreground">Ostatnia aktualizacja: {updated}</p>
        {!reviewed && (
          <p className="measure mt-6 border-l-4 border-copper bg-paper px-5 py-4 text-[0.9375rem]">
            Szablon dokumentu. Przed uruchomieniem sprzedaży należy uzupełnić dane oznaczone [NAWIASAMI] i zlecić
            weryfikację prawnikowi.
          </p>
        )}
      </PageIntro>
      <div className="legal measure mx-auto max-w-[1400px] px-5 pb-32 pt-12 md:px-10 [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-[1.75rem] [&_li]:mt-2 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
        {children}
      </div>
    </>
  );
}
