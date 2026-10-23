import { Scale, Anchor, CalendarCheck } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui";
import { FadeIn, FadeItem, Stagger } from "@/components/motion";

const reasons = [
  {
    icon: Scale,
    title: "Independent",
    body: "Third-party inspection with no conflict of interest. Our only job is to report the condition of the equipment accurately.",
  },
  {
    icon: Anchor,
    title: "Port-Based",
    body: "On the ground at the Ports of Los Angeles & Long Beach, where the equipment is.",
  },
  {
    icon: CalendarCheck,
    title: "Since 1980",
    body: "46 years of container and intermodal equipment inspection experience in Southern California.",
  },
];

export default function WhyCCMS() {
  return (
    <section className="bg-babyblue-light py-20 sm:py-24">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="Why CCMS"
            title="Independent, local, experienced."
          />
        </FadeIn>
        <Stagger className="mt-12 grid gap-8 md:grid-cols-3">
          {reasons.map((r) => {
            const Icon = r.icon;
            return (
              <FadeItem key={r.title}>
                <div className="h-full">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-babyblue text-navy">
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold tracking-tight text-navy">{r.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{r.body}</p>
                </div>
              </FadeItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
