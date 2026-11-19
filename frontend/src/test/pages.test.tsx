import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "../App";
import MenuPage from "../pages/Menu";
import Gallery from "../pages/Gallery";
import { DEMO_HOURS, DEMO_MENU, DEMO_SPECIALS } from "../data/demo";
import { mockApi, renderAt } from "./render";

const ROUTES = { "/api/specials": DEMO_SPECIALS, "/api/menu": DEMO_MENU, "/api/hours": DEMO_HOURS };

describe("App shell", () => {
  it("renders the hero and chef specials", async () => {
    vi.stubGlobal("fetch", mockApi(ROUTES));
    renderAt(<App />);
    expect(screen.getByRole("heading", { level: 1, name: /über feuer gegart/i })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Dry-Aged Ribeye 450 g" })).toBeInTheDocument();
  });

  it("renders every page by route", () => {
    vi.stubGlobal("fetch", mockApi(ROUTES));
    const pages = [["/menu", /saisonal, rauchig/i], ["/about", /zehn jahre/i], ["/gallery", /rauch, flammen/i], ["/events", /gemeinsam/i], ["/reserve", /ihr platz/i], ["/missing", /404/]] as const;
    for (const [path, title] of pages) {
      const { unmount } = renderAt(<App />, path);
      expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
      unmount();
    }
  });

  it("opens and closes the mobile menu", async () => {
    vi.stubGlobal("fetch", mockApi(ROUTES));
    renderAt(<App />);
    await userEvent.click(screen.getByRole("button", { name: /menü öffnen/i }));
    expect(document.getElementById("mobile-menu")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: /menü öffnen/i })).toHaveAttribute("aria-expanded", "false");
  });
});

describe("Menu page", () => {
  it("falls back to demo data offline and filters by category and diet", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    renderAt(<MenuPage />);
    expect(await screen.findByRole("heading", { name: "Trüffel-Pommes" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Aus dem Holzofen" }));
    expect(screen.queryByRole("heading", { name: "Trüffel-Pommes" })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Vegan" }));
    expect(screen.getByRole("heading", { name: "Blumenkohl aus dem Ofen" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Eichengeräucherte Short Rib" })).not.toBeInTheDocument();
  });

  it("shows an empty state and resets filters", async () => {
    vi.stubGlobal("fetch", mockApi(ROUTES));
    renderAt(<MenuPage />);
    await screen.findByRole("heading", { name: "Hauptgerichte" });
    await userEvent.click(screen.getByRole("button", { name: "Beilagen" }));
    await userEvent.click(screen.getByRole("button", { name: "Vegetarisch" }));
    await userEvent.click(screen.getByRole("button", { name: "Vegan" }));
    expect(screen.getByText(/keine gerichte passen/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /filter zurücksetzen/i }));
    expect(screen.getByRole("heading", { name: "Desserts" })).toBeInTheDocument();
  });
});

describe("Gallery lightbox", () => {
  it("opens, navigates and closes with the keyboard", async () => {
    renderAt(<Gallery />);
    await userEvent.click(screen.getByRole("button", { name: /foto öffnen: die bar/i }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText(/3\/10/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /nächstes foto/i }));
    expect(screen.getByText(/4\/10/)).toBeInTheDocument();
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByText(/2\/10/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /vorheriges foto/i }));
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
