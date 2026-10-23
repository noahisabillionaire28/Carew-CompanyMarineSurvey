"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { FadeItem, Stagger } from "@/components/motion";

const stats = [
  { value: 46, label: "Years in Business" },
  { value: 1980, label: "Established", format: false },
  { value: 8, label: "Survey Services" },
  { value: 6, label: "Equipment Types" },
];

function Counter({ value, format = true }: { value: number; format?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return (
    <span ref={ref} aria-label={String(value)}>
      {format ? display.toLocaleString("en-US") : display}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="border-b border-border bg-white">
      <Stagger
        as="ul"
        className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-px px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8"
      >
        {stats.map((s) => (
          <FadeItem as="li" key={s.label} className="px-4 py-4 text-center lg:text-left">
            <div className="font-heading text-4xl font-bold tracking-tight text-navy sm:text-5xl">
              <Counter value={s.value} format={s.format} />
            </div>
            <div className="mt-2 text-sm font-medium uppercase tracking-[0.12em] text-muted">
              {s.label}
            </div>
          </FadeItem>
        ))}
      </Stagger>
    </section>
  );
}
