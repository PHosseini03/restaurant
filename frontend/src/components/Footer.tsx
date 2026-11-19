import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo, NAV_LINKS } from "./Navbar";
import { HoursList } from "./HoursList";
import { CONTACT } from "../data/demo";

export function Footer() {
  return (
    <footer className="border-t border-line bg-coal">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm leading-relaxed text-smoke">Kochen über abgelagertem Eichenholz. Saisonale Teller, Dry-Aged Steaks und eine Bar für lange, entspannte Abende.</p>
        </div>
        <div>
          <h2 className="mb-4 font-sans text-xs font-semibold tracking-[0.25em] text-flame uppercase">Besuch</h2>
          <ul className="space-y-3 text-sm text-smoke">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-ember" aria-hidden />{CONTACT.address}</li>
            <li className="flex items-center gap-2"><Phone className="size-4 text-ember" aria-hidden /><a href={`tel:${CONTACT.phone}`} className="hover:text-cream">{CONTACT.phone}</a></li>
            <li className="flex items-center gap-2"><Mail className="size-4 text-ember" aria-hidden /><a href={`mailto:${CONTACT.email}`} className="break-all hover:text-cream">{CONTACT.email}</a></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 font-sans text-xs font-semibold tracking-[0.25em] text-flame uppercase">Öffnungszeiten</h2>
          <HoursList compact />
        </div>
        <div>
          <h2 className="mb-4 font-sans text-xs font-semibold tracking-[0.25em] text-flame uppercase">Entdecken</h2>
          <ul className="space-y-2 text-sm text-smoke">
            {NAV_LINKS.map((l) => <li key={l.to}><Link to={l.to} className="hover:text-cream">{l.label}</Link></li>)}
            <li><Link to="/reserve" className="hover:text-cream">Reservierung</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="container-x py-5 text-center text-xs text-smoke/70">© {new Date().getFullYear()} Ember &amp; Oak. Demo-Website – alle Namen, Personen und Zahlen sind fiktiv.</p>
      </div>
    </footer>
  );
}
