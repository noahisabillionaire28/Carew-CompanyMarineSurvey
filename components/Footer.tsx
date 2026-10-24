import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import Logo from "./Logo";
import SocialIcons from "./SocialIcons";
import { nav, site } from "@/data/site";

const label = "text-[11px] font-semibold uppercase tracking-[0.14em] text-babyblue";

export default function Footer() {
  const year = new Date().getFullYear();
  const s = site.streetAddress;
  const m = site.mailingAddress;

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-6 sm:px-6 sm:pt-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo variant="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              Independent container surveys at the Ports of Los Angeles &amp; Long Beach
              since 1980.
            </p>
            <SocialIcons light className="mt-5" />
          </div>

          {/* Contact: tap-friendly buttons on phones, plain links on desktop */}
          <div className="lg:col-span-3">
            <h3 className={label}>Contact</h3>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm lg:grid-cols-1 lg:gap-2">
              <a
                href={site.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 font-semibold hover:bg-white/5 lg:justify-start lg:border-0 lg:p-0 lg:hover:bg-transparent lg:hover:text-babyblue"
              >
                <Phone size={16} aria-hidden="true" className="shrink-0" />
                {site.phone}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 font-semibold hover:bg-white/5 lg:justify-start lg:border-0 lg:p-0 lg:hover:bg-transparent lg:hover:text-babyblue"
              >
                <Mail size={16} aria-hidden="true" className="shrink-0" />
                <span className="lg:hidden">Email us</span>
                <span className="hidden lg:inline">{site.email}</span>
              </a>
            </div>
            <p className="mt-3 text-sm text-white/70">Mon–Fri, 9:00 AM – 5:00 PM</p>
          </div>

          {/* Addresses: side by side on phones, stacked on desktop */}
          <div className="grid grid-cols-2 gap-6 text-sm lg:col-span-3 lg:grid-cols-1 lg:gap-4">
            <div>
              <h3 className={label}>Office</h3>
              <address className="mt-2 not-italic leading-relaxed text-white/80">
                {s.line1}
                <br />
                {s.city}, {s.state} {s.zip}
              </address>
            </div>
            <div>
              <h3 className={label}>Mailing</h3>
              <address className="mt-2 not-italic leading-relaxed text-white/80">
                {m.line1}
                <br />
                {m.city}, {m.state} {m.zip}
              </address>
            </div>
          </div>

          {/* Pages: one wrapped row on phones, a column on desktop */}
          <nav aria-label="Footer" className="lg:col-span-2">
            <h3 className={`${label} hidden lg:block`}>Pages</h3>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium lg:mt-3 lg:flex-col lg:gap-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/80 hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5 text-xs text-white/50 sm:mt-10">
          © {year} Carew &amp; Company Marine Survey. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
