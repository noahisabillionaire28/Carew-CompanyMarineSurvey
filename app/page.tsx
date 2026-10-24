import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import FieldGrid from "@/components/home/FieldGrid";
import WhyCCMS from "@/components/home/WhyCCMS";
import ServiceCard from "@/components/ServiceCard";
import EquipmentChips from "@/components/EquipmentChips";
import { Container, SectionHeading } from "@/components/ui";
import { FadeIn, Stagger } from "@/components/motion";
import { services } from "@/data/services";
import { fieldMedia } from "@/data/field";
import { publicFileExists } from "@/lib/media";

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
  const field = fieldMedia.map((m) => (publicFileExists(m.src) ? m : { ...m, src: "" }));
  return (
    <>
      <Hero />
      <Stats />

      <section className="bg-white py-12 sm:py-16 lg:py-24">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="Services"
              title="What we survey"
            />
          </FadeIn>
          <Stagger as="ul" className="mt-6 grid grid-cols-2 sm:mt-10 gap-3 sm:gap-4 lg:grid-cols-4">
            {services.map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} />
            ))}
          </Stagger>
        </Container>
      </section>

      <EquipmentChips background="babyblue-light" compact />
      <FieldGrid items={field} />
      <WhyCCMS />
    </>
  );
}
