import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { MeetWanda } from "@/components/home/MeetWanda";
import { HomeCalendar } from "@/components/home/HomeCalendar";
import { Specimens } from "@/components/home/Specimens";
import { FeaturedBooks } from "@/components/home/FeaturedBooks";
import { Knowledge } from "@/components/home/Knowledge";
import { Newsletter } from "@/components/home/Newsletter";
import { FinalCta } from "@/components/home/FinalCta";
import { Story } from "@/components/home/Story";
import { pageHead } from "@/lib/site";
import texture from "@/assets/hero-texture.webp";

export const Route = createFileRoute("/")({
  head: () => {
    const h = pageHead(
      "Wanda Machocka — Blisko natury. Świadomie dla zdrowia.",
      "Wiedza o ziołach, kalendarz zbioru, atlas roślin i praktyczne poradniki, które pomagają świadomie troszczyć się o siebie każdego dnia.",
      "/",
    );
    return { ...h, links: [...h.links, { rel: "preload", as: "image", href: texture, fetchPriority: "high" }] };
  },
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <Story>
        <MeetWanda />
        <HomeCalendar />
        <Specimens />
        <FeaturedBooks />
      </Story>
      <Knowledge />
      <Newsletter />
      <FinalCta />
    </>
  );
}
