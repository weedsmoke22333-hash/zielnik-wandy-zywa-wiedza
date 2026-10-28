import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/zwroty-i-reklamacje")({
  head: () => pageHead("Zwroty i reklamacje", "Jak złożyć reklamację e-booka i kiedy przysługuje prawo odstąpienia od umowy.", "/zwroty-i-reklamacje"),
  component: () => (
    <LegalPage title="Zwroty i reklamacje" latin="Restitutio" updated="[DATA]">
      <h2>Coś nie działa?</h2>
      <p>Jeśli plik się nie otwiera, link wygasł albo e-book jest niekompletny — napisz na [E-MAIL] i podaj numer zamówienia lub adres e-mail użyty przy zakupie. Pomożemy szybko, zwykle tego samego dnia.</p>
      <h2>Reklamacja</h2>
      <ol>
        <li>Reklamację można złożyć mailowo na adres [E-MAIL] albo przez <Link to="/kontakt" className="underline underline-offset-4">formularz kontaktowy</Link>.</li>
        <li>Opisz problem i — jeśli możesz — dołącz zrzut ekranu.</li>
        <li>Odpowiemy w ciągu 14 dni. Jeśli e-book jest niezgodny z umową, dostarczymy poprawną wersję, a gdy to niemożliwe — zwrócimy pieniądze.</li>
      </ol>
      <h2>Odstąpienie od umowy</h2>
      <p>
        Przy zakupie e-booka prosimy o zgodę na natychmiastowe dostarczenie pliku. Po jej wyrażeniu i udostępnieniu linku
        prawo odstąpienia od umowy wygasa (art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta). Jeśli zgody nie wyrazisz,
        nie możemy dostarczyć pliku przed upływem 14 dni — dlatego zakup bez niej nie jest możliwy.
      </p>
      <p>Szczegóły znajdziesz w <Link to="/regulamin" className="underline underline-offset-4">regulaminie</Link>.</p>
    </LegalPage>
  ),
});
