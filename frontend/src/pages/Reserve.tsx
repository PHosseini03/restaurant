import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarCheck, Loader2, Users } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { SelectField, TextArea, TextField } from "../components/Field";
import { HoursList } from "../components/HoursList";
import { useToast } from "../components/toast-context";
import { useSubmit } from "../hooks/useSubmit";
import { useAvailability } from "../hooks/useAvailability";
import { rules, validate, type Errors } from "../lib/validation";
import { addDays, formatTime, toIsoDate } from "../lib/format";
import { MAX_DAYS_AHEAD, parseIsoDate } from "../lib/slots";
import { CONTACT } from "../data/demo";

type FormValues = { name: string; email: string; phone: string; date: string; time: string; party_size: string; occasion: string; notes: string };
interface ReservationResult { id: number; message: string; date: string; time: string; party_size: number }

const SCHEMA = {
  name: [rules.name],
  email: [rules.email],
  phone: [rules.phone],
  date: [rules.required("Datum")],
  time: [rules.required("Uhrzeit")],
  party_size: [rules.number("Personenzahl", 1, 12)],
  notes: [rules.safeText],
};
const PARTY_SIZES = Array.from({ length: 12 }, (_, i) => i + 1);
const OCCASIONS = [["none", "Kein besonderer Anlass"], ["birthday", "Geburtstag"], ["anniversary", "Jahrestag"], ["date-night", "Romantischer Abend"], ["business", "Geschäftsessen"]];

function SlotPicker({ date, value, onChange, error }: { date: string; value: string; onChange: (t: string) => void; error?: string }) {
  const { availability, loading } = useAvailability(date);
  return (
    <fieldset className="sm:col-span-2">
      <legend className="field-label">Uhrzeit</legend>
      {!date ? (
        <p className="mt-2 text-sm text-smoke">Wählen Sie ein Datum, um die freien Uhrzeiten zu sehen.</p>
      ) : loading || !availability ? (
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5" aria-label="Uhrzeiten werden geladen">{[0, 1, 2, 3, 4].map((i) => <span key={i} className="h-10 animate-pulse bg-coal" />)}</div>
      ) : availability.closed ? (
        <p className="mt-2 text-sm text-flame">Montags haben wir Ruhetag. Bitte wählen Sie einen anderen Tag.</p>
      ) : (
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {availability.slots.map((s) => (
            <button key={s.time} type="button" disabled={!s.available} onClick={() => onChange(s.time)} aria-pressed={value === s.time} className={`border px-2 py-2.5 text-sm transition disabled:cursor-not-allowed disabled:line-through disabled:opacity-40 ${value === s.time ? "border-ember bg-ember text-ink" : "border-line text-cream hover:border-ember"}`}>
              {formatTime(s.time)}
            </button>
          ))}
        </div>
      )}
      {error && <p className="field-error mt-1.5" role="alert">{error}</p>}
    </fieldset>
  );
}

function Confirmation({ result, onReset }: { result: ReservationResult; onReset: () => void }) {
  const when = parseIsoDate(result.date).toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="py-8 text-center" role="status">
      <CalendarCheck className="mx-auto size-14 text-ember" aria-hidden />
      <h2 className="mt-6 text-4xl text-cream">Tisch bestätigt</h2>
      <p className="lead mx-auto mt-3 max-w-md">{result.message}</p>
      <div className="mx-auto mt-8 grid max-w-md grid-cols-3 border border-line text-sm">
        <div className="p-4"><p className="text-smoke">Datum</p><p className="mt-1 text-cream">{when}</p></div>
        <div className="border-x border-line p-4"><p className="text-smoke">Uhrzeit</p><p className="mt-1 text-cream">{formatTime(result.time)} Uhr</p></div>
        <div className="p-4"><p className="text-smoke">Personen</p><p className="mt-1 text-cream">{result.party_size}</p></div>
      </div>
      <p className="mt-4 text-xs text-smoke">Bestätigungsnr. EO-{String(result.id).padStart(5, "0")}</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/menu" className="btn-ghost">Zur Speisekarte</Link>
        <button type="button" className="btn-primary" onClick={onReset}>Weitere Reservierung</button>
      </div>
    </motion.div>
  );
}

const EMPTY: FormValues = { name: "", email: "", phone: "", date: "", time: "", party_size: "2", occasion: "none", notes: "" };

export default function Reserve() {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<Errors<FormValues>>({});
  const { status, result, submit, reset } = useSubmit<object, ReservationResult>("/api/reservations");
  const toast = useToast();
  const today = new Date();

  const update = (key: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value, ...(key === "date" ? { time: "" } : {}) }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };
  const set = (key: keyof FormValues) => (e: { target: { value: string } }) => update(key, e.target.value);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(values, SCHEMA);
    if (found.time && values.date) found.time = "Bitte wählen Sie eine Uhrzeit";
    setErrors(found);
    if (Object.keys(found).length) {
      toast("error", "Bitte füllen Sie die markierten Felder aus.");
      return;
    }
    const data = await submit({ ...values, party_size: Number(values.party_size) });
    if (data) toast("success", data.message);
    else toast("error", "Ihre Reservierung konnte nicht abgeschlossen werden. Bitte wählen Sie eine andere Zeit oder rufen Sie uns an.");
  }

  function startOver() {
    reset();
    setValues(EMPTY);
  }

  return (
    <>
      <PageHeader eyebrow="Reservierung" title={<>Ihr Platz <em className="text-ember">am Feuer</em></>} lead="Reservieren Sie bis zu 90 Tage im Voraus. Für Gruppen ab 13 Personen nutzen Sie bitte unser Formular für Feiern & Events." image="/images/interior.jpg" />
      <section className="pb-24">
        <div className="container-x grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="card p-6 sm:p-10">
            {status === "success" && result ? (
              <Confirmation result={result} onReset={startOver} />
            ) : (
              <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <h2 className="text-3xl text-cream">Tisch reservieren</h2>
                  <p className="mt-1 text-sm text-smoke">Wir halten Ihren Tisch 15 Minuten über die reservierte Zeit hinaus für Sie frei.</p>
                </div>
                <TextField label="Datum" name="date" type="date" min={toIsoDate(today)} max={toIsoDate(addDays(today, MAX_DAYS_AHEAD))} value={values.date} onChange={set("date")} error={errors.date} />
                <SelectField label="Personen" name="party_size" value={values.party_size} onChange={set("party_size")} error={errors.party_size}>
                  {PARTY_SIZES.map((n) => <option key={n} value={n}>{n} {n === 1 ? "Person" : "Personen"}</option>)}
                </SelectField>
                <SlotPicker date={values.date} value={values.time} onChange={(t) => update("time", t)} error={errors.time} />
                <TextField label="Vollständiger Name" name="name" autoComplete="name" value={values.name} onChange={set("name")} error={errors.name} maxLength={80} placeholder="Anna Schneider" />
                <TextField label="Telefon" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} error={errors.phone} maxLength={20} placeholder="Ihre Telefonnummer" />
                <div className="sm:col-span-2">
                  <TextField label="E-Mail" name="email" type="email" autoComplete="email" value={values.email} onChange={set("email")} error={errors.email} maxLength={120} placeholder="ihre@email.example" />
                </div>
                <div className="sm:col-span-2">
                  <SelectField label="Anlass" name="occasion" value={values.occasion} onChange={set("occasion")}>
                    {OCCASIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </SelectField>
                </div>
                <div className="sm:col-span-2">
                  <TextArea label="Wünsche (optional)" name="notes" value={values.notes} onChange={set("notes")} error={errors.notes} maxLength={500} placeholder="Allergien, Kinderstuhl, Fensterplatz …" />
                </div>
                <button type="submit" className="btn-primary sm:col-span-2" disabled={status === "submitting"}>
                  {status === "submitting" ? <><Loader2 className="size-4 animate-spin" aria-hidden /> Wird reserviert …</> : "Reservierung bestätigen"}
                </button>
                <p className="text-center text-xs text-smoke sm:col-span-2">Demo-Formular: Reservierungen werden nur in der lokalen Demo-Datenbank gespeichert.</p>
              </form>
            )}
          </div>
          <aside className="space-y-6">
            <div className="card p-6 sm:p-8">
              <h2 className="text-2xl text-cream">Öffnungszeiten</h2>
              <div className="mt-3"><HoursList compact /></div>
            </div>
            <div className="card flex items-start gap-4 p-6 sm:p-8">
              <Users className="mt-1 size-6 shrink-0 text-ember" aria-hidden />
              <div>
                <h2 className="text-xl text-cream">Größere Gruppe?</h2>
                <p className="mt-2 text-sm text-smoke">In unseren Eventräumen finden bis zu 120 Gäste Platz.</p>
                <Link to="/events" className="mt-3 inline-block text-sm font-semibold text-flame hover:text-cream">Feier planen →</Link>
              </div>
            </div>
            <p className="text-center text-sm text-smoke">Lieber telefonisch? <a href={`tel:${CONTACT.phone}`} className="text-flame hover:text-cream">{CONTACT.phone}</a></p>
          </aside>
        </div>
      </section>
    </>
  );
}
