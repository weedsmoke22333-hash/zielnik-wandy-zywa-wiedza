import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/regulamin")({
  head: () => pageHead("Regulamin sklepu", "Zasady sprzedaży e-booków (treści cyfrowych) w sklepie Wandy Machockiej.", "/regulamin"),
  component: () => (
    <LegalPage title="Regulamin sklepu" latin="Leges" updated="[DATA]">
      <h2>1. Sprzedawca</h2>
      <p>
        Sklep internetowy pod adresem [ADRES STRONY] prowadzi [IMIĘ I NAZWISKO / NAZWA FIRMY], [ADRES], [NIP i REGON —
        jeśli dotyczy], e-mail: [E-MAIL] („Sprzedawca”). Regulamin określa zasady sprzedaży treści cyfrowych (e-booków)
        i jest udostępniany nieodpłatnie przed zawarciem umowy.
      </p>
      <h2>2. Definicje</h2>
      <ul>
        <li><strong>E-book</strong> — treść cyfrowa w formacie PDF dostarczana przez udostępnienie linku do pobrania.</li>
        <li><strong>Konsument</strong> — osoba fizyczna dokonująca zakupu niezwiązanego bezpośrednio z jej działalnością gospodarczą lub zawodową.</li>
        <li><strong>Przedsiębiorca na prawach konsumenta</strong> — osoba fizyczna zawierająca umowę bezpośrednio związaną z jej działalnością, gdy umowa nie ma dla niej charakteru zawodowego.</li>
      </ul>
      <h2>3. Wymagania techniczne</h2>
      <p>Do zakupu i korzystania z e-booka potrzebne są: urządzenie z dostępem do internetu, aktualna przeglądarka, program do odczytu plików PDF oraz — w przypadku wysyłki linku — aktywny adres e-mail.</p>
      <h2>4. Zamówienia i płatności</h2>
      <ol>
        <li>Ceny podane są w złotych polskich i są cenami brutto.</li>
        <li>Płatności obsługuje Stripe Payments Europe Ltd. Dostępne metody: BLIK, Przelewy24 oraz karta płatnicza.</li>
        <li>Umowa zostaje zawarta z chwilą potwierdzenia płatności.</li>
        <li>[INFORMACJA O DOKUMENCIE SPRZEDAŻY — paragon / faktura na życzenie; uzupełnić zgodnie z formą prowadzonej działalności.]</li>
      </ol>
      <h2>5. Dostarczenie e-booka</h2>
      <p>
        Link do pobrania e-booka udostępniamy niezwłocznie po potwierdzeniu płatności — na stronie potwierdzenia
        zamówienia oraz, jeśli podano adres e-mail, w wiadomości e-mail. Link jest przypisany do zamówienia i pozwala na
        wielokrotne pobranie pliku w rozsądnym zakresie.
      </p>
      <h2>6. Prawo odstąpienia od umowy</h2>
      <p>
        Konsument może odstąpić od umowy w terminie 14 dni bez podania przyczyny. Prawo to nie przysługuje, jeżeli
        Sprzedawca rozpoczął dostarczanie treści cyfrowej za wyraźną i uprzednią zgodą konsumenta, który został
        poinformowany przed rozpoczęciem świadczenia, że po jego spełnieniu utraci prawo odstąpienia, i przyjął to do
        wiadomości, a Sprzedawca przekazał potwierdzenie (art. 38 ust. 1 pkt 13 ustawy z dnia 30 maja 2014 r. o prawach
        konsumenta). Zgodę tę kupujący wyraża, zaznaczając odpowiednie pole przed płatnością; potwierdzenie przesyłamy
        e-mailem.
      </p>
      <h2>7. Reklamacje</h2>
      <p>
        Sprzedawca odpowiada za zgodność e-booka z umową. Reklamację (np. uszkodzony plik, brak dostępu) można złożyć na
        adres [E-MAIL]. Odpowiemy w ciągu 14 dni. Więcej: <Link to="/zwroty-i-reklamacje" className="underline underline-offset-4">Zwroty i reklamacje</Link>.
      </p>
      <h2>8. Pozasądowe rozwiązywanie sporów</h2>
      <p>Konsument może skorzystać z pomocy miejskiego lub powiatowego rzecznika konsumentów albo wojewódzkiego inspektoratu Inspekcji Handlowej.</p>
      <h2>9. Prawa autorskie</h2>
      <p>E-booki są chronione prawem autorskim. Kupujący otrzymuje licencję na użytek osobisty; zabronione jest udostępnianie i rozpowszechnianie plików.</p>
      <h2>10. Charakter treści</h2>
      <p>E-booki mają charakter edukacyjny i nie stanowią porady medycznej. Nie zastępują konsultacji z lekarzem ani farmaceutą.</p>
      <h2>11. Dane osobowe</h2>
      <p>Zasady przetwarzania danych opisuje <Link to="/polityka-prywatnosci" className="underline underline-offset-4">polityka prywatności</Link>.</p>
      <h2>12. Postanowienia końcowe</h2>
      <p>W sprawach nieuregulowanych stosuje się przepisy prawa polskiego, w szczególności Kodeksu cywilnego i ustawy o prawach konsumenta.</p>
    </LegalPage>
  ),
});
