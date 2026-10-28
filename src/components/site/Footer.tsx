import { Link } from "@tanstack/react-router";
import { legalNav, mainNav, safetyNav } from "./nav";

export function Footer() {
  return (
    <footer className="bg-deep text-ivory print:bg-transparent print:text-deep">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 pb-10 pt-24 md:grid-cols-12 md:px-10 print:hidden">
        <div className="md:col-span-4">
          <p className="font-display text-4xl tracking-[-0.02em]">Wanda Machocka</p>
          <p className="mt-4 max-w-sm text-ivory/80">Blisko natury. Świadomie dla zdrowia.</p>
        </div>
        <nav aria-label="Stopka — strony" className="md:col-span-3">
          <p className="latin text-lg text-copper">Strony</p>
          <ul className="mt-4 space-y-1">
            {mainNav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="link-underline inline-flex min-h-10 items-center">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Stopka — bezpieczeństwo" className="md:col-span-2">
          <p className="latin text-lg text-copper">Bezpieczeństwo</p>
          <ul className="mt-4 space-y-1">
            {safetyNav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="link-underline inline-flex min-h-10 items-center">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Stopka — informacje prawne" className="md:col-span-3">
          <p className="latin text-lg text-copper">Informacje</p>
          <ul className="mt-4 space-y-1">
            {legalNav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="link-underline inline-flex min-h-10 items-center">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-ivory/15 pt-8 md:col-span-12">
          <p className="measure text-[0.9375rem] leading-relaxed text-ivory/75">
            Treści na tej stronie mają charakter wyłącznie edukacyjny i nie zastępują porady lekarza ani farmaceuty.
            Przed zastosowaniem ziół, szczególnie przy przyjmowaniu leków, w ciąży lub w trakcie leczenia, skonsultuj
            się ze specjalistą.
          </p>
        </div>
        <p className="text-sm text-ivory/60 md:col-span-12">© {new Date().getFullYear()} Wanda Machocka</p>
      </div>
      <p className="hidden px-2 pt-6 text-xs print:block">
        Wydrukowano ze strony Wandy Machockiej. Treści mają charakter edukacyjny i nie zastępują porady lekarza ani farmaceuty.
      </p>
    </footer>
  );
}
