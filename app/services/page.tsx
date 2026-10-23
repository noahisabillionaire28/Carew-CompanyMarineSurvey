import type { Metadata } from "next";
import { Container, PageHero } from "@/components/ui";
import { FadeIn } from "@/components/motion";
import EquipmentChips from "@/components/EquipmentChips";
import CtaBanner from "@/components/CtaBanner";
import ServiceIcon from "@/components/ServiceIcon";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "CSC inspection, IICL, on-hire, in-service and off-hire surveys, periodic tank testing, accident investigations and depot audits at the Ports of Los Angeles & Long Beach. Since 1980.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Container & Intermodal Equipment Surveys"
        subtitle="Eight independent survey services for shipping lines, leasing companies, depots and terminals at the Ports of Los Angeles & Long Beach."
      />

      {services.map((s, i) => {
        const alt = i % 2 === 1;
        return (
          <section
            key={s.slug}
            id={s.slug}
            className={`scroll-mt-24 py-16 sm:py-20 ${alt ? "bg-babyblue-light" : "bg-white"}`}
          >
            <Container>
              <FadeIn>
                <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                  <div className="lg:col-span-5">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-babyblue text-navy">
                      <ServiceIcon name={s.icon} size={28} />
                    </span>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      Service {String(i + 1).padStart(2, "0")} of {services.length}
                    </p>
                    <h2 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-navy sm:text-4xl">
                      {s.title}
                    </h2>
                  </div>
                  <div className="space-y-4 text-lg leading-relaxed text-text lg:col-span-7">
                    {s.long.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </Container>
          </section>
        );
      })}

      <EquipmentChips background="white" />
      <CtaBanner />
    </>
  );
}
