import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { Philosophy } from "@/components/home/Philosophy";
import { MeetWanda } from "@/components/home/MeetWanda";
import { FeaturedBooks } from "@/components/home/FeaturedBooks";
import { Knowledge } from "@/components/home/Knowledge";
import { Newsletter } from "@/components/home/Newsletter";
import { FinalCta } from "@/components/home/FinalCta";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wanda Machocka — Blisko natury. Świadomie dla zdrowia." },
      { name: "description", content: "Wiedza o ziołach, naturalne inspiracje i praktyczne poradniki, które pomagają świadomie troszczyć się o siebie każdego dnia." },
      { property: "og:title", content: "Wanda Machocka — Blisko natury. Świadomie dla zdrowia." },
      { property: "og:description", content: "Wiedza o ziołach, zdrowe nawyki i e-booki pisane odpowiedzialnie." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <Philosophy />
      <MeetWanda />
      <FeaturedBooks />
      <Knowledge />
      <Newsletter />
      <FinalCta />
    </>
  );
}
