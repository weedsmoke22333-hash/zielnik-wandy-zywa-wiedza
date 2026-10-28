import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage, pageHead } from "@/components/site/PlaceholderPage";

export const Route = createFileRoute("/regulamin")({
  head: () => pageHead("Regulamin", "Regulamin serwisu i sprzedaży e-booków. Treść dokumentu jest w przygotowaniu.", "/regulamin"),
  component: RegulaminPage,
});

function RegulaminPage() {
  return <PlaceholderPage latin="Lex" title="Regulamin" intro="Regulamin serwisu i sprzedaży e-booków. Treść dokumentu jest w przygotowaniu." />;
}
