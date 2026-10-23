import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import FieldGrid from "@/components/home/FieldGrid";
import WhyCCMS from "@/components/home/WhyCCMS";
import ServiceCard from "@/components/ServiceCard";
import EquipmentChips from "@/components/EquipmentChips";
import CtaBanner from "@/components/CtaBanner";
import { Container, SectionHeading } from "@/components/ui";
import { FadeIn, Stagger } from "@/components/motion";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: {
    absolute:
      "Container & Intermodal Equipment Surveys | Ports of LA & Long Beach | CCMS",
  },
  description:
    "Independent container surveys, CSC inspections, IICL, on-hire and off-hire surveys at the Ports of Los Angeles & Long Beach. Carew & Company Marine Survey, since 1980.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />

      <section className="bg-white py-20 sm:py-24">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="Services"
              title="Eight survey services, one independent source"
              subtitle="Container and intermodal equipment inspections for shipping lines, leasing companies, depots and terminals."
            />
          </FadeIn>
          <Stagger as="ul" className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </Stagger>
        </Container>
      </section>

      <EquipmentChips background="babyblue-light" />
      <FieldGrid />
      <WhyCCMS />
      <CtaBanner />
    </>
  );
}
