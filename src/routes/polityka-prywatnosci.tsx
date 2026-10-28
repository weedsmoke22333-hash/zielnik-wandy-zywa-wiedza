import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/polityka-prywatnosci")({
  head: () => pageHead("Polityka prywatności", "Jak przetwarzamy dane osobowe: zamówienia, newsletter, formularz kontaktowy. Twoje prawa zgodnie z RODO.", "/polityka-prywatnosci"),
  component: () => (
    <LegalPage title="Polityka prywatności" latin="Secretum" updated="[DATA]">
      <h2>Administrator danych</h2>
      <p>Administratorem danych jest [IMIĘ I NAZWISKO / NAZWA FIRMY], [ADRES], e-mail: [E-MAIL].</p>
      <h2>Jakie dane i w jakim celu</h2>
      <ul>
        <li><strong>Zamówienia</strong> — adres e-mail i dane płatności w celu zawarcia i wykonania umowy (art. 6 ust. 1 lit. b RODO) oraz wypełnienia obowiązków podatkowych i księgowych (art. 6 ust. 1 lit. c RODO). Danych karty płatniczej nie przechowujemy — obsługuje je Stripe.</li>
        <li><strong>Newsletter i darmowy kalendarz</strong> — adres e-mail na podstawie Twojej zgody (art. 6 ust. 1 lit. a RODO). Zgodę możesz wycofać w każdej chwili, klikając link w wiadomości.</li>
        <li><strong>Formularz kontaktowy</strong> — imię, e-mail i treść wiadomości w celu odpowiedzi (art. 6 ust. 1 lit. f RODO — prawnie uzasadniony interes).</li>
        <li><strong>Statystyki odwiedzin</strong> — jeśli są włączone, korzystamy z Plausible Analytics, które nie używa plików cookies i nie zbiera danych pozwalających Cię zidentyfikować.</li>
      </ul>
      <h2>Komu przekazujemy dane</h2>
      <p>Korzystamy z usług zaufanych dostawców, którzy przetwarzają dane w naszym imieniu: Stripe (płatności), Supabase (baza danych i pliki), [MailerLite] (newsletter), [Resend] (wysyłka e-maili), Cloudflare (hosting). Część z nich może przetwarzać dane poza Europejskim Obszarem Gospodarczym — na podstawie decyzji Komisji Europejskiej (EU-U.S. Data Privacy Framework) lub standardowych klauzul umownych.</p>
      <h2>Jak długo przechowujemy dane</h2>
      <ul>
        <li>dane zamówień — przez okres wymagany przepisami podatkowymi (co do zasady 5 lat od końca roku podatkowego),</li>
        <li>newsletter — do wycofania zgody,</li>
        <li>korespondencja — do zakończenia sprawy, a następnie przez okres przedawnienia ewentualnych roszczeń.</li>
      </ul>
      <h2>Twoje prawa</h2>
      <p>Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia, sprzeciwu oraz wycofania zgody. Masz też prawo złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).</p>
      <h2>Pliki cookies</h2>
      <p>Szczegóły znajdziesz w <Link to="/polityka-cookies" className="underline underline-offset-4">polityce cookies</Link>.</p>
    </LegalPage>
  ),
});
