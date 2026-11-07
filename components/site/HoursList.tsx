import { groupHours, type DayHours } from "@/lib/hours";

export function HoursList({ hours }: { hours: DayHours[] }) {
  return (
    <dl className="divide-y divide-line">
      {groupHours(hours).map((r) => (
        <div key={r.label} className="flex items-baseline justify-between gap-6 py-3">
          <dt className="text-cream">{r.label}</dt>
          <dd className={r.closed ? "text-muted" : "font-semibold text-gold"}>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
