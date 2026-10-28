import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage, pageHead } from "@/components/site/PlaceholderPage";

export const Route = createFileRoute("/ziola-i-rosliny")({
  head: () => pageHead("Zioła i rośliny", "Opisy wybranych ziół i roślin: jak je rozpoznać, co o nich wiemy i na co uważać.", "/ziola-i-rosliny"),
  component: ZiolaIRoslinyPage,
});

function ZiolaIRoslinyPage() {
  return <PlaceholderPage latin="Plantae officinales" title="Zioła i rośliny" intro="Opisy wybranych ziół i roślin: jak je rozpoznać, co o nich wiemy i na co uważać." />;
}
