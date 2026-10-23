import { Container as ContainerIcon, Snowflake, Truck, Cylinder, Zap, Anchor } from "lucide-react";
import { Container, SectionHeading } from "./ui";
import { FadeIn, FadeItem, Stagger } from "./motion";
import { equipmentTypes } from "@/data/site";

const icons = [ContainerIcon, Snowflake, Truck, Cylinder, Zap, Anchor];

export default function EquipmentChips({
  background = "white",
}: {
  background?: "white" | "babyblue-light";
}) {
  return (
    <section
      className={`py-10 sm:py-16 lg:py-24 ${
        background === "white" ? "bg-white" : "bg-babyblue-light"
      }`}
    >
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="Equipment"
            title="Equipment types we survey"
            subtitle="Six categories of freight containers and intermodal equipment, inspected at the Ports of Los Angeles & Long Beach."
          />
        </FadeIn>
        <Stagger
          as="ul"
          className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 lg:grid-cols-6"
        >
          {equipmentTypes.map((type, i) => {
            const Icon = icons[i];
            return (
              <FadeItem as="li" key={type}>
                <div className="flex h-full items-center gap-3 rounded-xl border border-border bg-white px-4 py-4 shadow-sm">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-babyblue-light text-navy">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold leading-tight text-navy">
                    {type}
                  </span>
                </div>
              </FadeItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
