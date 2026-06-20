/** URLs públicas del sitio. */

/** Nombre legal / marca para títulos y redes sociales. */
export const SITE_NAME = "Corporación Enlace Colombia";

export const SITE_TAGLINE = "Llevando esperanza a millones de hogares";

export const SITE_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;

export const SITE_DESCRIPTION =
  "Transmisión cristiana 24/7, oración, donaciones seguras y contenido que transforma vidas. Acompáñanos en vivo desde cualquier lugar.";

const DEFAULT_SITE_URL = "https://www.enlacecolombia.org";

/** URL pública del sitio (sin barra final). Usada para og:image absoluta en WhatsApp. */
export function getSiteUrl() {
  const raw = import.meta.env.VITE_SITE_URL as string | undefined;
  return (raw?.trim() || DEFAULT_SITE_URL).replace(/\/$/, "");
}

/**
 * Imagen de vista previa (WhatsApp, Facebook, X).
 * - Pon un PNG/JPG en `public/og-image.png` (recomendado 1200×630 px), o
 * - Define `VITE_SITE_OG_IMAGE_URL` en `.env` con la URL completa de otra imagen.
 */
export function getSiteOgImageUrl() {
  const override = import.meta.env.VITE_SITE_OG_IMAGE_URL as string | undefined;
  if (override?.trim()) return override.trim();
  return `${getSiteUrl()}/og-image.png`;
}

/** Pasarela de donaciones (ZonaPagos — Corporación Enlace Colombia). */
export const DONATION_URL = "https://www.zonapagos.com/t_corpenlace/pagos.asp";

/** Actualización registro web ESAL (DIAN) — página interna con documentos. */
export const REGISTRO_WEB_PATH = "/registro-web";

/** @deprecated Usar REGISTRO_WEB_PATH */
export const REGISTRO_WEB_URL = REGISTRO_WEB_PATH;

/** Página de transmisión en vivo en Enlace+. */
export const LIVE_URL = "https://enlace.plus/live";

/** Player embebible (misma señal que usa enlace.plus; CDN livecdnusa.enlace.plus). */
export const LIVE_EMBED_URL =
  "https://componentes.enlace.org/live#/player?enableInfoAndActivity=false&defaultDrawer=&autoPlay=true&mute=false";

/** App Enlace+ en App Store (iOS). */
export const APP_STORE_URL = "https://apps.apple.com/co/app/enlace/id602060573";

/** App Enlace+ en Google Play (Android). */
export const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.ziecorp.enlace";

/** WhatsApp — Corporación Enlace Colombia. */
export const WHATSAPP_NUMBER = "573183060745";
export const WHATSAPP_DEFAULT_MESSAGE =
  "Hola estoy contactando a Enlace Colombia desde la página web";

export function getWhatsAppUrl(message = WHATSAPP_DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export type PrayerRequestForm = {
  name: string;
  location: string;
  contact: string;
  reason: string;
  wantsContact: boolean;
};

export function buildPrayerRequestWhatsAppMessage(form: PrayerRequestForm) {
  const lines = [
    WHATSAPP_DEFAULT_MESSAGE,
    "",
    "*Petición de oración*",
    "",
    `*Nombre:* ${form.name.trim()}`,
  ];

  if (form.location.trim()) {
    lines.push(`*País / Ciudad:* ${form.location.trim()}`);
  }
  if (form.contact.trim()) {
    lines.push(`*Contacto:* ${form.contact.trim()}`);
  }

  lines.push(`*Motivo:* ${form.reason.trim()}`);
  lines.push(`*Deseo contacto pastoral:* ${form.wantsContact ? "Sí" : "No"}`);

  return lines.join("\n");
}

export type ScheduleSlot = {
  hour: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbUrl: string;
  programId?: string;
};

export type ScheduleData = {
  live: ScheduleSlot;
  upcoming: ScheduleSlot[];
  today: ScheduleSlot[];
  dayLabel: string;
};

/** @deprecated Usar ScheduleSlot */
export type LiveNow = ScheduleSlot;
