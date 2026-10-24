import Link from "next/link";
import Logo from "./Logo";
import { YelpIcon } from "./SocialIcons";
import { site } from "@/data/site";

/** Inline LinkedIn "in" glyph, sized for the large social row. */
function LinkedinGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v6.45h-4v-5.72c0-1.36-.03-3.12-1.9-3.12-1.9 0-2.2 1.49-2.2 3.02v5.82h-4v-11Z" />
    </svg>
  );
}

const row = "border-t border-white/10";
const pad = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

export default function Footer() {
  const year = new Date().getFullYear();
  const s = site.streetAddress;
  const m = site.mailingAddress;

  return (
    <footer className="bg-navy text-white">
      {/* Brand */}
      <div className={`${pad} py-8 sm:py-10`}>
        <Logo variant="light" />
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
          Independent container surveys at the Ports of Los Angeles &amp; Long Beach since
          1980.
        </p>
      </div>

      {/* Social: large, evenly spaced */}
      <div className={row}>
        <div className={`${pad} flex items-center justify-center gap-16 py-7 sm:gap-24 sm:py-8`}>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Stanley Carew on LinkedIn (opens in a new tab)"
            className="text-white transition-colors hover:text-babyblue"
          >
            <LinkedinGlyph />
          </a>
          <a
            href={site.yelp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Carew & Company Marine Survey on Yelp (opens in a new tab)"
            className="text-white transition-colors hover:text-babyblue"
          >
            <YelpIcon className="h-8 w-8" />
          </a>
        </div>
      </div>

      {/* Call to action */}
      <div className={row}>
        <div className={`${pad} flex items-center justify-center gap-4 py-6 sm:gap-6 sm:py-7`}>
          <span className="text-lg font-semibold sm:text-xl">Need A Survey?</span>
          <Link
            href="/contact"
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-navy shadow-sm transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] motion-reduce:transform-none sm:px-6 sm:text-base"
          >
            Request Here
          </Link>
        </div>
      </div>

      {/* Addresses */}
      <div className={row}>
        <div className={`${pad} flex items-start justify-between gap-6 py-6 text-sm sm:py-7 sm:text-base`}>
          <address className="not-italic leading-relaxed">
            <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-babyblue">
              Office
            </span>
            {s.line1}
            <br />
            {s.city}, {s.state} {s.zip}
          </address>
          <address className="text-right not-italic leading-relaxed">
            <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-babyblue">
              Mailing
            </span>
            {m.line1}
            <br />
            {m.city}, {m.state} {m.zip}
          </address>
        </div>
      </div>

      {/* Copyright */}
      <div className={row}>
        <p className={`${pad} py-6 text-center text-sm text-white/70 sm:py-7`}>
          © {year} / Carew &amp; Company Marine Survey / All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
