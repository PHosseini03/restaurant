import { demoResponse } from "../api/demo";

describe("demoResponse (static demo build)", () => {
  it("confirms /api/reservations like the backend does", () => {
    const result = demoResponse("/api/reservations", {"name":"Avery Klein","party_size":1,"date":"2026-11-24","time":"19:00"}) as Record<string, unknown>;
    expect(typeof result.id).toBe("number");
    expect(result.message).toContain("für 1 Person ist");
    expect(result).toMatchObject({"party_size":1});
  });

  it("confirms /api/events like the backend does", () => {
    const result = demoResponse("/api/events", {"name":"Avery Klein"}) as Record<string, unknown>;
    expect(typeof result.id).toBe("number");
    expect(result.message).toContain("Vielen Dank, Avery!");
    expect(result).toMatchObject({});
  });

  it("falls back to a generic confirmation for unknown endpoints and bad payloads", () => {
    const result = demoResponse("/api/unknown", null) as Record<string, unknown>;
    expect(typeof result.id).toBe("number");
    expect(result.message).toBe("Vielen Dank! Ihre Anfrage ist eingegangen.");
  });
});
