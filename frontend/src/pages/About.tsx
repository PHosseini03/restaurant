import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { Reveal } from "../components/Reveal";
import { SectionTitle } from "../components/Section";

const TEAM = [
  { name: "Marco Ellermann", role: "Küchenchef & Inhaber", bio: "Fünfzehn Jahre am Feuer – von Buenos Aires bis San Sebastián –, bevor er Ember & Oak eröffnete." },
  { name: "Priya Natarajan", role: "Chef-Pâtissière", bio: "Bringt Rauch und Würze ins Dessert. Für ihre Schokoladentorte gibt es eine Warteliste." },
  { name: "Theo Lindqvist", role: "Barchef", bio: "Baut jeden Cocktail um regionale Kräuter und einen Hauch Eichenrauch." },
];

const TIMELINE = [
  { year: "2014", text: "Eröffnung mit 32 Plätzen und einem einzigen Holzgrill in der Glutstraße." },
  { year: "2017", text: "Bau unserer vier Meter langen Feuerstelle – seitdem reifen wir unser Rindfleisch selbst." },
  { year: "2021", text: "Eröffnung des privaten Speisesaals und des Chef’s Table." },
  { year: "2025", text: "Ausgezeichnet als eines der 50 besten Restaurants Norddeutschlands." },
];

export default function About() {
  return (
    <>
      <PageHeader eyebrow="Über uns" title={<>Zehn Jahre <em className="text-ember">offenes Feuer</em></>} lead="Ein Grill im Viertel – gebaut auf abgelagertem Eichenholz, Höfen aus der Region und langen Abenden mit Freunden." image="/images/chef.jpg" />
      <section className="pb-20">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <img src="/images/interior.jpg" alt="Der Gastraum von Ember & Oak" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-display text-3xl leading-snug text-cream italic">„Feuer lehrt Geduld. Eine gute Glut lässt sich nicht hetzen – gutes Essen auch nicht.“</p>
            <p className="mt-4 text-sm font-semibold tracking-[0.2em] text-flame uppercase">Küchenchef Marco Ellermann</p>
            <p className="lead mt-8">Wir kaufen ganze Tiere von drei Familienhöfen im Umkreis von 150 Kilometern, und unser Gemüse kommt von Bauern, die wir beim Namen kennen. Alles, was sich über Feuer garen lässt, garen wir über Feuer.</p>
          </Reveal>
        </div>
      </section>
      <section className="section grain bg-coal">
        <div className="container-x">
          <SectionTitle eyebrow="Meilensteine" title="Unser Weg" />
          <ol className="mx-auto mt-14 max-w-3xl border-l border-ember/40">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.06}>
                <li className="relative pb-10 pl-8 last:pb-0">
                  <span className="absolute top-2 -left-[5px] size-2.5 rounded-full bg-ember" aria-hidden />
                  <p className="font-display text-3xl text-flame">{t.year}</p>
                  <p className="mt-1 text-smoke">{t.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      <section className="section">
        <div className="container-x">
          <SectionTitle eyebrow="Das Team" title="Die Menschen hinter dem Feuer" />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08} className="card p-8">
                <span className="grid size-14 place-items-center rounded-full bg-ember/15 font-display text-xl text-flame">{m.name.split(" ").map((p) => p[0]).join("")}</span>
                <h3 className="mt-5 text-2xl text-cream">{m.name}</h3>
                <p className="text-xs font-semibold tracking-[0.2em] text-flame uppercase">{m.role}</p>
                <p className="mt-4 text-sm leading-relaxed text-smoke">{m.bio}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-14 text-center"><Link to="/reserve" className="btn-primary">Kommen Sie zum Essen vorbei</Link></div>
        </div>
      </section>
    </>
  );
}
