import type { Metadata } from "next";
import { Container, PageHero } from "@/components/ui";
import { FadeIn } from "@/components/motion";
import EquipmentChips from "@/components/EquipmentChips";
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
            className={`scroll-mt-24 py-10 sm:py-16 lg:py-20 ${alt ? "bg-babyblue-light" : "bg-white"}`}
          >
            <Container>
              <FadeIn>
                <div className="grid gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-12">
                  <div className="lg:col-span-5">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-babyblue text-navy sm:h-14 sm:w-14">
                      <ServiceIcon name={s.icon} size={28} />
                    </span>
                    <p className="mt-4 text-xs font-semibold uppercase sm:mt-6 tracking-[0.14em] text-muted">
                      Service {String(i + 1).padStart(2, "0")} of {services.length}
                    </p>
                    <h2 className="mt-1 text-2xl font-bold leading-tight tracking-tight text-navy sm:mt-2 sm:text-4xl">
                      {s.title}
                    </h2>
                  </div>
                  <div className="space-y-3 text-base leading-relaxed text-text sm:space-y-4 sm:text-lg lg:col-span-7">
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
    </>
  );
}
