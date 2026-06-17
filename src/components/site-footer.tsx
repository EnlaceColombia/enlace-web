import { useRouterState } from "@tanstack/react-router";
import {
  Apple,
  Clock,
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Play,
  Twitter,
  Youtube,
} from "lucide-react";

import enlaceLogo from "@/assets/enlace-texto-blanco.svg";
import { openConsentSettings } from "@/components/consent-notice";
import { ENLACE_PLUS_LINKS } from "@/lib/enlace-plus-links";
import { isExternalHref, resolveHomeHref, resolveNavHref } from "@/lib/site-nav";
import { APP_STORE_URL, DONATION_URL, GOOGLE_PLAY_URL, LIVE_URL } from "@/lib/site";

const donateLinkProps = {
  href: DONATION_URL,
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

const appStoreLinkProps = {
  href: APP_STORE_URL,
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

const googlePlayLinkProps = {
  href: GOOGLE_PLAY_URL,
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

const exploreLinks = [
  { label: "En vivo", href: LIVE_URL },
  { label: "Programas", href: "#programas" },
  { label: "Enlace+", href: ENLACE_PLUS_LINKS.enlacePlus },
  { label: "Música", href: ENLACE_PLUS_LINKS.musica },
  { label: "Biblia", href: ENLACE_PLUS_LINKS.biblia },
];

const ministryLinks = [
  { label: "Nosotros", href: "#nosotros" },
  { label: "Nuestra Labor", href: "#nuestra-labor" },
  { label: "Oración", href: "#oracion" },
  { label: "Donaciones", href: "#donar" },
  { label: "Maratónica", href: "/maratonica" },
  { label: "Transparencia", href: "#transparencia" },
  { label: "Testimonios", href: "#testimonios" },
];

function FooterCol({
  title,
  links,
  pathname,
}: {
  title: string;
  links: { label: string; href: string }[];
  pathname: string;
}) {
  return (
    <div>
      <p className="text-sm font-bold tracking-widest uppercase text-white mb-4">{title}</p>
      <ul className="space-y-2.5">
        {links.map((link) => {
          const href = resolveNavHref(link.href, pathname);
          return (
            <li key={link.label}>
              <a
                href={href}
                {...(isExternalHref(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="text-sm text-white/70 hover:text-gold transition"
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <footer id="contacto" className="surface-dark pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 pb-12 border-b border-white/10">
          <div>
            <a href={resolveHomeHref(pathname)} className="inline-block">
              <img src={enlaceLogo} alt="Enlace" className="h-10 sm:h-11 w-auto" />
            </a>
            <p className="mt-4 text-white/70 max-w-sm">
              Corporación Enlace Colombia · Llevando el mensaje de Jesucristo a los hogares
              colombianos a través de la televisión cristiana Enlace.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://facebook.com/CorporacionEnlaceColombia"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-gold hover:text-violet-deep text-white transition"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/corpenlaceco"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-gold hover:text-violet-deep text-white transition"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-gold hover:text-violet-deep text-white transition"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com/CorpEnlaceCo"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-gold hover:text-violet-deep text-white transition"
                aria-label="Twitter / X"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                {...appStoreLinkProps}
                className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm transition"
              >
                <Apple className="h-5 w-5" />
                <span>
                  <span className="block text-[10px] opacity-70">Descargar en</span>
                  <span className="block font-semibold -mt-0.5">App Store</span>
                </span>
              </a>
              <a
                {...googlePlayLinkProps}
                className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm transition"
              >
                <Play className="h-5 w-5" />
                <span>
                  <span className="block text-[10px] opacity-70">Disponible en</span>
                  <span className="block font-semibold -mt-0.5">Google Play</span>
                </span>
              </a>
            </div>
          </div>
          <FooterCol title="Explorar" links={exploreLinks} pathname={pathname} />
          <FooterCol title="Ministerio" links={ministryLinks} pathname={pathname} />
          <div>
            <p className="text-sm font-bold tracking-widest uppercase text-white mb-4">Contacto</p>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                Calle 124 # 70A – 28, Bogotá
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                (601) 6439200
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                WhatsApp peticiones: 318 306 0745
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                info@enlacecolombia.org
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                Lun a Vie · 7:00 AM – 5:00 PM
              </li>
            </ul>
            <a
              {...donateLinkProps}
              className="mt-5 inline-flex items-center gap-2 h-10 px-4 rounded-full btn-gold text-sm"
            >
              <Heart className="h-4 w-4" /> Donar online
            </a>
          </div>
        </div>
        <div className="pt-6 flex flex-wrap justify-between gap-x-4 gap-y-3 text-xs text-white/50 pr-16 sm:pr-0">
          <p className="max-w-md">
            © {new Date().getFullYear()} Corporación Enlace Colombia. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 sm:mr-20">
            <a href="/privacidad" className="hover:text-white">
              Privacidad
            </a>
            <a href="/terminos" className="hover:text-white">
              Términos
            </a>
            <a href="/cookies" className="hover:text-white">
              Cookies
            </a>
            <button
              type="button"
              onClick={openConsentSettings}
              className="hover:text-white text-left"
            >
              Gestionar cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
