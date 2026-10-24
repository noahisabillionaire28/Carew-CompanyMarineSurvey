import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import FieldGrid from "@/components/home/FieldGrid";
import WhyCCMS from "@/components/home/WhyCCMS";
import ServicesStrip from "@/components/home/ServicesStrip";
import EquipmentChips from "@/components/EquipmentChips";
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

      <ServicesStrip />

      <EquipmentChips background="babyblue-light" compact />
      <FieldGrid items={field} />
      <WhyCCMS />
    </>
  );
}
