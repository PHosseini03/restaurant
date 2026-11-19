import type { Category, MenuItem, Tag } from "../data/demo";

export type CategoryFilter = Category | "all";

/** Items in the category (or all) that carry every selected dietary tag. */
export function filterMenu(items: MenuItem[], category: CategoryFilter, tags: Tag[]): MenuItem[] {
  return items.filter((i) => (category === "all" || i.category === category) && tags.every((t) => i.tags.includes(t)));
}
