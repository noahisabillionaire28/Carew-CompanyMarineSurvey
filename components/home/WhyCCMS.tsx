import { Scale, Anchor, CalendarCheck } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui";
import { FadeIn, FadeItem, Stagger } from "@/components/motion";

const reasons = [
  {
    icon: Scale,
    title: "Independent",
    body: "Third-party. No conflict of interest.",
  },
  {
    icon: Anchor,
    title: "Port-Based",
    body: "On the ground at LA & Long Beach.",
  },
  {
    icon: CalendarCheck,
    title: "Since 1980",
    body: "46 years of inspection experience.",
  },
];

export default function WhyCCMS() {
  return (
    <section className="bg-babyblue-light py-12 sm:py-16 lg:py-24">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="Why CCMS"
            title="Independent. Local. Proven."
          />
        </FadeIn>
        <Stagger className="mt-6 grid gap-6 sm:mt-10 sm:gap-8 md:grid-cols-3">
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
