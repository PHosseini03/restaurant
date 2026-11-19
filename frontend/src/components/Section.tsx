import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionTitle({ eyebrow, title, lead, center = true }: { eyebrow: string; title: ReactNode; lead?: string; center?: boolean }) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className={`eyebrow ${center ? "justify-center" : ""}`}>{eyebrow}</span>
      <h2 className="heading mt-5">{title}</h2>
      {lead && <p className="lead mt-5">{lead}</p>}
    </Reveal>
  );
}
