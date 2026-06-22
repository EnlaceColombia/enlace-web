/** Configuración pública de la página Maratónica (editable desde backoffice / env). */

export type MaratonicaConfig = {
  /** Si false, la página puede mostrar un aviso de evento no programado. */
  enabled: boolean;
  headline: string;
  participation: string;
  /** Texto visible, ej. "10 al 21 de Febrero 2026". */
  eventDateLabel: string;
  /** ISO 8601 — momento en que el contador llega a cero (inicio de la maratónica). */
  countdownAt: string;
  /** ISO 8601 — fin del evento (para estado "en curso"). */
  eventEndAt: string;
  description: string;
  prayerPhone: string;
  prayerPhoneHint: string;
};

export type MaratonicaCountdownPhase = "upcoming" | "live" | "ended";

export const DEFAULT_MARATONICA_CONFIG: MaratonicaConfig = {
  enabled: true,
  headline: "El Señor Tiene una Respuesta",
  participation: "Pastores Internacionales",
  eventDateLabel: "10 al 21 de Febrero 2026",
  countdownAt: "2026-02-10T05:00:00.000Z",
  eventEndAt: "2026-02-22T04:59:59.000Z",
  description:
    "Cada vez que apoyas la Maratónica entras en el canal de la promesa de la «Siembra y la Cosecha». Contribuyes a evangelizar el mundo: ayudas a difundir el mensaje del Evangelio de nuestro Señor Jesucristo a las almas que hoy necesitan esperanza y vida eterna.",
  prayerPhone: "(601) 6439200 Opc. 2",
  prayerPhoneHint: "Peticiones de oración",
};

export function getMaratonicaPhase(
  config: MaratonicaConfig,
  now = Date.now(),
): MaratonicaCountdownPhase {
  const start = new Date(config.countdownAt).getTime();
  const end = new Date(config.eventEndAt).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) return "upcoming";
  if (now < start) return "upcoming";
  if (now <= end) return "live";
  return "ended";
}

export function getMaratonicaCountdownTarget(
  config: MaratonicaConfig,
  now = Date.now(),
): string | null {
  const phase = getMaratonicaPhase(config, now);
  if (phase === "upcoming") return config.countdownAt;
  if (phase === "live") return config.eventEndAt;
  return null;
}
