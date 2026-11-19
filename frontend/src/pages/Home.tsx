import { Link } from "react-router-dom";
import { ArrowRight, Clock, Flame, MapPin, Phone, Quote, Wine } from "lucide-react";
import { Hero } from "../components/Hero";
import { Reveal } from "../components/Reveal";
import { SectionTitle } from "../components/Section";
import { DishCard, MenuItemRow } from "../components/MenuItemRow";
import { HoursList } from "../components/HoursList";
import { useApi } from "../hooks/useApi";
import { CONTACT, DEMO_MENU, DEMO_SPECIALS, type MenuItem } from "../data/demo";

const PILLARS = [
  { icon: Flame, title: "Echtes Eichenfeuer", text: "Jeder Teller kommt über unsere vier Meter lange Feuerstelle, befeuert mit abgelagertem Eichenholz." },
  { icon: Clock, title: "45 Tage Dry-Aged", text: "Im eigenen Haus gereiftes Rindfleisch – mit tiefem, nussigem Aroma und perfekter Kruste." },
  { icon: Wine, title: "Craft-Bar", text: "Geräucherte Cocktails, Naturweine und eine alkoholfreie Karte, auf die wir stolz sind." },
];

const REVIEWS = [
  { quote: "Jedes Gericht trägt einen Hauch von Rauch. Allein die Short Rib ist die Reise wert.", source: "Hamburger Genussmagazin" },
  { quote: "Herzlich, lebendig und unkompliziert. Ein Ort, an dem man schnell Stammgast wird.", source: "Tafelrunde Nord" },
  { quote: "Eine Meisterklasse im Kochen über offenem Feuer. Unbedingt den Chef’s Table buchen.", source: "Feinschmecker Guide Nord" },
];

const GALLERY = ["/images/interior.jpg", "/images/dish-flatbread.jpg", "/images/bar.jpg", "/images/dish-bowl.jpg"];

export default function Home() {
  const { data: specials } = useApi<MenuItem[]>("/api/specials", DEMO_SPECIALS);
  const { data: menu } = useApi<MenuItem[]>("/api/menu?category=starters", DEMO_MENU.filter((m) => m.category === "starters"));

  return (
    <>
      <Hero />

      <section id="story" className="section scroll-mt-20">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <img src="/images/chef.jpg" alt="Der Küchenchef richtet ein Gericht unter Kupferlampen an" loading="lazy" className="aspect-[4/5] w-full object-cover" />
            <div className="absolute -right-3 -bottom-6 bg-ember px-6 py-5 text-ink xl:-right-8">
              <p className="font-display text-4xl font-semibold">Seit 2014</p>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase">Glutstraße</p>
            </div>
          </Reveal>
          <div>
            <SectionTitle center={false} eyebrow="Unsere Geschichte" title={<>Feuer ist unsere <em className="text-ember">wichtigste Zutat</em></>} lead="Küchenchef Marco Ellermann eröffnete Ember & Oak mit einer einfachen Idee: ehrliche, regionale Küche über echtem Feuer. Zehn Jahre später brennt die Glut noch immer vom ersten bis zum letzten Gast." />
            <div className="mt-10 grid gap-6 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {PILLARS.map(({ icon: Icon, title, text }, i) => (
                <Reveal key={title} delay={i * 0.08}>
                  <Icon className="size-6 text-ember" aria-hidden />
                  <h3 className="mt-3 text-xl text-cream">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-smoke">{text}</p>
                </Reveal>
              ))}
            </div>
            <Link to="/about" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold tracking-wider text-flame uppercase hover:text-cream">Lernen Sie das Team kennen <ArrowRight className="size-4" aria-hidden /></Link>
          </div>
        </div>
      </section>

      <section className="section grain bg-coal">
        <div className="container-x">
          <SectionTitle eyebrow="Empfehlungen des Küchenchefs" title="Heute frisch aus der Glut" lead="Unsere beliebtesten Gerichte – frisch für Sie über Eichenglut zubereitet." />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {specials.map((item, i) => <Reveal key={item.id} delay={i * 0.08}><DishCard item={item} /></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <SectionTitle center={false} eyebrow="Ein Vorgeschmack" title="Beginnen Sie mit etwas Rauchigem" />
            <Reveal delay={0.1}>
              <img src="/images/dish-toast.jpg" alt="Gegrillter Avocado-Toast mit wachsweichem Ei" loading="lazy" className="mt-10 aspect-[4/3] w-full object-cover" />
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="divide-y divide-line">
              {menu.map((item) => <MenuItemRow key={item.id} item={item} />)}
            </div>
            <Link to="/menu" className="btn-ghost mt-8">Ganze Speisekarte ansehen <ArrowRight className="size-4" aria-hidden /></Link>
          </Reveal>
        </div>
      </section>

      <section className="relative isolate overflow-hidden py-24 sm:py-32">
        <img src="/images/dining.jpg" alt="" loading="lazy" className="absolute inset-0 -z-20 size-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-ink/85" />
        <div className="container-x">
          <div className="grid gap-10 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.source} delay={i * 0.1}>
                <figure>
                  <Quote className="size-8 text-ember" aria-hidden />
                  <blockquote className="mt-4 font-display text-2xl leading-snug text-cream italic">{r.quote}</blockquote>
                  <figcaption className="mt-4 text-xs font-semibold tracking-[0.2em] text-flame uppercase">{r.source}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section pb-0">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionTitle center={false} eyebrow="Galerie" title="Der Raum, das Feuer, die Teller" />
            <Link to="/gallery" className="btn-ghost shrink-0">Zur Galerie</Link>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4">
          {GALLERY.map((src) => <img key={src} src={src} alt="" loading="lazy" className="aspect-square w-full object-cover" />)}
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="eyebrow">Besuchen Sie uns</span>
            <h2 className="heading mt-5">Ihr Platz am Feuer wartet</h2>
            <ul className="mt-8 space-y-4 text-smoke">
              <li className="flex items-center gap-3"><MapPin className="size-5 text-ember" aria-hidden />{CONTACT.address}</li>
              <li className="flex items-center gap-3"><Phone className="size-5 text-ember" aria-hidden /><a href={`tel:${CONTACT.phone}`} className="hover:text-cream">{CONTACT.phone}</a></li>
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link to="/reserve" className="btn-primary">Tisch reservieren</Link>
              <Link to="/events" className="btn-ghost">Feier planen</Link>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="card p-6 sm:p-10">
            <h3 className="text-2xl text-cream">Öffnungszeiten</h3>
            <div className="mt-4"><HoursList /></div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
