import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

/** Next date (from tomorrow) on the given JS weekday (Sunday=0), as YYYY-MM-DD. */
export function nextWeekdayIso(weekday: number): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() !== weekday) d.setDate(d.getDate() + 1);
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
}

export async function fillContact() {
  await userEvent.type(screen.getByLabelText("Vollständiger Name"), "Avery Stone");
  await userEvent.type(screen.getByLabelText("Telefon"), "503 555 0100");
  await userEvent.type(screen.getByLabelText("E-Mail"), "avery@example.com");
}
