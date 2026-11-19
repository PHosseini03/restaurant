import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Reserve from "../pages/Reserve";
import Events from "../pages/Events";
import { DEMO_HOURS } from "../data/demo";
import { mockApi, renderAt } from "./render";
import { fillContact, nextWeekdayIso } from "./helpers";

const FRIDAY = nextWeekdayIso(5);
const MONDAY = nextWeekdayIso(1);
const AVAILABILITY = { date: FRIDAY, closed: false, slots: [{ time: "17:00", available: false }, { time: "19:00", available: true }] };

describe("Reservation form", () => {
  it("requires fields before submitting", async () => {
    const fetchMock = mockApi({ "/api/hours": DEMO_HOURS });
    vi.stubGlobal("fetch", fetchMock);
    renderAt(<Reserve />);
    expect(screen.getByText(/wählen sie ein datum/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /reservierung bestätigen/i }));
    expect(await screen.findByText("Bitte geben Sie Ihren vollständigen Namen ein")).toBeInTheDocument();
    expect(screen.getByText("Datum ist ein Pflichtfeld")).toBeInTheDocument();
    expect(fetchMock.mock.calls.some(([url]) => String(url).includes("/api/reservations"))).toBe(false);
  });

  it("asks for a time once a date is chosen", async () => {
    vi.stubGlobal("fetch", mockApi({ "/api/hours": DEMO_HOURS, "/api/availability": AVAILABILITY }));
    renderAt(<Reserve />);
    fireEvent.change(screen.getByLabelText("Datum"), { target: { value: FRIDAY } });
    await screen.findByRole("button", { name: "19:00" });
    await userEvent.click(screen.getByRole("button", { name: /reservierung bestätigen/i }));
    expect(await screen.findByText("Bitte wählen Sie eine Uhrzeit")).toBeInTheDocument();
  });

  it("books a table and shows the confirmation", async () => {
    const result = { id: 12, message: "Bis bald, Avery! Ihr Tisch für 4 Personen ist bestätigt.", date: FRIDAY, time: "19:00", party_size: 4 };
    const fetchMock = mockApi({ "/api/hours": DEMO_HOURS, "/api/availability": AVAILABILITY, "/api/reservations": result });
    vi.stubGlobal("fetch", fetchMock);
    renderAt(<Reserve />);
    fireEvent.change(screen.getByLabelText("Datum"), { target: { value: FRIDAY } });
    expect(await screen.findByRole("button", { name: "17:00" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "19:00" }));
    await userEvent.selectOptions(screen.getByLabelText("Personen"), "4");
    await fillContact();
    await userEvent.click(screen.getByRole("button", { name: /reservierung bestätigen/i }));
    expect(await screen.findByRole("heading", { name: "Tisch bestätigt" })).toBeInTheDocument();
    expect(screen.getByText("Bestätigungsnr. EO-00012")).toBeInTheDocument();
    const call = fetchMock.mock.calls.find(([url]) => String(url) === "/api/reservations") as unknown as [string, RequestInit];
    expect(JSON.parse(call[1].body as string)).toMatchObject({ date: FRIDAY, time: "19:00", party_size: 4, name: "Avery Stone" });
    await userEvent.click(screen.getByRole("button", { name: /weitere reservierung/i }));
    expect(screen.getByLabelText("Vollständiger Name")).toHaveValue("");
  });

  it("falls back to published hours offline and shows Monday closed", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    renderAt(<Reserve />);
    fireEvent.change(screen.getByLabelText("Datum"), { target: { value: MONDAY } });
    expect(await screen.findByText(/montags haben wir ruhetag/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Datum"), { target: { value: FRIDAY } });
    expect(await screen.findByRole("button", { name: "21:30" })).toBeEnabled();
  });

  it("shows an error toast when the booking fails", async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.startsWith("/api/availability")) return new Response(JSON.stringify({ success: true, data: AVAILABILITY, error: null }));
      if (url === "/api/reservations") return new Response(JSON.stringify({ success: false, data: null, error: "Diese Uhrzeit ist leider ausgebucht." }), { status: 409 });
      return new Response(JSON.stringify({ success: true, data: DEMO_HOURS, error: null }));
    });
    vi.stubGlobal("fetch", fetchMock);
    renderAt(<Reserve />);
    fireEvent.change(screen.getByLabelText("Datum"), { target: { value: FRIDAY } });
    await userEvent.click(await screen.findByRole("button", { name: "19:00" }));
    await fillContact();
    await userEvent.click(screen.getByRole("button", { name: /reservierung bestätigen/i }));
    await waitFor(() => expect(within(screen.getByRole("alert")).getByText(/konnte nicht abgeschlossen werden/i)).toBeInTheDocument());
  });
});

describe("Private events form", () => {
  it("validates guest count", async () => {
    vi.stubGlobal("fetch", mockApi({ "/api/hours": DEMO_HOURS }));
    renderAt(<Events />);
    await userEvent.type(screen.getByLabelText("Anzahl der Gäste"), "4");
    await userEvent.click(screen.getByRole("button", { name: /anfrage senden/i }));
    expect(await screen.findByText("Gästezahl muss zwischen 10 und 120 liegen")).toBeInTheDocument();
  });

  it("submits an inquiry", async () => {
    const fetchMock = mockApi({ "/api/hours": DEMO_HOURS, "/api/events": { id: 3, message: "Vielen Dank, Avery! Unser Event-Team meldet sich innerhalb eines Werktags bei Ihnen." } });
    vi.stubGlobal("fetch", fetchMock);
    renderAt(<Events />);
    await fillContact();
    fireEvent.change(screen.getByLabelText("Veranstaltungsdatum"), { target: { value: FRIDAY } });
    await userEvent.type(screen.getByLabelText("Anzahl der Gäste"), "40");
    await userEvent.selectOptions(screen.getByLabelText("Art der Veranstaltung"), "corporate");
    await userEvent.click(screen.getByRole("button", { name: /anfrage senden/i }));
    expect(await screen.findByRole("heading", { name: "Anfrage erhalten" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /weitere anfrage senden/i }));
    expect(screen.getByLabelText("Anzahl der Gäste")).toHaveValue(null);
  });
});
