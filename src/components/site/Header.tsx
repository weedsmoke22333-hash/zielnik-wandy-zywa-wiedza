import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { mainNav, safetyNav } from "./nav";
import { TextSizeToggle } from "./TextSizeToggle";

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overHero = pathname === "/";
  const solid = !overHero || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500 print:hidden",
        solid ? "border-b border-border bg-ivory text-deep" : "bg-transparent text-ivory",
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between gap-6 px-5 md:px-10">
        <Link to="/" className="shrink-0 font-display text-[1.6rem] tracking-[-0.02em]" aria-label="Wanda Machocka — strona główna">
          Wanda Machocka
        </Link>
        <nav aria-label="Główna nawigacja" className="hidden xl:block">
          <ul className="flex items-center gap-6 text-[0.9375rem] font-medium">
            {mainNav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="link-underline py-2">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <TextSizeToggle className="hidden sm:flex" />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="flex h-12 w-12 items-center justify-center xl:hidden"
                aria-label={open ? "Zamknij menu" : "Otwórz menu"}
                aria-expanded={open}
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm overflow-y-auto border-l-0 bg-deep p-0 text-ivory [&>button]:hidden">
              <div className="flex h-20 items-center justify-between px-6">
                <SheetTitle className="font-display text-2xl font-normal text-ivory">Wanda Machocka</SheetTitle>
                <SheetClose className="flex h-12 w-12 items-center justify-center" aria-label="Zamknij menu">
                  <X className="h-6 w-6" />
                </SheetClose>
              </div>
              <nav aria-label="Menu mobilne" className="px-6 pt-4">
                <ul className="space-y-1">
                  {mainNav.map((n) => (
                    <li key={n.to}>
                      <Link to={n.to} className="flex min-h-12 items-center font-display text-3xl">
                        {n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="latin mt-8 text-lg text-copper">Bezpieczeństwo</p>
                <ul className="mt-2">
                  {safetyNav.map((n) => (
                    <li key={n.to}>
                      <Link to={n.to} className="flex min-h-12 items-center text-lg">
                        {n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-8 border-t border-ivory/15 px-6 py-6">
                <p className="text-[0.9375rem] text-ivory/75">Rozmiar tekstu</p>
                <TextSizeToggle tone="light" className="mt-2 -ml-1.5" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
