import { IST_OFFSET, TIMEZONE, events, type WeddingEvent } from "@/data/wedding";

/** Absolute start instant of an event. A missing time means start of that day, IST. */
export function startsAt(e: WeddingEvent): number {
  return new Date(`${e.date}T${e.time ?? "00:00"}:00${IST_OFFSET}`).getTime();
}

/** The last instant of the event's calendar day in IST. */
export function endOfDay(e: WeddingEvent): number {
  return new Date(`${e.date}T23:59:59.999${IST_OFFSET}`).getTime();
}

export type CountdownState =
  | { kind: "upcoming"; event: WeddingEvent; target: number }
  | { kind: "today" }
  | { kind: "done" };

/** Pure function of "now": picks the next event from the real schedule. */
export function getCountdownState(now: number): CountdownState {
  const sorted = [...events].sort((a, b) => startsAt(a) - startsAt(b));
  const next = sorted.find((e) => startsAt(e) > now);
  if (next) return { kind: "upcoming", event: next, target: startsAt(next) };
  const last = sorted[sorted.length - 1];
  return now <= endOfDay(last) ? { kind: "today" } : { kind: "done" };
}

export function splitDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: TIMEZONE, ...opts });

/** Date parts rendered in IST so server and client always agree. */
export function dateParts(e: WeddingEvent) {
  // Noon avoids any edge effects around midnight.
  const d = new Date(`${e.date}T12:00:00${IST_OFFSET}`);
  const weekday = fmt({ weekday: "long" }).format(d);
  const day = fmt({ day: "numeric" }).format(d);
  const month = fmt({ month: "long" }).format(d);
  const year = fmt({ year: "numeric" }).format(d);
  // Assembled from single-field formats: combined Intl patterns can differ between Node and browsers.
  return {
    weekday,
    day,
    month,
    year,
    full: `${weekday}, ${day} ${month} ${year}`,
    short: `${weekday.slice(0, 3)} ${day} ${month.slice(0, 3)}`,
  };
}

export function timeLabel(e: WeddingEvent): string | null {
  if (!e.time) return null;
  const [h, m] = e.time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}${e.timeNote ? ` ${e.timeNote}` : ""}`;
}

export function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
