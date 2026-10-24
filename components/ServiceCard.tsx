"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/data/services";
import { useFadeUp } from "./motion";
import ServiceIcon from "./ServiceIcon";

export default function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const reduce = useReducedMotion();
  const variants = useFadeUp();
  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.li variants={variants} className="h-full">
      <motion.div
        whileHover={reduce ? undefined : { y: -6 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="group h-full"
      >
        <Link
          href={`/services#${service.slug}`}
          className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm transition-[box-shadow,border-color] duration-300 group-hover:border-babyblue group-hover:shadow-xl group-hover:shadow-navy/10 sm:p-6"
        >
          {/* Accent line slides in across the top on hover */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-navy via-babyblue to-babyblue transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
          />

          {/* Faint index number, top right */}
          <span
            aria-hidden="true"
            className="absolute right-5 top-4 font-heading text-3xl font-extrabold leading-none text-navy/[0.07] transition-colors duration-300 group-hover:text-babyblue sm:right-6 sm:text-4xl"
          >
            {number}
          </span>

          {/* Icon tile fills navy on hover, icon turns white */}
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-babyblue-light text-navy transition-all duration-300 group-hover:scale-105 group-hover:bg-navy group-hover:text-white motion-reduce:transform-none">
            <ServiceIcon name={service.icon} size={24} />
          </span>

          <h3 className="mt-5 flex-1 text-base font-bold leading-tight tracking-tight text-navy sm:text-lg lg:flex-none">
            {service.title}
          </h3>

          {/* One-line description on desktop; phones stay compact (title only) */}
          <p className="mt-2 hidden flex-1 text-sm leading-relaxed text-muted transition-colors duration-300 group-hover:text-text lg:line-clamp-2 lg:block">
            {service.short}
          </p>

          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy">
            <span className="transition-colors duration-300 group-hover:text-navy-light">
              Learn more
            </span>
            <ArrowUpRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
            />
          </span>
        </Link>
      </motion.div>
    </motion.li>
  );
}
