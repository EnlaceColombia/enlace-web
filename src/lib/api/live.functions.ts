import { createServerFn } from "@tanstack/react-start";

import { fetchLiveNow, fetchScheduleData } from "../live-schedule.server";
import type { ScheduleData, ScheduleSlot } from "../site";

export const getSchedule = createServerFn({ method: "GET" }).handler(
  async (): Promise<ScheduleData> => fetchScheduleData(),
);

export const getLiveNow = createServerFn({ method: "GET" }).handler(
  async (): Promise<ScheduleSlot> => fetchLiveNow(),
);
