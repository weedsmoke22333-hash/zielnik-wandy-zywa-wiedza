import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { mainNav } from "./nav";

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
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        solid ? "border-b border-border bg-ivory text-deep" : "bg-transparent text-ivory",
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 md:px-10">
        <Link to="/" className="font-display text-[1.6rem] tracking-[-0.02em]" aria-label="Wanda Machocka — strona główna">
          Wanda Machocka
        </Link>
        <nav aria-label="Główna nawigacja" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[15px] font-medium">
            {mainNav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="link-underline py-2">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="flex h-12 w-12 items-center justify-center lg:hidden"
              aria-label={open ? "Zamknij menu" : "Otwórz menu"}
              aria-expanded={open}
            >
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-sm border-l-0 bg-deep p-0 text-ivory [&>button]:hidden">
            <div className="flex h-20 items-center justify-between px-6">
              <SheetTitle className="font-display text-2xl font-normal text-ivory">Wanda Machocka</SheetTitle>
              <SheetClose className="flex h-12 w-12 items-center justify-center" aria-label="Zamknij menu">
                <X className="h-6 w-6" />
              </SheetClose>
            </div>
            <nav aria-label="Menu mobilne" className="px-6 pt-6">
              <ul className="space-y-1">
                {mainNav.map((n) => (
                  <li key={n.to}>
                    <Link to={n.to} className="flex min-h-12 items-center font-display text-3xl">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
