import type { Metadata } from "next";
import { Container, PageHero, SectionHeading } from "@/components/ui";
import { FadeIn } from "@/components/motion";
import Headshot from "@/components/Headshot";
import CtaBanner from "@/components/CtaBanner";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Carew & Company Marine Survey has provided independent container and intermodal equipment surveys at the Ports of Los Angeles & Long Beach since 1980. Founded by Stanley Carew.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title="Independent since 1980." />

      <section className="bg-white py-20 sm:py-24">
        <Container>
          <FadeIn>
            <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-5">
                <Headshot name={site.owner} initials="SC" />
                <div className="mt-5">
                  <p className="text-lg font-bold text-navy">{site.owner}</p>
                  <p className="text-sm text-muted">{site.ownerTitle}, {site.name}</p>
                </div>
              </div>
              <div className="space-y-6 text-lg leading-relaxed text-text lg:col-span-7">
                <p>
                  Stanley Carew founded Carew &amp; Company Marine Survey in February 1980.
                  For 46 years the company has provided independent surveying and inspection
                  of freight containers and intermodal equipment at the Ports of Los Angeles
                  &amp; Long Beach.
                </p>
                <p>
                  Before founding CCMS, Stanley was President of Carew Transportation
                  (1976–1979), an airfreight pickup and delivery company contracted to
                  Flying Tiger Airlines in Southern California. That early work in freight
                  logistics led directly to a career inspecting the equipment that moves it.
                </p>
                <p>
                  Today CCMS offers eight survey services across six equipment types,
                  serving shipping lines, leasing companies, depots and terminals in the
                  Southern California port complex.
                </p>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      <section className="bg-babyblue-light py-20 sm:py-24">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="Service Area"
              title="Where we work"
              subtitle="The Ports of Los Angeles & Long Beach and the surrounding depots and terminals of Southern California."
            />
          </FadeIn>
          <FadeIn className="mt-10">
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
              <iframe
                title="Map of the Ports of Los Angeles and Long Beach"
                src={site.mapEmbedUrl}
                width="100%"
                height="420"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="block w-full"
              />
            </div>
          </FadeIn>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
