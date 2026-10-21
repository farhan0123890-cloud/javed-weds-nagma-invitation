/**
 * Single source of truth for every piece of wedding information.
 * Edit text, dates, times and venues here — no component needs to change.
 *
 * Times are interpreted as Asia/Kolkata (IST, UTC+05:30, no daylight saving).
 */

export const TIMEZONE = "Asia/Kolkata";
/** IST has a fixed offset all year, so an explicit offset is exact. */
export const IST_OFFSET = "+05:30";

export const couple = {
  groom: { name: "JAVED AHMED", parents: "Son of Mrs. & Mr. Jamil Ahmed" },
  // Transcribed as "Nagma" from the handwritten invitation. Change here if the
  // family confirms a different spelling (e.g. "NAGMA") — it updates everywhere.
  bride: { name: "NAGMA", parents: "Daughter of Mrs. & Mr. Nawab" },
  separator: "Weds",
};

export const religious = {
  bismillah: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  translation: ["In the name of Allah,", "the Most Beneficent, the Most Merciful."],
  invitation:
    "With the blessings of Allah, we cordially invite you to celebrate the wedding of our beloved children.",
};

export type Venue = {
  id: string;
  name: string;
  /** Lines shown to guests. */
  lines: string[];
  /** Query string for the Google Maps search link. */
  mapsQuery: string;
  /** Road label drawn on the decorative map illustration. */
  roadLabel: string;
};

export const venues: Record<string, Venue> = {
  klFarmHouse: {
    id: "klFarmHouse",
    name: "K.L. Farm House",
    lines: [
      "Karawal Nagar, Vijay Vihar,",
      "Delhi–Dehradun Highway,",
      "Loni, Ghaziabad,",
      "Uttar Pradesh — 201102",
    ],
    mapsQuery:
      "K.L. Farm House, Karawal Nagar, Vijay Vihar, Delhi-Dehradun Highway, Loni, Ghaziabad, Uttar Pradesh 201102",
    roadLabel: "Delhi–Dehradun Hwy",
  },
  diamondVatika: {
    id: "diamondVatika",
    name: "Diamond Vatika",
    lines: ["Nathu Pura Road,", "Burari, Delhi — 110084"],
    mapsQuery: "Diamond Vatika, Nathu Pura Road, Burari, Delhi 110084",
    roadLabel: "Nathu Pura Road",
  },
};

export type WeddingEvent = {
  id: "manda" | "nikkah" | "reception";
  name: string;
  /** Calendar date in IST, YYYY-MM-DD. */
  date: string;
  /** 24h HH:mm in IST, or null when no time has been supplied. */
  time: string | null;
  /** Shown after the time, e.g. "onwards". */
  timeNote?: string;
  venueId: keyof typeof venues | null;
  /** Shown when no venue has been supplied. */
  venueFallback?: string;
  motif: "sprig" | "crescent" | "rosette";
};

export const events: WeddingEvent[] = [
  {
    id: "manda",
    name: "Manda",
    date: "2026-12-05",
    time: "17:00",
    timeNote: "onwards",
    venueId: null,
    venueFallback: "Venue details to follow",
    motif: "sprig",
  },
  {
    id: "nikkah",
    name: "Nikkah Ceremony",
    date: "2026-12-06",
    time: "18:00",
    timeNote: "onwards",
    venueId: "klFarmHouse",
    motif: "crescent",
  },
  {
    id: "reception",
    name: "Reception",
    date: "2026-12-07",
    time: null, // No reception time has been supplied — none is invented.
    venueId: "diamondVatika",
    motif: "rosette",
  },
];

export const copy = {
  celebrationsTitle: "Three Celebrations, One Beautiful Beginning",
  closing: "Your presence and blessings will make our celebrations even more special.",
  countdownDone: "Thank you for celebrating with us.",
  countdownToday: "Our celebrations are underway.",
};
