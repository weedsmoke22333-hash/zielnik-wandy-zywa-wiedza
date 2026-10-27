import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage, pageHead } from "@/components/site/PlaceholderPage";

export const Route = createFileRoute("/zwroty-i-reklamacje")({
  head: () => pageHead("Zwroty i reklamacje", "Zasady zwrotów i składania reklamacji dla produktów cyfrowych. Treść dokumentu jest w przygotowaniu.", "/zwroty-i-reklamacje"),
  component: ZwrotyIReklamacjePage,
});

function ZwrotyIReklamacjePage() {
  return <PlaceholderPage latin="Restitutio" title="Zwroty i reklamacje" intro="Zasady zwrotów i składania reklamacji dla produktów cyfrowych. Treść dokumentu jest w przygotowaniu." />;
}
