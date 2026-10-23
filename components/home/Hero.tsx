"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button, Eyebrow } from "@/components/ui";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const reduce = useReducedMotion();
  const [videoOk, setVideoOk] = useState(true);
  const [posterOk, setPosterOk] = useState(true);

  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  };

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-navy pt-20">
      {/* Background layers: video → poster → gradient + grid */}
      <div className="absolute inset-0 pattern-grid bg-gradient-to-br from-navy via-navy-light to-navy" />
      {posterOk && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/hero-poster.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setPosterOk(false)}
        />
      )}
      {videoOk && !reduce && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterOk ? "/hero-poster.jpg" : undefined}
          onError={() => setVideoOk(false)}
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      )}
      {/* Navy gradient overlay: 25% top → 75% bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/25 via-navy/50 to-navy/75" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 sm:pb-32 lg:px-8">
        <motion.div
          className="max-w-3xl"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
          }}
        >
          <motion.div variants={item}>
            <Eyebrow light>Ports of Los Angeles &amp; Long Beach · Since 1980</Eyebrow>
          </motion.div>
          <motion.h1
            variants={item}
            className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Independent Container &amp; Intermodal Equipment Surveys
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-babyblue sm:text-xl"
          >
            Serving shipping lines, leasing companies, depots and terminals at the
            Ports of Los Angeles &amp; Long Beach since 1980.
          </motion.p>
          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
            <Button href="/contact" variant="white">
              Request a Survey
            </Button>
            <Button href="/services" variant="outline-white">
              View Services
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
