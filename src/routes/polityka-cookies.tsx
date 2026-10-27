import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage, pageHead } from "@/components/site/PlaceholderPage";

export const Route = createFileRoute("/polityka-cookies")({
  head: () => pageHead("Polityka cookies", "Informacje o plikach cookies używanych w serwisie. Treść dokumentu jest w przygotowaniu.", "/polityka-cookies"),
  component: PolitykaCookiesPage,
});

function PolitykaCookiesPage() {
  return <PlaceholderPage latin="Crustula" title="Polityka cookies" intro="Informacje o plikach cookies używanych w serwisie. Treść dokumentu jest w przygotowaniu." />;
}
