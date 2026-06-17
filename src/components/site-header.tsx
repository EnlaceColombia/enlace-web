import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Heart, Menu, X } from "lucide-react";

import enlaceLogo from "@/assets/enlace-texto-blanco.svg";
import {
  isExternalHref,
  resolveHomeHref,
  resolveNavHref,
  siteNavItems,
  type NavMegaMenu,
} from "@/lib/site-nav";
import { DONATION_URL, LIVE_URL } from "@/lib/site";

const donateLinkProps = {
  href: DONATION_URL,
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

const liveLinkProps = {
  href: LIVE_URL,
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeMega = open ? siteNavItems.find((n) => n.label === open)?.mega : undefined;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled ? "border-white/10 shadow-lift" : "border-transparent"
      }`}
      style={{
        background: scrolled
          ? "linear-gradient(135deg, rgba(108,0,192,0.96), rgba(42,0,92,0.96))"
          : "var(--gradient-hero)",
        backdropFilter: scrolled ? "blur(14px)" : undefined,
      }}
      onMouseLeave={() => setOpen(null)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3 h-18 py-3 w-full lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-4">
          <a href={resolveHomeHref(pathname)} className="flex items-center self-center shrink-0">
            <img src={enlaceLogo} alt="Enlace+" className="h-11 sm:h-12 lg:h-14 w-auto block" />
          </a>

          <nav className="hidden lg:flex items-center justify-center gap-1 min-w-0">
            {siteNavItems.map((item) => {
              const href = resolveNavHref(item.href, pathname);
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpen(item.mega ? item.label : null)}
                >
                  <a
                    href={href}
                    {...(isExternalHref(href)
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors rounded-md"
                  >
                    {item.label}
                    {item.mega && <ChevronDown className="h-3.5 w-3.5 opacity-70" />}
                  </a>
                </div>
              );
            })}
          </nav>

          <div className="flex-1 min-w-2 lg:hidden" aria-hidden="true" />

          <div className="flex items-center gap-2 shrink-0">
            <a
              {...liveLinkProps}
              className="hidden md:inline-flex items-center gap-2 h-9 px-3 rounded-full btn-ghost-light text-sm"
            >
              <span className="h-2 w-2 rounded-full bg-red-500 live-dot" />
              EN VIVO
            </a>
            <a
              {...donateLinkProps}
              className="inline-flex items-center gap-2 h-10 px-4 sm:px-5 rounded-full btn-gold text-sm"
            >
              <Heart className="h-4 w-4" />
              Donar
            </a>
          </div>
          <button
            className="lg:hidden shrink-0 h-10 w-10 grid place-items-center rounded-md text-white hover:bg-white/10 -mr-1"
            onClick={() => setMobile(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {activeMega && <MegaMenu data={activeMega} pathname={pathname} />}
      </div>

      {mobile && <MobileMenu pathname={pathname} onClose={() => setMobile(false)} />}
    </header>
  );
}

function MegaMenu({ data, pathname }: { data: NavMegaMenu; pathname: string }) {
  const ctaHref = resolveNavHref(data.cta.href ?? "#", pathname);

  return (
    <div className="absolute left-0 right-0 top-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-lift border border-border overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_1fr_320px]">
          {data.cols.map((col) => (
            <div key={col.title} className="p-6 border-r border-border last:border-r-0">
              <p className="text-xs font-semibold tracking-widest uppercase text-violet mb-4">
                {col.title}
              </p>
              <ul className="space-y-1">
                {col.links.map((l) => {
                  const href = resolveNavHref(l.href ?? "#", pathname);
                  return (
                    <li key={l.label}>
                      <a
                        href={href}
                        {...(isExternalHref(href)
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="group flex items-start gap-3 rounded-lg p-3 hover:bg-secondary transition-colors"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg surface-violet">
                          <l.icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-foreground group-hover:text-violet">
                            {l.label}
                          </span>
                          <span className="block text-xs text-muted-foreground">{l.desc}</span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className="relative min-h-[220px] surface-violet p-6 flex flex-col justify-end">
            <img
              src={data.cta.img}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-luminosity"
              loading="lazy"
            />
            <div className="relative">
              <p className="text-xs font-semibold tracking-widest uppercase text-gold mb-2">
                Destacado
              </p>
              <h4 className="text-lg font-bold text-white mb-1">{data.cta.title}</h4>
              <p className="text-sm text-white/80 mb-4">{data.cta.desc}</p>
              <a
                href={ctaHref}
                {...(isExternalHref(ctaHref)
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:gap-3 transition-all"
              >
                Explorar <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm surface-dark p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <span className="text-2xl font-extrabold text-white">
            enlace<span className="text-gold">+</span>
          </span>
          <button
            onClick={onClose}
            className="h-10 w-10 grid place-items-center rounded-md text-white hover:bg-white/10"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1">
          {siteNavItems.map((n) => {
            const href = resolveNavHref(n.href, pathname);
            return (
              <a
                key={n.label}
                href={href}
                {...(isExternalHref(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                onClick={onClose}
                className="block py-3 px-3 rounded-lg text-white/90 hover:bg-white/10 text-base font-medium"
              >
                {n.label}
              </a>
            );
          })}
        </nav>
        <a
          {...donateLinkProps}
          onClick={onClose}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 h-12 rounded-full btn-gold"
        >
          <Heart className="h-4 w-4" /> Donar ahora
        </a>
      </div>
    </div>
  );
}
