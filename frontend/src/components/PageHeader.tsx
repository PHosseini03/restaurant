import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface Props {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  image?: string;
}

export function PageHeader({ eyebrow, title, lead, image }: Props) {
  return (
    <section className="relative isolate overflow-hidden pt-40 pb-20 sm:pt-48 sm:pb-24">
      {image && <img src={image} alt="" className="absolute inset-0 -z-20 size-full object-cover" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/80 via-ink/75 to-ink" />
      <div className="container-x max-w-3xl text-center">
        <Reveal>
          <span className="eyebrow justify-center">{eyebrow}</span>
          <h1 className="mt-6 text-5xl text-cream sm:text-6xl lg:text-7xl">{title}</h1>
          <p className="lead mx-auto mt-6 max-w-2xl">{lead}</p>
        </Reveal>
      </div>
    </section>
  );
}
