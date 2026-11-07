// Store hours helpers. Shared by server and client code (no server-only imports here).

export const TIME_ZONE = "America/New_York"; // North Carolina (Eastern time)

export type DayHours = { closed: boolean; open: string; close: string }; // "HH:MM" 24h
export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DEFAULT_DAY: DayHours = { closed: true, open: "11:00", close: "17:00" };

export function parseHours(json: string | null | undefined): DayHours[] {
  try {
    const raw = JSON.parse(json || "[]");
    if (Array.isArray(raw) && raw.length === 7) {
      return raw.map((d) => ({
        closed: Boolean(d?.closed),
        open: typeof d?.open === "string" ? d.open : DEFAULT_DAY.open,
        close: typeof d?.close === "string" ? d.close : DEFAULT_DAY.close,
      }));
    }
  } catch {
    /* fall through */
  }
  return Array.from({ length: 7 }, () => ({ ...DEFAULT_DAY }));
}

/** "22:00" -> "10pm", "11:30" -> "11:30am" */
export function formatTime(t: string): string {
  const [hStr, mStr = "00"] = t.split(":");
  const h = Number(hStr);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return mStr === "00" ? `${h12}${suffix}` : `${h12}:${mStr}${suffix}`;
}

export type HoursRow = { label: string; value: string; closed: boolean };

/** Groups consecutive days with identical hours, starting the week on Monday. */
export function groupHours(hours: DayHours[]): HoursRow[] {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const key = (d: DayHours) => (d.closed ? "closed" : `${d.open}-${d.close}`);
  const rows: { days: number[]; d: DayHours }[] = [];
  for (const i of order) {
    const last = rows[rows.length - 1];
    if (last && key(last.d) === key(hours[i])) last.days.push(i);
    else rows.push({ days: [i], d: hours[i] });
  }
  return rows.map(({ days, d }) => ({
    label: days.length === 1 ? DAY_NAMES[days[0]] : `${DAY_NAMES[days[0]]} – ${DAY_NAMES[days[days.length - 1]]}`,
    value: d.closed ? "Closed" : `${formatTime(d.open)} – ${formatTime(d.close)}`,
    closed: d.closed,
  }));
}

function toMinutes(t: string) {
  const [h, m = "0"] = t.split(":");
  return Number(h) * 60 + Number(m);
}

/** Current open/closed status in North Carolina time. Call on the client only. */
export function openStatus(hours: DayHours[], now = new Date()): { open: boolean; text: string } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  const today = hours[day];

  if (!today.closed && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    return { open: true, text: `Open now · until ${formatTime(today.close)}` };
  }
  if (!today.closed && minutes < toMinutes(today.open)) {
    return { open: false, text: `Closed · opens today at ${formatTime(today.open)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    if (!hours[d].closed) {
      const when = i === 1 ? "tomorrow" : DAY_NAMES[d];
      return { open: false, text: `Closed · opens ${when} at ${formatTime(hours[d].open)}` };
    }
  }
  return { open: false, text: "Closed" };
}
