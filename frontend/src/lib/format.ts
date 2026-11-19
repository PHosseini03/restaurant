const euro = (digits: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: digits, maximumFractionDigits: 2 });

/** 18 -> "18 €", 9.5 -> "9,50 €" */
export const formatPrice = (n: number) => euro(Number.isInteger(n) ? 0 : 2).format(n);

/** "17:30" -> "17:30" (24-hour clock, zero-padded) */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Local date as YYYY-MM-DD (avoids UTC shift from toISOString). */
export function toIsoDate(d: Date): string {
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
}

export function addDays(d: Date, days: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
}
