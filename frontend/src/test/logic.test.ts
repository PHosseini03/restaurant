import { describe, expect, it, vi } from "vitest";
import { addDays, formatPrice, formatTime, toIsoDate } from "../lib/format";
import { parseIsoDate, slotsForDate } from "../lib/slots";
import { filterMenu } from "../lib/menu";
import { rules, validate } from "../lib/validation";
import { api, ApiError, request } from "../api/client";
import { DEMO_MENU } from "../data/demo";

describe("format helpers", () => {
  it("formats prices and times", () => {
    expect(formatPrice(18)).toBe("18 €");
    expect(formatPrice(9.5)).toBe("9,50 €");
    expect(formatTime("17:30")).toBe("17:30");
    expect(formatTime("9:05")).toBe("09:05");
    expect(formatTime("00:15")).toBe("00:15");
  });

  it("builds local ISO dates and adds days", () => {
    const d = new Date(2026, 0, 31);
    expect(toIsoDate(d)).toBe("2026-01-31");
    expect(toIsoDate(addDays(d, 1))).toBe("2026-02-01");
    expect(toIsoDate(parseIsoDate("2026-03-05"))).toBe("2026-03-05");
  });
});

describe("slotsForDate", () => {
  it("is closed on Monday", () => {
    expect(slotsForDate(parseIsoDate("2026-11-16"))).toEqual([]);
  });
  it("matches backend Friday and Sunday hours", () => {
    const friday = slotsForDate(parseIsoDate("2026-11-20"));
    expect(friday[0]).toBe("17:00");
    expect(friday.at(-1)).toBe("21:30");
    expect(slotsForDate(parseIsoDate("2026-11-22"))[0]).toBe("12:00");
  });
});

describe("filterMenu", () => {
  it("filters by category and all selected tags", () => {
    expect(filterMenu(DEMO_MENU, "all", [])).toHaveLength(DEMO_MENU.length);
    expect(filterMenu(DEMO_MENU, "desserts", []).every((i) => i.category === "desserts")).toBe(true);
    expect(filterMenu(DEMO_MENU, "wood-fire", ["vegan"]).map((i) => i.name)).toEqual(["Blumenkohl aus dem Ofen"]);
    expect(filterMenu(DEMO_MENU, "sides", ["vegan", "vegetarian"])).toEqual([]);
  });
});

describe("validate", () => {
  const schema = { name: [rules.name], email: [rules.email], phone: [rules.phone], size: [rules.number("Size", 1, 12)], note: [rules.safeText], date: [rules.required("Date")] };
  it("passes valid values", () => {
    expect(validate({ name: "Avery Stone", email: "a@example.com", phone: "503 555 0100", size: "4", note: "hi", date: "2026-12-01" }, schema)).toEqual({});
  });
  it("flags invalid values", () => {
    const errors = validate({ name: "<b>", email: "x", phone: "?", size: "13", note: "<i>", date: "" }, schema);
    expect(Object.keys(errors).sort()).toEqual(["date", "email", "name", "note", "phone", "size"]);
    expect(rules.minLength("City", 3)("ab")).toMatch(/mindestens 3 Zeichen/);
  });
});

describe("api client", () => {
  it("unwraps success and surfaces server errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: 1, error: null }))).mockResolvedValueOnce(new Response(JSON.stringify({ success: false, data: null, error: "nope" }), { status: 422 })));
    await expect(api.get("/x")).resolves.toBe(1);
    await expect(api.post("/x", {})).rejects.toThrow("nope");
  });
  it("flags network and non-JSON failures", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce(new TypeError("offline")).mockResolvedValueOnce(new Response("<html>", { status: 502 })));
    const err = await request("/x").catch((e: unknown) => e);
    expect((err as ApiError).isNetwork).toBe(true);
    await expect(request("/x")).rejects.toThrow("unerwartet geantwortet");
  });
});
