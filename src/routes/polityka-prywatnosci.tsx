import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage, pageHead } from "@/components/site/PlaceholderPage";

export const Route = createFileRoute("/polityka-prywatnosci")({
  head: () => pageHead("Polityka prywatności", "Informacje o przetwarzaniu danych osobowych zgodnie z RODO. Treść dokumentu zostanie opublikowana przed uruchomieniem sprzedaży.", "/polityka-prywatnosci"),
  component: PolitykaPrywatnosciPage,
});

function PolitykaPrywatnosciPage() {
  return <PlaceholderPage latin="Privata" title="Polityka prywatności" intro="Informacje o przetwarzaniu danych osobowych zgodnie z RODO. Treść dokumentu zostanie opublikowana przed uruchomieniem sprzedaży." />;
}
