import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/polityka-cookies")({
  head: () => pageHead("Polityka cookies", "Strona nie używa cookies reklamowych ani analitycznych. Wyjaśniamy, co i dlaczego zapisujemy w przeglądarce.", "/polityka-cookies"),
  component: () => (
    <LegalPage title="Polityka cookies" latin="Crustula" updated="[DATA]">
      <h2>W skrócie</h2>
      <p>Nie używamy plików cookies reklamowych ani analitycznych i nie śledzimy Cię między stronami. Dlatego nie pokazujemy banera ze zgodami.</p>
      <h2>Co zapisujemy w przeglądarce</h2>
      <ul>
        <li><strong>Rozmiar tekstu</strong> — jeśli wybierzesz większy tekst (A+ lub A++), zapamiętamy to w pamięci przeglądarki (localStorage), żeby przy kolejnej wizycie strona wyglądała tak samo. To ustawienie, o które sama / sam prosisz; możesz je w każdej chwili zmienić lub usunąć dane strony w przeglądarce.</li>
        <li><strong>Panel administracyjny</strong> — po zalogowaniu przeglądarka przechowuje token sesji, niezbędny do działania panelu. Dotyczy wyłącznie osoby prowadzącej sklep.</li>
      </ul>
      <h2>Płatności</h2>
      <p>Płatność odbywa się na stronie Stripe, która może używać własnych, niezbędnych plików cookies (m.in. do zapobiegania oszustwom). Zasady opisuje polityka prywatności Stripe.</p>
      <h2>Statystyki</h2>
      <p>Jeśli statystyki są włączone, korzystamy z Plausible Analytics — narzędzia, które nie używa plików cookies i nie zbiera danych osobowych.</p>
      <h2>Jak zarządzać danymi w przeglądarce</h2>
      <p>Możesz usunąć dane strony w ustawieniach przeglądarki (zwykle: Ustawienia → Prywatność → Dane witryn).</p>
    </LegalPage>
  ),
});
