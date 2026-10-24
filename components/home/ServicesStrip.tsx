"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { Container, SectionHeading } from "@/components/ui";
import { FadeIn } from "@/components/motion";
import { services } from "@/data/services";

/**
 * Horizontal scroll strip of service cards.
 * Phones: swipe, cards snap into place.
 * Desktop: arrow buttons, trackpad swipe or shift+wheel; the last visible card
 * peeks over the right edge so it is obvious there is more.
 */
export default function ServicesStrip() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0); // 0..1 of the strip seen so far
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= max - 2);
    setProgress(max > 0 ? (el.scrollLeft + el.clientWidth) / el.scrollWidth : 1);
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("li");
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    const step = (card?.getBoundingClientRect().width ?? el.clientWidth * 0.8) + gap;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  };

  const btn =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-navy shadow-sm transition-all duration-200 hover:border-babyblue hover:bg-babyblue-light active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-border disabled:hover:bg-white motion-reduce:transform-none";

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-24">
      <Container>
        <FadeIn>
          <div className="flex items-end justify-between gap-6">
            <SectionHeading eyebrow="Services" title="What we survey" />
            <div className="hidden shrink-0 items-center gap-3 lg:flex">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                disabled={atStart}
                aria-label="Previous services"
                className={btn}
              >
                <ArrowLeft size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                disabled={atEnd}
                aria-label="Next services"
                className={btn}
              >
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        </FadeIn>
      </Container>

      {/* Scroller bleeds to the viewport edge so the last visible card peeks */}
      <div className="mx-auto w-full max-w-7xl">
        <motion.ul
          ref={ref}
          aria-label="Services"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 pt-1 scroll-pl-4 sm:mt-10 sm:gap-5 sm:px-6 sm:scroll-pl-6 lg:px-8 lg:scroll-pl-8"
        >
          {services.map((s) => (
            <ServiceCard
              key={s.slug}
              service={s}
              className="w-[272px] shrink-0 snap-start sm:w-80"
            />
          ))}
        </motion.ul>
      </div>

      <Container>
        {/* Progress bar: how much of the strip has been seen */}
        <div
          role="progressbar"
          aria-label="Services scrolled"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          className="mt-6 h-1 w-full overflow-hidden rounded-full bg-border sm:mt-8"
        >
          <div
            className="h-full rounded-full bg-navy transition-[width] duration-200 ease-out motion-reduce:transition-none"
            style={{ width: `${Math.max(progress * 100, 4)}%` }}
          />
        </div>
      </Container>
    </section>
  );
}
