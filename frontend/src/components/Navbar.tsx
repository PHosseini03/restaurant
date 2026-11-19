import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Menu, X } from "lucide-react";

export const NAV_LINKS = [
  { to: "/", label: "Start" },
  { to: "/menu", label: "Speisekarte" },
  { to: "/about", label: "Über uns" },
  { to: "/gallery", label: "Galerie" },
  { to: "/events", label: "Feiern & Events" },
];

const SCROLL_THRESHOLD = 24;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 text-cream" aria-label="Ember & Oak Startseite">
      <Flame className="size-6 text-ember" aria-hidden />
      <span className="font-display text-2xl leading-none font-semibold tracking-tight">
        Ember <span className="text-ember italic">&amp;</span> Oak
      </span>
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || open ? "border-b border-line bg-ink/95 backdrop-blur" : "bg-gradient-to-b from-ink/80 to-transparent"}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:bg-ember focus:px-4 focus:py-2 focus:text-ink">
        Zum Inhalt springen
      </a>
      <nav className="container-x flex h-20 items-center justify-between" aria-label="Hauptnavigation">
        <Logo />
        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === "/"} className={({ isActive }) => `relative py-2 text-sm tracking-wide transition ${isActive ? "text-ember" : "text-cream/80 hover:text-cream"}`}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <Link to="/reserve" className="btn-primary hidden !px-5 !py-2.5 lg:inline-flex">Tisch reservieren</Link>
        <button type="button" className="grid size-11 place-items-center border border-line text-cream lg:hidden" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Menü schließen" : "Menü öffnen"}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-line lg:hidden">
            <ul className="container-x flex flex-col py-4">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.to === "/"} className={({ isActive }) => `block border-b border-line py-4 font-display text-2xl ${isActive ? "text-ember" : "text-cream"}`}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
              <li className="pt-5">
                <Link to="/reserve" className="btn-primary w-full">Tisch reservieren</Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
