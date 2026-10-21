"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import { copy, couple, events, religious, venues, type WeddingEvent } from "@/data/wedding";
import { dateParts, mapsUrl, timeLabel } from "@/lib/events";
import Countdown from "./Countdown";
import { Divider, FloralSprig, Motif } from "./Floral";
import MapArt from "./MapArt";
import { MaskLine, Reveal, Rule } from "./Reveal";

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
};

/* ── A · Invitation introduction ─────────────────────────────────────────── */
export function IntroSlide() {
  return (
    <section className="slide" id="invitation" aria-labelledby="intro-h">
      <div className="slide-inner">
        <Reveal delay={0.1}>
          <h2 id="intro-h" className="sr-only">
            Invitation
          </h2>
          <p className="bismillah" lang="ar" dir="rtl">
            {religious.bismillah}
          </p>
        </Reveal>
        <Reveal delay={0.35}>
          <p className="translation">
            “{religious.translation[0]}
            <br />
            {religious.translation[1]}”
          </p>
        </Reveal>
        <Rule delay={0.6} className="rule-lg" />
        <Reveal delay={0.8}>
          <p className="lede">{religious.invitation}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── B · The couple ──────────────────────────────────────────────────────── */
export function CoupleSlide() {
  return (
    <section className="slide" id="couple" aria-labelledby="couple-h">
      <div className="slide-inner">
        <Reveal>
          <p className="label">The Wedding Of</p>
        </Reveal>
        <Rule delay={0.2} />
        <h2 id="couple-h" className="names">
          <MaskLine delay={0.3} className="name">
            {couple.groom.name}
          </MaskLine>
          <MaskLine delay={0.55} className="weds">
            {couple.separator}
          </MaskLine>
          <MaskLine delay={0.8} className="name">
            {couple.bride.name}
          </MaskLine>
        </h2>
        <Reveal delay={1.1}>
          <Divider className="divider-mid" />
        </Reveal>
        <Reveal delay={1.25} className="parents">
          <p>
            <span className="label label-sm">Groom</span>
            {couple.groom.parents}
          </p>
          <p>
            <span className="label label-sm">Bride</span>
            {couple.bride.parents}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── C · Celebrations ────────────────────────────────────────────────────── */
export function CelebrationsSlide() {
  return (
    <section className="slide" id="celebrations" aria-labelledby="cel-h">
      <div className="slide-inner">
        <Reveal>
          <p className="label">The Celebrations</p>
        </Reveal>
        <Rule delay={0.2} />
        <h2 id="cel-h" className="heading">
          <MaskLine delay={0.3}>Three Celebrations,</MaskLine>
          <MaskLine delay={0.5}>One Beautiful</MaskLine>
          <MaskLine delay={0.7}>Beginning</MaskLine>
        </h2>
        <Reveal delay={0.95}>
          <ol className="timeline">
            {events.map((e) => {
              const p = dateParts(e);
              return (
                <li key={e.id}>
                  <button type="button" className="timeline-btn" onClick={() => scrollToId(`event-${e.id}`)}>
                    <span className="timeline-name">{e.name}</span>
                    <span className="timeline-date">{p.short}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

export function EventSlide({ event, index }: { event: WeddingEvent; index: number }) {
  const p = dateParts(event);
  const time = timeLabel(event);
  const venue = event.venueId ? venues[event.venueId] : null;
  return (
    <section className={`slide event event-${event.id}`} id={`event-${event.id}`} aria-labelledby={`${event.id}-h`}>
      <div className="slide-inner">
        <Reveal>
          <p className="label">Celebration {["I", "II", "III"][index]}</p>
        </Reveal>

        <Reveal delay={0.15} className="badge-wrap">
          <div className="badge" role="group" aria-label={p.full}>
            <span className="badge-weekday">{p.weekday}</span>
            <span className="badge-day">{p.day}</span>
            <span className="badge-month">{p.month}</span>
            <span className="badge-year">{p.year}</span>
          </div>
        </Reveal>

        <h2 id={`${event.id}-h`} className="event-name">
          <MaskLine delay={0.35}>{event.name}</MaskLine>
        </h2>

        <Reveal delay={0.55}>
          <Motif kind={event.motif} className="motif-lg" />
        </Reveal>

        {time && (
          <Reveal delay={0.7}>
            <p className="pill">{time}</p>
          </Reveal>
        )}

        <Reveal delay={0.85} className="event-venue">
          {venue ? (
            <>
              <p className="venue-name">{venue.name}</p>
              <p className="venue-lines">{venue.lines.join(" ")}</p>
              <button type="button" className="text-link" onClick={() => scrollToId(`venue-${venue.id}`)}>
                Venue details
              </button>
            </>
          ) : (
            <p className="venue-fallback">{event.venueFallback}</p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ── D · Venues ──────────────────────────────────────────────────────────── */
export function VenueSlide({ venueId, eventName, variant }: { venueId: keyof typeof venues; eventName: string; variant: 0 | 1 }) {
  const v = venues[venueId];
  return (
    <section className="slide venue" id={`venue-${v.id}`} aria-labelledby={`${v.id}-h`}>
      <div className="slide-inner">
        <Reveal>
          <p className="label">{eventName} Venue</p>
        </Reveal>
        <Reveal delay={0.15} className="map-wrap">
          <MapArt roadLabel={v.roadLabel} variant={variant} />
        </Reveal>
        <h2 id={`${v.id}-h`} className="venue-title">
          <MaskLine delay={0.3}>{v.name}</MaskLine>
        </h2>
        <Reveal delay={0.5}>
          <address className="address">
            {v.lines.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </address>
        </Reveal>
        <Reveal delay={0.7}>
          <a className="btn" href={mapsUrl(v.mapsQuery)} target="_blank" rel="noopener noreferrer">
            <MapPin size={15} strokeWidth={1.5} aria-hidden="true" />
            <span>Get Directions</span>
            <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
            <span className="sr-only"> (opens Google Maps in a new tab)</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ── E · Countdown ───────────────────────────────────────────────────────── */
export function CountdownSlide() {
  return (
    <section className="slide" id="countdown" aria-labelledby="count-h">
      <div className="slide-inner">
        <h2 id="count-h" className="sr-only">
          Countdown
        </h2>
        <Reveal y={14}>
          <Countdown />
        </Reveal>
      </div>
    </section>
  );
}

/* ── F · Closing ─────────────────────────────────────────────────────────── */
export function ClosingSlide() {
  return (
    <section className="slide closing" id="closing" aria-labelledby="close-h">
      <div className="slide-inner">
        <Reveal>
          <FloralSprig id="cl-sprig" className="sprig" />
        </Reveal>
        <h2 id="close-h" className="closing-text">
          <MaskLine delay={0.2}>{copy.closing}</MaskLine>
        </h2>
        <Rule delay={0.6} />
        <Reveal delay={0.8}>
          <p className="closing-names">
            {couple.groom.name} <span className="amp">&amp;</span> {couple.bride.name}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
