import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container, PageHero } from "@/components/ui";
import { FadeIn } from "@/components/motion";
import RequestForm from "@/components/RequestForm";
import SocialIcons from "@/components/SocialIcons";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Request a Survey",
  description:
    "Request a container or intermodal equipment survey at the Ports of Los Angeles & Long Beach. Call (310) 713-2982 or send a request online. Carew & Company Marine Survey, since 1980.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const s = site.streetAddress;
  const m = site.mailingAddress;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Request a Survey"
        subtitle="Tell us what needs inspecting and where. We'll follow up to confirm the details."
      />

      <section className="bg-white py-8 sm:py-16 lg:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-10">
            {/* Form first: top of the page on mobile, left column on desktop */}
            <FadeIn className="lg:col-span-7">
              <div className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-8">
                <h2 className="text-xl font-bold tracking-tight text-navy">Survey request</h2>
                <p className="mt-1 text-sm text-muted">Fields marked * are required.</p>
                <div className="mt-5 sm:mt-6">
                  <RequestForm />
                </div>
              </div>
            </FadeIn>

            <FadeIn className="lg:sticky lg:top-28 lg:col-span-5" delay={0.1}>
              <div className="rounded-xl border border-border bg-babyblue-light/50 p-5 sm:p-8">
                <h2 className="text-xl font-bold tracking-tight text-navy">Prefer to call?</h2>
                <p className="mt-1 text-sm text-muted">Reach us directly during business hours.</p>
                <ul className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-1">
                  <li className="flex gap-3">
                    <Phone size={18} className="mt-0.5 shrink-0 text-navy" aria-hidden="true" />
                    <div>
                      <div className="text-muted">Phone</div>
                      <a href={site.phoneHref} className="font-semibold text-navy hover:underline">
                        {site.phone}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Mail size={18} className="mt-0.5 shrink-0 text-navy" aria-hidden="true" />
                    <div className="min-w-0">
                      <div className="text-muted">Email</div>
                      <a href={`mailto:${site.email}`} className="break-words font-semibold text-navy hover:underline">
                        {site.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-navy" aria-hidden="true" />
                    <div>
                      <div className="text-muted">Office</div>
                      <address className="not-italic font-semibold text-navy">
                        {s.line1}
                        <br />
                        {s.city}, {s.state} {s.zip}
                      </address>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Mail size={18} className="mt-0.5 shrink-0 text-navy" aria-hidden="true" />
                    <div>
                      <div className="text-muted">Mailing address</div>
                      <address className="not-italic font-semibold text-navy">
                        {m.line1}
                        <br />
                        {m.city}, {m.state} {m.zip}
                      </address>
                    </div>
                  </li>
                  <li className="flex gap-3 sm:col-span-2 lg:col-span-1">
                    <Clock size={18} className="mt-0.5 shrink-0 text-navy" aria-hidden="true" />
                    <div>
                      <div className="text-muted">Hours</div>
                      <div className="font-semibold text-navy">{site.hours}</div>
                    </div>
                  </li>
                </ul>
                <SocialIcons className="mt-5" />
                <div className="mt-5 overflow-hidden rounded-xl border border-border bg-white">
                  <iframe
                    title="Map of the Ports of Los Angeles and Long Beach"
                    src={site.mapEmbedUrl}
                    width="100%"
                    height="200"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="block w-full"
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>
    </>
  );
}
