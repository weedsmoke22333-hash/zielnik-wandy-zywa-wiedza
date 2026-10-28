import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Layout } from "@/components/site/Layout";
import { PLAUSIBLE_DOMAIN, SITE_URL, textSizeBootScript } from "@/lib/site";

function NotFoundComponent() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-32 pt-44">
      <p className="latin text-xl text-brown">Folium deperditum</p>
      <h1 className="text-h2 mt-3">Tej strony nie ma w zielniku.</h1>
      <p className="mt-6 text-muted-foreground">Mogła zostać przeniesiona albo jeszcze nie powstała.</p>
      <Link to="/" className="link-underline mt-8 inline-block font-semibold text-forest">
        Wróć na stronę główną
      </Link>
    </section>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl">Strona nie wczytała się</h1>
        <p className="mt-3 text-muted-foreground">Coś poszło nie tak. Spróbuj odświeżyć.</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-sm bg-forest px-5 py-3 font-semibold text-ivory"
        >
          Spróbuj ponownie
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Wanda Machocka — wiedza o ziołach" },
      { name: "description", content: "Wiedza o ziołach, zdrowe nawyki i poradniki Wandy Machockiej." },
      { name: "author", content: "Wanda Machocka" },
      { property: "og:site_name", content: "Wanda Machocka" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#182A22" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [
      { children: textSizeBootScript },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "Person", "@id": "#wanda", name: "Wanda Machocka", ...(SITE_URL ? { url: SITE_URL } : {}) },
            { "@type": "WebSite", name: "Wanda Machocka", inLanguage: "pl-PL", ...(SITE_URL ? { url: SITE_URL } : {}), publisher: { "@id": "#wanda" } },
          ],
        }),
      },
      ...(PLAUSIBLE_DOMAIN
        ? [{ src: "https://plausible.io/js/script.js", defer: true, "data-domain": PLAUSIBLE_DOMAIN } as Record<string, unknown>]
        : []),
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Outlet />
      </Layout>
    </QueryClientProvider>
  );
}
