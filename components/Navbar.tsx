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

  // Lock page scroll and close on Escape while the full-screen menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const linkColor = overHero
    ? "text-white/90 hover:text-white"
    : "text-text hover:text-navy";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        overHero
          ? "bg-transparent"
          : open
            ? "border-b border-border bg-white"
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
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 top-20 z-40 flex flex-col overflow-y-auto bg-white lg:hidden"
          >
            <div className="border-b border-border px-4 py-5 sm:px-6">
              <Link
                href="/contact"
                className="inline-flex rounded-xl bg-navy px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-navy-light"
              >
                Request a Survey
              </Link>
            </div>

            <nav aria-label="Mobile" className="flex-1 px-4 py-8 sm:px-6">
              <p className="text-sm italic text-muted">Menu</p>
              <motion.ul
                className="mt-6 flex flex-col"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              >
                {nav.map((item) => (
                  <motion.li
                    key={item.href}
                    variants={{
                      hidden: { opacity: 0, y: reduce ? 0 : 12 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
                    }}
                  >
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="block py-4 font-heading text-4xl font-bold leading-tight tracking-tight text-navy hover:text-navy-light sm:text-5xl"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>

            <div className="border-t border-border px-4 py-6 sm:px-6">
              <a
                href={site.phoneHref}
                className="inline-flex items-center gap-2 text-lg font-semibold text-navy"
              >
                <Phone size={20} aria-hidden="true" />
                {site.phone}
              </a>
              <p className="mt-1 text-sm text-muted">{site.hours}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
