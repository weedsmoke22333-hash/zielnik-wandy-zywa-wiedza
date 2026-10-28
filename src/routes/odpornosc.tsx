import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage, pageHead } from "@/components/site/PlaceholderPage";

export const Route = createFileRoute("/odpornosc")({
  head: () => pageHead("Odporność", "Codzienne nawyki, które wspierają organizm — opisane rzetelnie i bez obietnic cudów.", "/odpornosc"),
  component: OdpornoscPage,
});

function OdpornoscPage() {
  return <PlaceholderPage latin="Vis naturae" title="Odporność" intro="Codzienne nawyki, które wspierają organizm — opisane rzetelnie i bez obietnic cudów." />;
}
