"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/data/services";
import { useFadeUp } from "./motion";
import ServiceIcon from "./ServiceIcon";

export default function ServiceCard({
  service,
  className = "",
}: {
  service: Service;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const variants = useFadeUp();

  return (
    <motion.li variants={variants} className={`flex ${className}`}>
      <motion.div
        whileHover={reduce ? undefined : { y: -6 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="group flex w-full"
      >
        <Link
          href={`/services#${service.slug}`}
          className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm transition-[box-shadow,border-color] duration-300 group-hover:border-babyblue group-hover:shadow-xl group-hover:shadow-navy/10 sm:p-6"
        >
          {/* Accent line slides in across the top on hover */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-navy via-babyblue to-babyblue transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
          />

          {/* Icon tile fills navy on hover, icon turns white */}
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-babyblue-light text-navy transition-all duration-300 group-hover:scale-105 group-hover:bg-navy group-hover:text-white motion-reduce:transform-none">
            <ServiceIcon name={service.icon} size={24} />
          </span>

          <h3 className="mt-5 text-lg font-bold leading-tight tracking-tight text-navy">
            {service.title}
          </h3>

          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted transition-colors duration-300 group-hover:text-text">
            {service.short}
          </p>

          <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-navy">
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
