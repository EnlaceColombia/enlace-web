/** URLs públicas del sitio. */

/** Pasarela de donaciones (ZonaPagos — Corporación Enlace Colombia). */
export const DONATION_URL = "https://www.zonapagos.com/t_corpenlace/pagos.asp";

/** Página de transmisión en vivo en Enlace+. */
export const LIVE_URL = "https://enlace.plus/live";

/** Player embebible (misma señal que usa enlace.plus; CDN livecdnusa.enlace.plus). */
export const LIVE_EMBED_URL =
  "https://componentes.enlace.org/live#/player?enableInfoAndActivity=false&defaultDrawer=&autoPlay=true&mute=false";

/** App Enlace+ en App Store (iOS). */
export const APP_STORE_URL = "https://apps.apple.com/co/app/enlace/id602060573";

/** App Enlace+ en Google Play (Android). */
export const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.ziecorp.enlace";

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
