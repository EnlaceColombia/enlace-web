/** URLs públicas del sitio. */

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
