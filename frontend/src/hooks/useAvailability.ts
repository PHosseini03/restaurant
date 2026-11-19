import { useEffect, useState } from "react";
import { api } from "../api/client";
import { parseIsoDate, slotsForDate } from "../lib/slots";

export interface Slot {
  time: string;
  available: boolean;
}

interface Availability {
  date: string;
  closed: boolean;
  slots: Slot[];
}

function localAvailability(date: string): Availability {
  const slots = slotsForDate(parseIsoDate(date)).map((time) => ({ time, available: true }));
  return { date, closed: slots.length === 0, slots };
}

/** Seating times for a date from the API, falling back to the published hours. */
export function useAvailability(date: string) {
  const [remote, setRemote] = useState<Availability | null>(null);

  useEffect(() => {
    if (!date) return;
    let active = true;
    api
      .get<Availability>(`/api/availability?date=${encodeURIComponent(date)}`)
      .then((data) => active && setRemote(data))
      .catch(() => active && setRemote(localAvailability(date)));
    return () => {
      active = false;
    };
  }, [date]);

  if (!date) return { availability: null, loading: false };
  const current = remote?.date === date ? remote : null;
  return { availability: current, loading: current === null };
}
