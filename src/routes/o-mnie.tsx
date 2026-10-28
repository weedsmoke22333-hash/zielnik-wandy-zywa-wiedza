import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage, pageHead } from "@/components/site/PlaceholderPage";

export const Route = createFileRoute("/o-mnie")({
  head: () => pageHead("O mnie", "Kilka słów o tym, dlaczego powstało to miejsce i jak podchodzę do wiedzy o ziołach.", "/o-mnie"),
  component: OMniePage,
});

function OMniePage() {
  return <PlaceholderPage latin="Herbarium personale" title="O mnie" intro="Kilka słów o tym, dlaczego powstało to miejsce i jak podchodzę do wiedzy o ziołach." />;
}
