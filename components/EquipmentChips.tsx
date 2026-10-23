import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Container, SectionHeading } from "./ui";
import { FadeIn } from "./motion";
import { equipmentPhotos, type EquipmentPhoto } from "@/data/equipment";
import { publicFileExists } from "@/lib/media";

function Card({ item, hidden = false }: { item: EquipmentPhoto; hidden?: boolean }) {
  const hasPhoto = publicFileExists(item.src);
  return (
    <li className="w-64 shrink-0 sm:w-80" aria-hidden={hidden || undefined}>
      <figure className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        {hasPhoto ? (
          <Image
            src={item.src}
            alt={hidden ? "" : item.alt}
            fill
            sizes="(min-width: 640px) 320px, 256px"
            className="object-cover"
          />
        ) : (
          <div className="pattern-diagonal flex h-full w-full items-center justify-center text-muted">
            <ImageIcon size={24} aria-hidden="true" />
          </div>
        )}
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 via-navy/40 to-transparent px-4 pb-3 pt-10 text-sm font-semibold text-white sm:text-base">
          {item.type}
        </figcaption>
      </figure>
    </li>
  );
}

export default function EquipmentChips({
  background = "white",
  compact = false,
}: {
  background?: "white" | "babyblue-light";
  compact?: boolean;
}) {
  return (
    <section
      className={`overflow-hidden py-10 sm:py-16 lg:py-24 ${
        background === "white" ? "bg-white" : "bg-babyblue-light"
      }`}
    >
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="Equipment"
            title="Equipment types we survey"
            subtitle={compact ? undefined : "Six categories of freight containers and intermodal equipment, inspected at the Ports of Los Angeles & Long Beach."}
          />
        </FadeIn>
      </Container>

      {/* Infinite marquee: the list renders twice and the track slides by half
          its width, so the loop is seamless. Pauses on hover. */}
      <div className="marquee group mt-6 sm:mt-10">
        <ul className="marquee-track flex w-max gap-4 group-hover:[animation-play-state:paused]">
          {equipmentPhotos.map((item) => (
            <Card key={item.type} item={item} />
          ))}
          {equipmentPhotos.map((item) => (
            <Card key={`${item.type}-dup`} item={item} hidden />
          ))}
        </ul>
      </div>
    </section>
  );
}
