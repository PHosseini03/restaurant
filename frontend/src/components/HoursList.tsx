import { useApi } from "../hooks/useApi";
import { DEMO_HOURS, type HoursInfo } from "../data/demo";
import { formatTime } from "../lib/format";

export function useHours() {
  return useApi<HoursInfo>("/api/hours", DEMO_HOURS).data;
}

export function HoursList({ compact = false }: { compact?: boolean }) {
  const hours = useHours();
  const today = new Date().toLocaleDateString("de-DE", { weekday: "long" });
  return (
    <dl className={`divide-y divide-line ${compact ? "text-sm" : ""}`}>
      {hours.weekly.map((d) => (
        <div key={d.day} className={`flex justify-between gap-4 ${compact ? "py-1.5" : "py-3"} ${d.day === today ? "text-ember" : ""}`}>
          <dt className={d.day === today ? "font-semibold" : "text-smoke"}>{d.day}</dt>
          <dd className={d.open ? "text-cream" : "text-smoke/60 italic"}>
            {d.open && d.close ? `${formatTime(d.open)} – ${formatTime(d.close)} Uhr` : "Ruhetag"}
          </dd>
        </div>
      ))}
    </dl>
  );
}
