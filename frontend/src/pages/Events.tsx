import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Check, GlassWater, Loader2, PartyPopper, Utensils } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Reveal } from "../components/Reveal";
import { SelectField, TextArea, TextField } from "../components/Field";
import { useToast } from "../components/toast-context";
import { useSubmit } from "../hooks/useSubmit";
import { rules, validate, type Errors } from "../lib/validation";
import { addDays, toIsoDate } from "../lib/format";

type FormValues = { name: string; email: string; phone: string; event_date: string; guests: string; event_type: string; message: string };
interface EventResult { id: number; message: string }

const SPACES = [
  { icon: Utensils, name: "Der Kaminsaal", capacity: "Bis zu 40 Sitzplätze", text: "Privater Raum mit Blick aufs offene Feuer, eigener Musikanlage und Leinwand." },
  { icon: GlassWater, name: "Chef’s Table", capacity: "Bis zu 12 Gäste", text: "Ein Degustationsmenü in sieben Gängen, das Küchenchef Marco direkt vor Ihnen zubereitet." },
  { icon: PartyPopper, name: "Exklusivbuchung", capacity: "Bis zu 120 Gäste", text: "Das ganze Restaurant samt Bar für Hochzeiten, Firmenfeiern und besondere Anlässe." },
];
const INCLUDED = ["Individuelle Menüs", "Wein- & Cocktailbegleitung", "Persönliche Eventbetreuung", "Technik & Mikrofone", "Flexible Ernährungsoptionen"];
const SCHEMA = {
  name: [rules.name],
  email: [rules.email],
  phone: [rules.phone],
  event_date: [rules.required("Veranstaltungsdatum")],
  guests: [rules.number("Gästezahl", 10, 120)],
  message: [rules.safeText],
};
const EMPTY: FormValues = { name: "", email: "", phone: "", event_date: "", guests: "", event_type: "birthday", message: "" };

export default function Events() {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<Errors<FormValues>>({});
  const { status, result, submit, reset } = useSubmit<object, EventResult>("/api/events");
  const toast = useToast();
  const set = (key: keyof FormValues) => (e: { target: { value: string } }) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(values, SCHEMA);
    setErrors(found);
    if (Object.keys(found).length) {
      toast("error", "Bitte füllen Sie die markierten Felder aus.");
      return;
    }
    const data = await submit({ ...values, guests: Number(values.guests) });
    if (data) toast("success", data.message);
    else toast("error", "Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.");
  }

  return (
    <>
      <PageHeader eyebrow="Feiern & Events" title={<>Gemeinsam <em className="text-ember">am Feuer</em></>} lead="Vom intimen Degustationsabend bis zur Exklusivbuchung – unser Event-Team kümmert sich um jedes Detail." image="/images/dining.jpg" />
      <section className="pb-20">
        <div className="container-x grid gap-6 md:grid-cols-3">
          {SPACES.map(({ icon: Icon, name, capacity, text }, i) => (
            <Reveal key={name} delay={i * 0.08} className="card p-8">
              <Icon className="size-7 text-ember" aria-hidden />
              <h2 className="mt-5 text-2xl text-cream">{name}</h2>
              <p className="text-xs font-semibold tracking-[0.2em] text-flame uppercase">{capacity}</p>
              <p className="mt-4 text-sm leading-relaxed text-smoke">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="pb-24">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <Reveal>
            <img src="/images/bar.jpg" alt="Die Bar, eingedeckt für eine Abendveranstaltung" loading="lazy" className="aspect-[4/3] w-full object-cover" />
            <h2 className="mt-8 text-3xl text-cream">Bei jeder Feier inklusive</h2>
            <ul className="mt-5 space-y-3">
              {INCLUDED.map((x) => <li key={x} className="flex items-center gap-3 text-smoke"><Check className="size-4 text-ember" aria-hidden />{x}</li>)}
            </ul>
          </Reveal>
          <div className="card p-6 sm:p-10">
            {status === "success" && result ? (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="py-10 text-center" role="status">
                <PartyPopper className="mx-auto size-14 text-ember" aria-hidden />
                <h2 className="mt-6 text-4xl text-cream">Anfrage erhalten</h2>
                <p className="lead mx-auto mt-3 max-w-md">{result.message}</p>
                <button type="button" className="btn-ghost mt-8" onClick={() => { reset(); setValues(EMPTY); }}>Weitere Anfrage senden</button>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h2 className="text-3xl text-cream">Planen Sie Ihre Feier</h2>
                  <p className="mt-1 text-sm text-smoke">Erzählen Sie uns kurz von Ihren Plänen – wir senden Ihnen ein Angebot.</p>
                </div>
                <TextField label="Vollständiger Name" name="name" autoComplete="name" value={values.name} onChange={set("name")} error={errors.name} maxLength={80} />
                <TextField label="Telefon" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} error={errors.phone} maxLength={20} />
                <div className="sm:col-span-2">
                  <TextField label="E-Mail" name="email" type="email" autoComplete="email" value={values.email} onChange={set("email")} error={errors.email} maxLength={120} />
                </div>
                <TextField label="Veranstaltungsdatum" name="event_date" type="date" min={toIsoDate(addDays(new Date(), 1))} value={values.event_date} onChange={set("event_date")} error={errors.event_date} />
                <TextField label="Anzahl der Gäste" name="guests" type="number" inputMode="numeric" min={10} max={120} value={values.guests} onChange={set("guests")} error={errors.guests} placeholder="10–120" />
                <div className="sm:col-span-2">
                  <SelectField label="Art der Veranstaltung" name="event_type" value={values.event_type} onChange={set("event_type")}>
                    <option value="birthday">Geburtstag</option>
                    <option value="corporate">Firmenessen</option>
                    <option value="wedding">Hochzeit / Empfang</option>
                    <option value="rehearsal">Polterabend</option>
                    <option value="other">Etwas anderes</option>
                  </SelectField>
                </div>
                <div className="sm:col-span-2">
                  <TextArea label="Weitere Details (optional)" name="message" value={values.message} onChange={set("message")} error={errors.message} maxLength={1000} />
                </div>
                <button type="submit" className="btn-primary sm:col-span-2" disabled={status === "submitting"}>
                  {status === "submitting" ? <><Loader2 className="size-4 animate-spin" aria-hidden /> Wird gesendet …</> : "Anfrage senden"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
