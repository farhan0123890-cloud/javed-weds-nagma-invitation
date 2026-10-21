"use client";

import { createContext, useContext, useRef, type ElementType, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/** Becomes true once the cover has started opening, so nothing animates beneath it. */
export const StartedContext = createContext(false);

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "p" | "h1" | "h2" | "h3" | "span" | "li" | "ul";
};

/** Upward fade-in, played once when the element scrolls into view. */
export function Reveal({ children, delay = 0, y = 18, className, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const started = useContext(StartedContext);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const Comp = motion[as] as ElementType;
  return (
    <Comp
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      animate={started && inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: reduce ? 0.4 : 1.1, delay: reduce ? 0 : delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

/** Text that rises out of a mask — used for the large names and headings. */
export function MaskLine({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const started = useContext(StartedContext);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const show = started && inView;
  return (
    <span ref={ref} className={`mask ${className ?? ""}`}>
      <motion.span
        className="mask-inner"
        initial={{ y: reduce ? 0 : "105%", opacity: reduce ? 0 : 1 }}
        animate={show ? { y: 0, opacity: 1 } : undefined}
        transition={{ duration: reduce ? 0.4 : 1.25, delay: reduce ? 0 : delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** A hairline that draws itself outward from the centre. */
export function Rule({ delay = 0, className }: { delay?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const started = useContext(StartedContext);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <motion.span
      ref={ref}
      aria-hidden="true"
      className={`rule ${className ?? ""}`}
      initial={{ scaleX: reduce ? 1 : 0, opacity: reduce ? 0 : 1 }}
      animate={started && inView ? { scaleX: 1, opacity: 1 } : undefined}
      transition={{ duration: reduce ? 0.4 : 1.4, delay: reduce ? 0 : delay, ease: EASE }}
    />
  );
}
