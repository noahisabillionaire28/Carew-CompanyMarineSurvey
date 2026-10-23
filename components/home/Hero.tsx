"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    video: "https://6rtclfwa9h.ufs.sh/f/NF1osOfp7gafw20kkaY6dMyEXaTrlY1nBogcJjiVL3RS7WkG",
    title: "Independent Since 1980",
    subtitle: "Container surveys at the Ports of Los Angeles & Long Beach.",
  },
  {
    video: "https://6rtclfwa9h.ufs.sh/f/NF1osOfp7gafdYD1Mq687GAhLQOSIZa1J4o5pe2WMtHcnyKB",
    title: "On‑Hire. Off‑Hire.",
    subtitle: "Condition surveys for shipping lines and leasing companies.",
  },
  {
    video: "https://6rtclfwa9h.ufs.sh/f/NF1osOfp7gafDUN5AN4dJXLg0Iq6ZjusHw5MYTU1e7PW2loC",
    title: "Port‑Based Inspections",
    subtitle: "Containers, chassis, reefers and IMO tanks.",
  },
];

// Fallback if a video can't play (blocked, slow network, reduced motion).
const SLIDE_MS = 8000;
const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + slides.length) % slides.length),
    [],
  );

  // Play the active video from the start; pause the rest.
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === index && !reduce) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [index, reduce]);

  // Videos advance on "ended". If the active one never starts playing,
  // fall back to a timer so the carousel still moves.
  useEffect(() => {
    if (reduce) return;
    const v = videos.current[index];
    const t = window.setTimeout(() => go(1), SLIDE_MS);
    const cancel = () => window.clearTimeout(t);
    if (v && !v.paused && v.readyState > 2) cancel();
    v?.addEventListener("playing", cancel);
    return () => {
      cancel();
      v?.removeEventListener("playing", cancel);
    };
  }, [index, reduce, go]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      className="relative flex h-[100svh] min-h-[560px] items-center overflow-hidden bg-navy"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      {/* Fallback background under the videos */}
      <div className="pattern-grid absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />

      {slides.map((s, i) => (
        <video
          key={s.video}
          ref={(el) => {
            videos.current[i] = el;
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          src={s.video}
          muted
          playsInline
          preload={i === 0 ? "auto" : "metadata"}
          onEnded={() => i === index && go(1)}
          aria-hidden="true"
          tabIndex={-1}
        />
      ))}

      {/* Overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/70 via-navy/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-navy/30" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-24 sm:px-6 lg:px-8 lg:pt-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            aria-live="polite"
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -8 }}
            transition={{ duration: 0.5, ease }}
            className="max-w-3xl"
          >
            <h1 className="font-heading text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {slides[index].title}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/90 sm:mt-5 sm:text-xl">
              {slides[index].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-babyblue px-5 py-3 text-[15px] font-semibold text-navy shadow-lg shadow-navy/30 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] motion-reduce:transform-none sm:px-10 sm:py-4 sm:text-lg"
          >
            Request a Survey
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-full border border-white/60 px-5 py-3 text-[15px] font-semibold text-white transition-all duration-200 hover:scale-[1.03] hover:bg-white/10 active:scale-[0.98] motion-reduce:transform-none sm:px-10 sm:py-4 sm:text-lg"
          >
            View Services
          </Link>
        </div>

        {/* Slide indicators */}
        <div className="mt-10 flex gap-2" role="tablist" aria-label="Choose slide">
          {slides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}: ${s.title}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-10 bg-white" : "w-5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Edge arrows (half-pill tabs, like bryasound.com) */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute bottom-8 left-0 z-10 inline-flex h-12 w-12 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 items-center justify-start rounded-r-full bg-white/80 pl-2.5 text-navy shadow-md backdrop-blur transition-colors hover:bg-white sm:h-16 sm:w-16 sm:pl-4"
      >
        <ChevronLeft size={26} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute bottom-8 right-0 z-10 inline-flex h-12 w-12 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 items-center justify-end rounded-l-full bg-babyblue pr-2.5 text-navy shadow-md transition-colors hover:bg-white sm:h-16 sm:w-16 sm:pr-4"
      >
        <ChevronRight size={26} aria-hidden="true" />
      </button>
    </section>
  );
}
