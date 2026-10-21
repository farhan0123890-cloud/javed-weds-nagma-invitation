"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FloralCorner, Medallion } from "./Floral";

const EASE_OPEN = [0.65, 0, 0.25, 1] as const;
const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

type Props = { onOpening: () => void; onDone: () => void };

/**
 * Closed invitation: two embossed doors meeting at a seam, sealed with a medallion.
 * Activating the seal swings the doors apart to reveal the invitation beneath.
 */
export default function Cover({ onOpening, onDone }: Props) {
  const reduce = useReducedMotion();
  const [opening, setOpening] = useState(false);

  const open = () => {
    if (opening) return;
    setOpening(true);
    onOpening();
  };

  // Safety net: never leave the cover mounted if an animation callback is missed.
  useEffect(() => {
    if (!opening) return;
    const t = window.setTimeout(onDone, reduce ? 700 : 2600);
    return () => window.clearTimeout(t);
  }, [opening, reduce, onDone]);

  const doorTransition = {
    duration: reduce ? 0.5 : 1.6,
    delay: reduce ? 0 : 0.45,
    ease: EASE_OPEN,
  };

  const door = (side: "l" | "r") => {
    const left = side === "l";
    return (
      <motion.div
        className={`door door-${side}`}
        style={{ transformOrigin: left ? "0% 50%" : "100% 50%" }}
        initial={{ opacity: 0 }}
        animate={
          opening
            ? reduce
              ? { opacity: 0 }
              : { rotateY: left ? -96 : 96, opacity: [1, 1, 0.9, 0] }
            : { opacity: 1 }
        }
        transition={opening ? doorTransition : { duration: 1.1, ease: EASE_SOFT }}
        onAnimationComplete={() => {
          if (opening && left) onDone();
        }}
      >
        <FloralCorner id={`cv-${side}-t`} className={`door-floral door-floral-t ${left ? "" : "mirror"}`} />
        <FloralCorner id={`cv-${side}-m`} className={`door-floral door-floral-m ${left ? "" : "mirror"}`} />
        <FloralCorner id={`cv-${side}-b`} className={`door-floral door-floral-b ${left ? "" : "mirror"}`} />
      </motion.div>
    );
  };

  return (
    <motion.div
      className={`cover ${opening ? "is-opening" : ""}`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      aria-hidden={opening ? "true" : undefined}
    >
      <div className="cover-stage">
        {door("l")}
        {door("r")}
        <div className="seam" aria-hidden="true" />
      </div>

      <motion.button
        type="button"
        className="seal-btn"
        onClick={open}
        aria-label="Open invitation"
        initial={{ opacity: 0, y: reduce ? 0 : 12 }}
        animate={opening ? { opacity: 0, scale: reduce ? 1 : 0.9, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
        transition={opening ? { duration: 0.5, ease: EASE_SOFT } : { duration: 1.2, delay: reduce ? 0 : 0.9, ease: EASE_SOFT }}
        whileTap={reduce || opening ? undefined : { scale: 0.96 }}
      >
        <Medallion id="cv-seal" className="seal" />
        <motion.span
          className="seal-label"
          animate={opening || reduce ? undefined : { opacity: [0.72, 1, 0.72] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          Open Invitation
        </motion.span>
      </motion.button>
    </motion.div>
  );
}
