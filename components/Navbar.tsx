"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import Logo from "./Logo";
import { nav, site } from "@/data/site";

export default function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Only the home page has a dark hero behind the navbar.
  const overHero = pathname === "/" && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const linkColor = overHero
    ? "text-white/90 hover:text-white"
    : "text-text hover:text-navy";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        overHero
          ? "bg-transparent"
          : "border-b border-border bg-white/95 backdrop-blur"
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Logo variant={overHero ? "light" : "dark"} />

        <ul className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-sm font-medium transition-colors ${linkColor} ${
                    active ? "underline decoration-babyblue decoration-2 underline-offset-8" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href={site.phoneHref}
            className={`inline-flex items-center gap-2 text-sm font-semibold ${linkColor}`}
          >
            <Phone size={16} aria-hidden="true" />
            {site.phone}
          </a>
          <Link
            href="/contact"
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] motion-reduce:transform-none ${
              overHero
                ? "bg-white text-navy hover:bg-babyblue-light"
                : "bg-navy text-white hover:bg-navy-light"
            }`}
          >
            Request a Survey
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-xl lg:hidden ${
            overHero ? "text-white" : "text-navy"
          }`}
        >
          {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: reduce ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="border-t border-border bg-white lg:hidden"
          >
            <ul className="flex flex-col px-4 py-4 sm:px-6">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="block rounded-xl px-3 py-3 text-base font-medium text-text hover:bg-babyblue-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 border-t border-border pt-4">
                <a
                  href={site.phoneHref}
                  className="flex items-center gap-2 px-3 py-2 text-base font-semibold text-navy"
                >
                  <Phone size={18} aria-hidden="true" />
                  {site.phone}
                </a>
              </li>
              <li className="mt-2">
                <Link
                  href="/contact"
                  className="block rounded-xl bg-navy px-5 py-3 text-center text-base font-semibold text-white"
                >
                  Request a Survey
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
