import process from "node:process";

import { DEFAULT_MARATONICA_CONFIG, type MaratonicaConfig } from "./maratonica/types";
import { mapMaratonicaRow } from "./supabase/maratonica-map";
import { createSupabaseServerClient, isSupabaseServerConfigured } from "./supabase/server";

/**
 * Lee Maratónica desde Supabase (prioridad) o variables de entorno (fallback).
 */
export async function getMaratonicaConfig(): Promise<MaratonicaConfig> {
  if (isSupabaseServerConfigured()) {
    try {
      const supabase = createSupabaseServerClient();
      const { data, error } = await supabase
        .from("maratonica_config")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (data && !error) {
        return mapMaratonicaRow(data);
      }

      if (error) {
        console.error("Supabase maratonica_config:", error.message);
      }
    } catch (error) {
      console.error("No se pudo leer maratonica_config:", error);
    }
  }

  return getMaratonicaConfigFromEnv();
}

function getMaratonicaConfigFromEnv(): MaratonicaConfig {
  const env = process.env;

  return {
    enabled: parseEnabled(env.MARATONICA_ENABLED, DEFAULT_MARATONICA_CONFIG.enabled),
    headline: env.MARATONICA_HEADLINE?.trim() || DEFAULT_MARATONICA_CONFIG.headline,
    participation: env.MARATONICA_PARTICIPATION?.trim() || DEFAULT_MARATONICA_CONFIG.participation,
    eventDateLabel:
      env.MARATONICA_EVENT_DATE_LABEL?.trim() || DEFAULT_MARATONICA_CONFIG.eventDateLabel,
    countdownAt: env.MARATONICA_COUNTDOWN_AT?.trim() || DEFAULT_MARATONICA_CONFIG.countdownAt,
    eventEndAt: env.MARATONICA_EVENT_END_AT?.trim() || DEFAULT_MARATONICA_CONFIG.eventEndAt,
    description: env.MARATONICA_DESCRIPTION?.trim() || DEFAULT_MARATONICA_CONFIG.description,
    prayerPhone: env.MARATONICA_PRAYER_PHONE?.trim() || DEFAULT_MARATONICA_CONFIG.prayerPhone,
    prayerPhoneHint:
      env.MARATONICA_PRAYER_PHONE_HINT?.trim() || DEFAULT_MARATONICA_CONFIG.prayerPhoneHint,
  };
}

function parseEnabled(raw: string | undefined, fallback: boolean) {
  if (raw == null || raw === "") return fallback;
  return raw === "1" || raw.toLowerCase() === "true" || raw.toLowerCase() === "yes";
}
