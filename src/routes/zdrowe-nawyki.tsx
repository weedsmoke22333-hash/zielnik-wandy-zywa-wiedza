import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage, pageHead } from "@/components/site/PlaceholderPage";

export const Route = createFileRoute("/zdrowe-nawyki")({
  head: () => pageHead("Zdrowe nawyki", "Sen, ruch, posiłki i odpoczynek — praktyczne wskazówki na każdy dzień.", "/zdrowe-nawyki"),
  component: ZdroweNawykiPage,
});

function ZdroweNawykiPage() {
  return <PlaceholderPage latin="Ars vivendi" title="Zdrowe nawyki" intro="Sen, ruch, posiłki i odpoczynek — praktyczne wskazówki na każdy dzień." />;
}
