import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage, pageHead } from "@/components/site/PlaceholderPage";

export const Route = createFileRoute("/blog")({
  head: () => pageHead("Blog", "Artykuły o roślinach, tradycji zielarskiej i odpowiedzialnym korzystaniu z ziół.", "/blog"),
  component: BlogPage,
});

function BlogPage() {
  return <PlaceholderPage latin="Folia" title="Blog" intro="Artykuły o roślinach, tradycji zielarskiej i odpowiedzialnym korzystaniu z ziół." />;
}
