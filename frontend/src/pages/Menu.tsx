import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { MenuItemRow } from "../components/MenuItemRow";
import { Reveal } from "../components/Reveal";
import { useApi } from "../hooks/useApi";
import { CATEGORIES, DEMO_MENU, TAGS, type MenuItem, type Tag } from "../data/demo";
import { filterMenu, type CategoryFilter } from "../lib/menu";

export default function MenuPage() {
  const { data, loading } = useApi<MenuItem[]>("/api/menu", DEMO_MENU);
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [tags, setTags] = useState<Tag[]>([]);
  const visible = useMemo(() => filterMenu(data, category, tags), [data, category, tags]);
  const groups = CATEGORIES.map((c) => ({ ...c, items: visible.filter((i) => i.category === c.id) })).filter((g) => g.items.length);

  const toggleTag = (tag: Tag) => setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  return (
    <>
      <PageHeader eyebrow="Speisekarte" title={<>Saisonal, rauchig, <em className="text-ember">ehrlich</em></>} lead="Unsere Karte folgt den Jahreszeiten und dem Feuer. Wir kaufen regional ein – alle Preise inklusive Mehrwertsteuer." image="/images/dish-steak.jpg" />
      <section className="pb-24">
        <div className="container-x">
          <div className="sticky top-20 z-30 -mx-4 border-y border-line bg-ink/95 px-4 py-4 backdrop-blur sm:mx-0 sm:px-0">
            <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Kategorien">
              {[{ id: "all" as const, label: "Alle" }, ...CATEGORIES].map((c) => (
                <button key={c.id} type="button" onClick={() => setCategory(c.id)} aria-pressed={category === c.id} className={`chip shrink-0 ${category === c.id ? "chip-on" : "chip-off"}`}>
                  {c.label}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Ernährungsfilter">
              <Leaf className="size-4 text-flame" aria-hidden />
              {TAGS.map((t) => (
                <button key={t.id} type="button" onClick={() => toggleTag(t.id)} aria-pressed={tags.includes(t.id)} className={`chip !py-1 text-xs ${tags.includes(t.id) ? "chip-on" : "chip-off"}`}>
                  {t.label}
                </button>
              ))}
              {tags.length > 0 && <button type="button" onClick={() => setTags([])} className="text-xs text-smoke underline hover:text-cream">Zurücksetzen</button>}
            </div>
          </div>

          {loading ? (
            <div className="mt-12 space-y-6" aria-label="Speisekarte wird geladen">{[0, 1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse bg-coal" />)}</div>
          ) : groups.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-2xl text-cream">Keine Gerichte passen zu diesen Filtern.</p>
              <button type="button" className="btn-ghost mt-6" onClick={() => { setTags([]); setCategory("all"); }}>Filter zurücksetzen</button>
            </div>
          ) : (
            <div className="mt-6 grid gap-x-16 lg:grid-cols-2">
              {groups.map((g) => (
                <Reveal key={g.id} className="mt-10">
                  <h2 className="border-b border-ember/50 pb-3 text-3xl text-cream">{g.label}</h2>
                  <div className="divide-y divide-line">{g.items.map((i) => <MenuItemRow key={i.id} item={i} />)}</div>
                </Reveal>
              ))}
            </div>
          )}

          <p className="mt-14 text-center text-xs text-smoke">V vegetarisch · VG vegan · GF glutenfrei. Bitte informieren Sie unser Service-Team über Allergien und Unverträglichkeiten.</p>
          <div className="mt-8 text-center"><Link to="/reserve" className="btn-primary">Tisch reservieren</Link></div>
        </div>
      </section>
    </>
  );
}
