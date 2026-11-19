import { Link } from "react-router-dom";
import { Flame } from "lucide-react";

export default function NotFound() {
  return (
    <section className="grid min-h-[80vh] place-items-center px-4 pt-24 text-center">
      <div>
        <Flame className="mx-auto size-14 text-ember" aria-hidden />
        <h1 className="mt-6 text-6xl text-cream">404</h1>
        <p className="lead mt-3">Diese Seite ist in Rauch aufgegangen. Wir bringen Sie zurück an den Tisch.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="btn-primary">Zur Startseite</Link>
          <Link to="/menu" className="btn-ghost">Zur Speisekarte</Link>
        </div>
      </div>
    </section>
  );
}
