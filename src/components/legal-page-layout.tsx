import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import enlaceLogo from "@/assets/enlace-texto-blanco.svg";

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-10 last:mb-0">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_strong]:text-foreground [&_a]:text-violet [&_a]:font-medium [&_a]:hover:underline">
        {children}
      </div>
    </section>
  );
}

export function LegalPageLayout({
  title,
  subtitle,
  effectiveDate,
  children,
}: {
  title: string;
  subtitle: string;
  effectiveDate: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="surface-hero border-b border-white/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-5 flex items-center justify-between gap-4">
          <Link to="/" className="inline-block">
            <img src={enlaceLogo} alt="Enlace" className="h-10 w-auto" />
          </Link>
          <Link to="/" className="text-sm font-medium text-white/80 hover:text-white transition">
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        <p className="text-xs font-semibold tracking-widest uppercase text-violet">{subtitle}</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
          {title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Vigente desde: {effectiveDate}</p>
        <div className="mt-10">{children}</div>
      </main>

      <footer className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 flex flex-wrap justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Corporación Enlace Colombia — CEC</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacidad" className="hover:text-violet transition">
              Privacidad
            </Link>
            <Link to="/terminos" className="hover:text-violet transition">
              Términos
            </Link>
            <Link to="/cookies" className="hover:text-violet transition">
              Cookies
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
