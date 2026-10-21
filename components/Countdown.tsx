"use client";

import { useEffect, useState } from "react";
import { copy } from "@/data/wedding";
import { dateParts, getCountdownState, splitDuration, timeLabel } from "@/lib/events";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Counts down to the next event in the real schedule (IST). `now` is null on the
 * server and first client render, so markup is identical and hydration is safe.
 */
export default function Countdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const state = now === null ? null : getCountdownState(now);

  if (state && state.kind !== "upcoming") {
    return (
      <p className="count-message" role="status">
        {state.kind === "today" ? copy.countdownToday : copy.countdownDone}
      </p>
    );
  }

  const d = state ? splitDuration(state.target - (now as number)) : null;
  const units = [
    { label: "Days", value: d?.days },
    { label: "Hours", value: d?.hours },
    { label: "Minutes", value: d?.minutes },
    { label: "Seconds", value: d?.seconds },
  ];

  const ev = state?.event;
  const parts = ev ? dateParts(ev) : null;
  const time = ev ? timeLabel(ev) : null;

  return (
    <div className="count" role="timer" aria-live="off">
      <p className="label count-next">Counting down to</p>
      <h3 className="count-event">{ev ? ev.name : " "}</h3>
      <p className="count-date">{parts ? `${parts.full}${time ? ` · ${time}` : ""}` : " "}</p>
      <div className="count-grid">
        {units.map((u) => (
          <div className="count-tile" key={u.label}>
            <span className="count-num" suppressHydrationWarning>
              {u.value === undefined ? "––" : pad(u.value)}
            </span>
            <span className="count-label">{u.label}</span>
          </div>
        ))}
      </div>
      <p className="count-tz">Indian Standard Time</p>
    </div>
  );
}
