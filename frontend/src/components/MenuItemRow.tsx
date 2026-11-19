import type { MenuItem } from "../data/demo";
import { TAGS } from "../data/demo";
import { formatPrice } from "../lib/format";

export function TagBadges({ tags }: { tags: MenuItem["tags"] }) {
  if (!tags.length) return null;
  return (
    <span className="inline-flex gap-1">
      {TAGS.filter((t) => tags.includes(t.id)).map((t) => (
        <abbr key={t.id} title={t.label} className="rounded-sm border border-ember/40 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-flame no-underline">
          {t.short}
        </abbr>
      ))}
    </span>
  );
}

export function MenuItemRow({ item }: { item: MenuItem }) {
  return (
    <article className="group py-5">
      <div className="flex items-baseline gap-3">
        <h3 className="font-display text-xl text-cream transition group-hover:text-flame">{item.name}</h3>
        <span className="hidden flex-1 translate-y-[-4px] border-b border-dotted border-cream/20 sm:block" aria-hidden />
        <span className="ml-auto font-display text-xl text-flame">{formatPrice(item.price)}</span>
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="text-sm text-smoke">{item.description}</p>
        <TagBadges tags={item.tags} />
      </div>
    </article>
  );
}

export function DishCard({ item }: { item: MenuItem }) {
  return (
    <article className="group relative overflow-hidden bg-coal">
      <div className="aspect-[4/5] overflow-hidden">
        <img src={item.image ?? "/images/dining.jpg"} alt={item.name} loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-2xl text-cream">{item.name}</h3>
          <span className="font-display text-xl text-flame">{formatPrice(item.price)}</span>
        </div>
        <p className="mt-2 text-sm text-cream/75">{item.description}</p>
        <div className="mt-3"><TagBadges tags={item.tags} /></div>
      </div>
    </article>
  );
}
