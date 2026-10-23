import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";
import SocialIcons from "./SocialIcons";
import { nav, site } from "@/data/site";

export default function Footer() {
  const year = new Date().getFullYear();
  const s = site.streetAddress;
  const m = site.mailingAddress;

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo variant="light" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-babyblue">
              {site.description}
            </p>
            <SocialIcons light className="mt-6" />
          </div>

          <div className="lg:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-babyblue">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-babyblue" aria-hidden="true" />
                <span>
                  <span className="block text-white/60">Office</span>
                  {s.line1}, {s.city}, {s.state} {s.zip}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-babyblue" aria-hidden="true" />
                <span>
                  <span className="block text-white/60">Mailing</span>
                  {m.line1}, {m.city}, {m.state} {m.zip}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-babyblue" aria-hidden="true" />
                <a href={site.phoneHref} className="hover:text-babyblue">
                  {site.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-babyblue" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="hover:text-babyblue">
                  {site.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-babyblue" aria-hidden="true" />
                <span>{site.hours}</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-babyblue">
              Navigate
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-babyblue">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="hover:text-babyblue">
                  Request a Survey
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-white/60">
          © {year} Carew &amp; Company Marine Survey. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
