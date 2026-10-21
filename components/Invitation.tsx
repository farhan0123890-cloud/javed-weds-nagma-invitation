"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { events } from "@/data/wedding";
import Cover from "./Cover";
import { FloralCorner } from "./Floral";
import { StartedContext } from "./Reveal";
import { ClosingSlide, CountdownSlide, CelebrationsSlide, CoupleSlide, EventSlide, IntroSlide, VenueSlide } from "./Slides";

type Phase = "closed" | "opening" | "open";

export default function Invitation() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("closed");
  const [started, setStarted] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  const onOpening = useCallback(() => {
    setPhase("opening");
    // Let the doors begin to part before the first words rise.
    window.setTimeout(() => setStarted(true), reduce ? 100 : 900);
  }, [reduce]);

  const onDone = useCallback(() => {
    setPhase((p) => (p === "open" ? p : "open"));
  }, []);

  useEffect(() => {
    if (phase === "open") scroller.current?.focus({ preventScroll: true });
  }, [phase]);

  const slides = () => Array.from(scroller.current?.querySelectorAll<HTMLElement>(".slide") ?? []);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    setAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - 24);
  };

  const next = () => {
    const el = scroller.current;
    if (!el) return;
    const behavior = reduce ? "auto" : "smooth";
    if (atEnd) return el.scrollTo({ top: 0, behavior });
    const target = slides().find((s) => s.offsetTop > el.scrollTop + 8);
    if (target) el.scrollTo({ top: target.offsetTop, behavior });
  };

  const locked = phase !== "open";

  return (
    <StartedContext.Provider value={started}>
      <main className="stage">
        <div className="deco" aria-hidden="true">
          <div className="arch" />
          <FloralCorner id="deco-tl" className="deco-corner deco-tl" />
          <FloralCorner id="deco-br" className="deco-corner deco-br" />
        </div>

        <div
          ref={scroller}
          className={`scroller ${locked ? "locked" : ""}`}
          onScroll={onScroll}
          tabIndex={-1}
          inert={phase !== "open"}
        >
          <IntroSlide />
          <CoupleSlide />
          <CelebrationsSlide />
          {events.map((e, i) => (
            <EventSlide key={e.id} event={e} index={i} />
          ))}
          <VenueSlide venueId="klFarmHouse" eventName="Nikkah" variant={0} />
          <VenueSlide venueId="diamondVatika" eventName="Reception" variant={1} />
          <CountdownSlide />
          <ClosingSlide />
        </div>

        <AnimatePresence>
          {phase === "open" && (
            <motion.button
              key="cue"
              type="button"
              className="cue"
              onClick={next}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
            >
              <span>{atEnd ? "Back to top" : "Scroll"}</span>
              {atEnd ? <ChevronUp size={13} aria-hidden="true" /> : <ChevronDown size={13} aria-hidden="true" />}
            </motion.button>
          )}
        </AnimatePresence>

        {phase !== "open" && <Cover onOpening={onOpening} onDone={onDone} />}
      </main>
    </StartedContext.Provider>
  );
}
