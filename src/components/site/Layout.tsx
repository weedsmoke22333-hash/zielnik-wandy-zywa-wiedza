import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#tresc"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-sm bg-copper px-4 py-3 font-semibold text-deep focus:translate-y-0"
      >
        Przejdź do treści
      </a>
      <Header />
      <main id="tresc" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}
