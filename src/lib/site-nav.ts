import type { LucideIcon } from "lucide-react";
import { BookOpen, HandHeart, Music2, ShieldCheck, Sparkles, Star, Tv, Users2 } from "lucide-react";

import progPredicas from "@/assets/program-predicas.jpg";
import { ENLACE_PLUS_LINKS } from "@/lib/enlace-plus-links";
import { REGISTRO_WEB_PATH } from "@/lib/site";

export type NavMegaLink = {
  label: string;
  desc: string;
  icon: LucideIcon;
  href?: string;
};

export type NavMegaColumn = {
  title: string;
  links: NavMegaLink[];
};

export type NavMegaMenu = {
  cols: NavMegaColumn[];
  cta: {
    title: string;
    desc: string;
    img: string;
    href?: string;
  };
};

export type NavItem = {
  label: string;
  href: string;
  mega?: NavMegaMenu;
};

export function isExternalHref(href: string) {
  return href.startsWith("http");
}

/** Anclas del home funcionan desde cualquier ruta (ej. /maratonica → /#nosotros). */
export function resolveNavHref(href: string, pathname: string) {
  if (isExternalHref(href)) return href;
  if (href.startsWith("/") && !href.startsWith("/#")) return href;
  if (href.startsWith("#")) {
    return pathname === "/" ? href : `/${href}`;
  }
  return href;
}

export function resolveHomeHref(pathname: string) {
  return pathname === "/" ? "#inicio" : "/";
}

export const siteNavItems: NavItem[] = [
  { label: "Inicio", href: "#inicio" },
  {
    label: "Nosotros",
    href: "#nosotros",
    mega: {
      cols: [
        {
          title: "Quiénes somos",
          links: [
            {
              label: "Nosotros",
              desc: "Misión, visión y valores",
              icon: Users2,
              href: "#nosotros",
            },
            {
              label: "Nuestra Labor",
              desc: "Los 4 pilares de fidelización",
              icon: HandHeart,
              href: "#nuestra-labor",
            },
            {
              label: "Transparencia",
              desc: "Te rendimos cuentas",
              icon: ShieldCheck,
              href: "#transparencia",
            },
          ],
        },
        {
          title: "Comunidad",
          links: [
            { label: "Oración", desc: "Envía tu petición", icon: HandHeart, href: "#oracion" },
            {
              label: "Testimonios",
              desc: "Historias que inspiran",
              icon: Star,
              href: "#testimonios",
            },
            {
              label: "Reflexiones",
              desc: "Devocionales y blog",
              icon: BookOpen,
              href: "#reflexiones",
            },
          ],
        },
      ],
      cta: { title: "Más de 20 años", desc: "Llevando esperanza a Colombia", img: progPredicas },
    },
  },
  // Menú En Vivo oculto: el acceso principal está en el botón EN VIVO del header.
  /*
  {
    label: "En Vivo",
    href: "#en-vivo",
    mega: {
      cols: [
        {
          title: "Transmisión",
          links: [
            { label: "Enlace TV en vivo", desc: "Señal 24/7", icon: Radio, href: LIVE_URL },
            { label: "Programación de hoy", desc: "Guía completa", icon: Tv, href: "#en-vivo" },
            {
              label: "Eventos especiales",
              desc: "Conferencias y conciertos",
              icon: Sparkles,
              href: "#en-vivo",
            },
          ],
        },
        {
          title: "On-Demand",
          links: [
            {
              label: "Enlace+",
              desc: "Películas y series",
              icon: Play,
              href: ENLACE_PLUS_LINKS.enlacePlus,
            },
            {
              label: "Música cristiana",
              desc: "Conciertos y videoclips",
              icon: Music2,
              href: ENLACE_PLUS_LINKS.musica,
            },
            {
              label: "Biblia interactiva",
              desc: "Lecturas guiadas",
              icon: BookOpen,
              href: ENLACE_PLUS_LINKS.bibliaInteractiva,
            },
          ],
        },
      ],
      cta: { title: "Descarga la app", desc: "Lleva Enlace contigo", img: progEnlacePlus },
    },
  },
  */
  {
    label: "Programas",
    href: "#programas",
    mega: {
      cols: [
        {
          title: "Categorías",
          links: [
            {
              label: "Prédicas",
              desc: "Enseñanza bíblica",
              icon: Tv,
              href: ENLACE_PLUS_LINKS.predicas,
            },
            {
              label: "Niños",
              desc: "Programas infantiles",
              icon: Users2,
              href: ENLACE_PLUS_LINKS.ninos,
            },
            {
              label: "Jóvenes",
              desc: "Nueva generación",
              icon: Sparkles,
              href: ENLACE_PLUS_LINKS.jovenes,
            },
          ],
        },
        {
          title: "Destacados",
          links: [
            {
              label: "Familia",
              desc: "Vida en el hogar",
              icon: Star,
              href: ENLACE_PLUS_LINKS.familia,
            },
            {
              label: "En Casa Con…",
              desc: "Yuri & Rodrigo Espinoza",
              icon: Star,
              href: ENLACE_PLUS_LINKS.enCasaCon,
            },
            {
              label: "Salmo 23",
              desc: "Devocional diario",
              icon: BookOpen,
              href: ENLACE_PLUS_LINKS.salmo23,
            },
            {
              label: "Música 24/7",
              desc: "Adoración sin pausa",
              icon: Music2,
              href: ENLACE_PLUS_LINKS.musica,
            },
          ],
        },
      ],
      cta: {
        title: "Estrenos de la semana",
        desc: "Nuevo contenido cada lunes",
        img: progPredicas,
        href: ENLACE_PLUS_LINKS.programs,
      },
    },
  },
  { label: "Maratónica", href: "/maratonica" },
  { label: "Actualización, registro web 2025", href: REGISTRO_WEB_PATH },
  { label: "Contacto", href: "#contacto" },
];
