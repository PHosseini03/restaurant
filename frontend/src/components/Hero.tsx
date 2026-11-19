import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown, Star } from "lucide-react";

const fade = (delay: number) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } });

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden pt-32 pb-16 sm:items-center sm:pb-24">
      <motion.img src="/images/hero.jpg" alt="" fetchPriority="high" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: "easeOut" }} className="absolute inset-0 -z-20 size-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/75 to-ink/20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/10 to-ink/50" />
      <div className="animate-flicker absolute -bottom-40 left-1/4 -z-10 size-[30rem] rounded-full bg-ember/30 blur-[140px]" aria-hidden />
      <div className="container-x">
        <div className="max-w-2xl">
          <motion.span {...fade(0.1)} className="eyebrow">Holzfeuer-Grill · Hamburg</motion.span>
          <motion.h1 {...fade(0.2)} className="mt-6 text-5xl leading-[1.02] text-cream sm:text-7xl lg:text-8xl">
            Über Feuer gegart.<br /> <em className="text-ember">Mit Seele serviert.</em>
          </motion.h1>
          <motion.p {...fade(0.35)} className="lead mt-7 max-w-lg">
            Dry-Aged Steaks, geräucherte Rippchen und saisonale Teller, veredelt von echter Eichenglut. Ein Tisch im Viertel für lange Abende und gute Gesellschaft.
          </motion.p>
          <motion.div {...fade(0.5)} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link to="/reserve" className="btn-primary">Tisch reservieren</Link>
            <Link to="/menu" className="btn-ghost">Zur Speisekarte</Link>
          </motion.div>
          <motion.div {...fade(0.65)} className="mt-12 flex items-center gap-4 text-sm text-smoke">
            <span className="flex gap-0.5" aria-hidden>{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="size-4 fill-flame text-flame" />)}</span>
            <span>„Das beste Steak im ganzen Norden.“ <span className="text-cream/60">· Hamburger Genussmagazin</span></span>
          </motion.div>
        </div>
      </div>
      <a href="#story" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs tracking-[0.3em] text-smoke uppercase sm:flex" aria-label="Weiter zu unserer Geschichte">
        Entdecken <ArrowDown className="size-4 animate-bounce" aria-hidden />
      </a>
    </section>
  );
}
