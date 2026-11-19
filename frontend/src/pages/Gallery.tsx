import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Reveal } from "../components/Reveal";

export const PHOTOS = [
  { src: "/images/hero.jpg", alt: "Dry-Aged Steak mit handgeschnittenen Pommes", tall: false },
  { src: "/images/chef.jpg", alt: "Der Küchenchef beim Anrichten unter Kupferlampen", tall: true },
  { src: "/images/bar.jpg", alt: "Die Bar mit beleuchteten Regalen", tall: false },
  { src: "/images/dish-flatbread.jpg", alt: "Flammbrot aus dem Holzofen", tall: true },
  { src: "/images/interior.jpg", alt: "Der Gastraum", tall: false },
  { src: "/images/dish-ribs.jpg", alt: "Eichengeräucherte Short Rib", tall: false },
  { src: "/images/cocktail.jpg", alt: "Smoked Old Fashioned", tall: true },
  { src: "/images/dish-bowl.jpg", alt: "Bowl aus dem Garten", tall: false },
  { src: "/images/dining.jpg", alt: "Gäste beim gemeinsamen Abendessen", tall: false },
  { src: "/images/dish-steak.jpg", alt: "Aufgeschnittenes Steak mit Salat", tall: true },
];

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const count = PHOTOS.length;
  const go = (step: number) => setIndex((i) => (i === null ? i : (i + step + count) % count));

  const isOpen = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Move focus into the lightbox, lock page scroll, and restore focus to the opener on close.
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      opener?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") setIndex((i) => (i === null ? i : (i + 1) % count));
      if (e.key === "ArrowLeft") setIndex((i) => (i === null ? i : (i - 1 + count) % count));
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button"));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, count]);

  return (
    <>
      <PageHeader eyebrow="Galerie" title={<>Rauch, Flammen <em className="text-ember">& gute Gesellschaft</em></>} lead="Ein Blick in unsere Küche, unseren Gastraum und auf die Teller, die jeden Abend aus der Glut kommen." image="/images/bar.jpg" />
      <section className="pb-24">
        <div className="container-x columns-1 gap-4 sm:columns-2 lg:columns-3">
          {PHOTOS.map((p, i) => (
            <Reveal key={p.src} className="mb-4 break-inside-avoid">
              <button type="button" onClick={() => setIndex(i)} className="group block w-full overflow-hidden" aria-label={`Foto öffnen: ${p.alt}`}>
                <img src={p.src} alt={p.alt} loading="lazy" className={`w-full object-cover transition duration-700 group-hover:scale-105 ${p.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`} />
              </button>
            </Reveal>
          ))}
        </div>
      </section>
      <AnimatePresence>
        {index !== null && (
          <motion.div ref={dialogRef} role="dialog" aria-modal="true" aria-label={PHOTOS[index].alt} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 p-4" onClick={() => setIndex(null)}>
            <img src={PHOTOS[index].src} alt={PHOTOS[index].alt} className="max-h-[85vh] max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-smoke">{PHOTOS[index].alt} · {index + 1}/{count}</p>
            <button ref={closeRef} type="button" aria-label="Foto schließen" onClick={() => setIndex(null)} className="absolute top-5 right-5 grid size-11 place-items-center border border-line text-cream"><X className="size-5" /></button>
            <button type="button" aria-label="Vorheriges Foto" onClick={(e) => { e.stopPropagation(); go(-1); }} className="absolute left-3 grid size-11 place-items-center border border-line bg-ink/60 text-cream sm:left-6"><ChevronLeft className="size-5" /></button>
            <button type="button" aria-label="Nächstes Foto" onClick={(e) => { e.stopPropagation(); go(1); }} className="absolute right-3 grid size-11 place-items-center border border-line bg-ink/60 text-cream sm:right-6"><ChevronRight className="size-5" /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
