// Client-side mirror of backend opening hours, used when the API is offline.
import { DEMO_HOURS } from "../data/demo";

const SLOT_MINUTES = 30;
const LAST_SEATING_BEFORE_CLOSE = 90;
export const MAX_DAYS_AHEAD = 90;

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** JS getDay(): Sunday=0. DEMO_HOURS.weekly is Monday-first. */
export function slotsForDate(date: Date): string[] {
  const hours = DEMO_HOURS.weekly[(date.getDay() + 6) % 7];
  if (!hours.open || !hours.close) return [];
  const slots: string[] = [];
  const last = toMinutes(hours.close) - LAST_SEATING_BEFORE_CLOSE;
  for (let t = toMinutes(hours.open); t <= last; t += SLOT_MINUTES) {
    slots.push(`${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`);
  }
  return slots;
}

/** Parse YYYY-MM-DD as a local date. */
export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
