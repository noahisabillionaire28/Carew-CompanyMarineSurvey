"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/data/services";
import { useFadeUp } from "./motion";
import ServiceIcon from "./ServiceIcon";

export default function ServiceCard({ service }: { service: Service }) {
  const reduce = useReducedMotion();
  const variants = useFadeUp();
  return (
    <motion.li variants={variants} className="h-full">
      <motion.div
        whileHover={reduce ? undefined : { y: -4 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="group h-full"
      >
        <Link
          href={`/services#${service.slug}`}
          className="flex h-full flex-col rounded-xl border border-border bg-white p-4 shadow-sm sm:p-6 transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-navy/5"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-babyblue-light text-navy transition-colors duration-300 group-hover:bg-babyblue">
            <ServiceIcon name={service.icon} size={24} />
          </span>
          <h3 className="mt-4 text-base font-bold sm:mt-5 sm:text-lg leading-tight tracking-tight text-navy">
            {service.title}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{service.short}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy">
            Learn more
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
            />
          </span>
        </Link>
      </motion.div>
    </motion.li>
  );
}
