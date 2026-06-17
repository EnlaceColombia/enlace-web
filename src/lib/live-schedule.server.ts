import process from "node:process";

import type { ScheduleData, ScheduleSlot } from "./site";

type RawSlot = {
  Hora: string;
  Dia: string;
  Imagen: string;
  Descripcion?: string;
  id_prg?: string;
};

const SCHEDULE_URL = "https://componentes.enlace.org/horarioenlace.aspx";
const DEFAULT_UTC_OFFSET = -5;

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export function upgradeScheduleImageUrl(url: string): string {
  if (!url) return url;
  return url
    .replace(/-sm\.(jpg|jpeg|png|webp)$/i, "-lg.$1")
    .replace(/_sm\.(jpg|jpeg|png|webp)$/i, "_lg.$1");
}

function getUtcOffsetHours(): number {
  const raw = process.env.LIVE_UTC_OFFSET;
  if (raw == null || raw === "") return DEFAULT_UTC_OFFSET;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : DEFAULT_UTC_OFFSET;
}

function getScheduleLocalTime(utcOffsetHours: number) {
  const now = new Date();
  const localMs = now.getTime() + utcOffsetHours * 60 * 60 * 1000;
  const local = new Date(localMs);
  return {
    hour: local.getUTCHours(),
    minute: local.getUTCMinutes(),
    dayIndex: local.getUTCDay(),
    dayLabel: DAY_NAMES[local.getUTCDay()] ?? "Hoy",
  };
}

function parseScheduleDay(rawPart: string): RawSlot[] {
  const first = JSON.parse(rawPart) as string;
  return JSON.parse(first) as RawSlot[];
}

function toSlot(raw: RawSlot): ScheduleSlot {
  const thumbUrl = raw.Imagen;
  return {
    hour: raw.Hora,
    title: raw.Dia,
    description: raw.Descripcion ?? "",
    imageUrl: upgradeScheduleImageUrl(raw.Imagen),
    thumbUrl,
    programId: raw.id_prg,
  };
}

function pickCurrentShow(slots: RawSlot[], hour: number, minute: number): RawSlot {
  const nowMinutes = hour * 60 + minute;
  let current = slots[0];

  for (const slot of slots) {
    const [h, m] = slot.Hora.split(":").map(Number);
    if (h * 60 + m <= nowMinutes) {
      current = slot;
    }
  }

  return current;
}

function getUpcomingShows(
  slots: RawSlot[],
  hour: number,
  minute: number,
  count: number,
): RawSlot[] {
  const nowMinutes = hour * 60 + minute;
  return slots
    .filter((slot) => {
      const [h, m] = slot.Hora.split(":").map(Number);
      return h * 60 + m > nowMinutes;
    })
    .slice(0, count);
}

async function fetchSchedulePayload(utcOffsetHours: number): Promise<string> {
  const initial = await fetch(SCHEDULE_URL, {
    headers: { "User-Agent": "enlace-web/1.0" },
  });
  if (!initial.ok) {
    throw new Error(`No se pudo cargar el horario (${initial.status})`);
  }

  const html = await initial.text();
  const viewState = html.match(/id="__VIEWSTATE" value="([^"]*)"/)?.[1];
  const eventValidation = html.match(/id="__EVENTVALIDATION" value="([^"]*)"/)?.[1];
  const viewStateGenerator = html.match(/id="__VIEWSTATEGENERATOR" value="([^"]*)"/)?.[1];

  if (!viewState || !eventValidation || !viewStateGenerator) {
    throw new Error("Respuesta de horario inválida");
  }

  const body = new URLSearchParams({
    __VIEWSTATE: viewState,
    __EVENTVALIDATION: eventValidation,
    __VIEWSTATEGENERATOR: viewStateGenerator,
    ScriptManager1: "UpdatePanel1|Timer1",
    __EVENTTARGET: "Timer1",
    __EVENTARGUMENT: "",
    detUTCOffset: String(utcOffsetHours),
  });

  const response = await fetch(SCHEDULE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "enlace-web/1.0",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`No se pudo actualizar el horario (${response.status})`);
  }

  const postHtml = await response.text();
  const match = postHtml.match(/id="TVShowsSchedule" value="([^"]*)"/);
  if (!match?.[1]) {
    throw new Error("Horario sin datos de programación");
  }

  return match[1]
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

export async function fetchScheduleData(): Promise<ScheduleData> {
  const utcOffset = getUtcOffsetHours();
  const { hour, minute, dayIndex, dayLabel } = getScheduleLocalTime(utcOffset);
  const scheduleRaw = await fetchSchedulePayload(utcOffset);
  const dayParts = scheduleRaw.split("|");

  if (dayParts.length < 7) {
    throw new Error("Formato de horario inesperado");
  }

  const todaySlots = parseScheduleDay(dayParts[dayIndex]);
  const current = pickCurrentShow(todaySlots, hour, minute);
  const upcomingRaw = getUpcomingShows(todaySlots, hour, minute, 3);

  return {
    live: toSlot(current),
    upcoming: upcomingRaw.map(toSlot),
    today: todaySlots.map(toSlot),
    dayLabel,
  };
}

/** Compatibilidad con llamadas anteriores. */
export async function fetchLiveNow(): Promise<ScheduleSlot> {
  const data = await fetchScheduleData();
  return data.live;
}
