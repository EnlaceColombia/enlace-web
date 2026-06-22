import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

import enlaceLogo from "@/assets/enlace-texto-blanco.svg";

export function AdminAuthLayout({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full overflow-hidden surface-hero flex items-center justify-center px-4 py-10 sm:py-14">
      <div className="absolute inset-0 ring-grid opacity-50" aria-hidden />
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-radial-glow)" }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img
              src={enlaceLogo}
              alt="Corporación Enlace Colombia"
              className="h-12 sm:h-14 w-auto mx-auto"
            />
          </Link>
          <p className="mt-4 text-xs font-semibold tracking-widest uppercase text-gold">
            Panel de administración
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">{title}</h1>
          {description ? (
            <p className="mt-2 text-sm text-white/75 max-w-sm mx-auto leading-relaxed">
              {description}
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/95 backdrop-blur-sm p-7 sm:p-8 shadow-lift text-foreground">
          {children}
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-white/60">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
          Acceso restringido al equipo autorizado
        </p>

        <p className="mt-3 text-center">
          <Link to="/" className="text-sm text-white/70 hover:text-white transition">
            ← Volver al sitio público
          </Link>
        </p>
      </div>
    </div>
  );
}
