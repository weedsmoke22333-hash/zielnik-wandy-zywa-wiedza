import { Link } from "@tanstack/react-router";
import { legalNav, mainNav } from "./nav";

export function Footer() {
  return (
    <footer className="bg-deep text-ivory">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 pb-10 pt-24 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <p className="font-display text-4xl tracking-[-0.02em]">Wanda Machocka</p>
          <p className="mt-4 max-w-sm text-ivory/80">Blisko natury. Świadomie dla zdrowia.</p>
        </div>
        <nav aria-label="Stopka — strony" className="md:col-span-3">
          <p className="latin text-lg text-copper">Strony</p>
          <ul className="mt-4 space-y-2">
            {mainNav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="link-underline inline-flex min-h-10 items-center">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Stopka — informacje prawne" className="md:col-span-4">
          <p className="latin text-lg text-copper">Informacje</p>
          <ul className="mt-4 space-y-2">
            {legalNav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="link-underline inline-flex min-h-10 items-center">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="border-t border-ivory/15 pt-8 text-[15px] leading-relaxed text-ivory/75 md:col-span-12 measure">
          Treści na tej stronie mają charakter wyłącznie edukacyjny i nie zastępują porady lekarza ani farmaceuty.
          Przed zastosowaniem ziół, szczególnie przy przyjmowaniu leków, w ciąży lub w trakcie leczenia, skonsultuj
          się ze specjalistą.
        </p>
        <p className="text-sm text-ivory/60 md:col-span-12">© {new Date().getFullYear()} Wanda Machocka</p>
      </div>
    </footer>
  );
}
