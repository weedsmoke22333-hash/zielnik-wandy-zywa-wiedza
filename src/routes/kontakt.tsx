import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage, pageHead } from "@/components/site/PlaceholderPage";

export const Route = createFileRoute("/kontakt")({
  head: () => pageHead("Kontakt", "Formularz kontaktowy pojawi się tutaj wkrótce.", "/kontakt"),
  component: KontaktPage,
});

function KontaktPage() {
  return <PlaceholderPage latin="Epistula" title="Kontakt" intro="Formularz kontaktowy pojawi się tutaj wkrótce." />;
}
