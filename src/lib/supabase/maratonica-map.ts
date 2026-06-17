import type { MaratonicaConfigRow } from "@/lib/supabase/database.types";
import type { MaratonicaConfig } from "@/lib/maratonica/types";

export function mapMaratonicaRow(row: MaratonicaConfigRow): MaratonicaConfig {
  return {
    enabled: row.enabled,
    headline: row.headline,
    participation: row.participation,
    eventDateLabel: row.event_date_label,
    countdownAt: row.countdown_at,
    eventEndAt: row.event_end_at,
    description: row.description,
    prayerPhone: row.prayer_phone,
    prayerPhoneHint: row.prayer_phone_hint,
  };
}

export function mapMaratonicaConfigToRow(
  config: MaratonicaConfig,
): Omit<MaratonicaConfigRow, "id" | "updated_at"> {
  return {
    enabled: config.enabled,
    headline: config.headline,
    participation: config.participation,
    event_date_label: config.eventDateLabel,
    countdown_at: config.countdownAt,
    event_end_at: config.eventEndAt,
    description: config.description,
    prayer_phone: config.prayerPhone,
    prayer_phone_hint: config.prayerPhoneHint,
  };
}

/** Convierte ISO → valor para input datetime-local. */
export function toDatetimeLocalValue(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocalValue(value: string) {
  return new Date(value).toISOString();
}
