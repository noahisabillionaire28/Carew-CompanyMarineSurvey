"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui";
import { FadeIn, FadeItem, Stagger } from "@/components/motion";
import type { FieldMedia } from "@/data/field";

function Placeholder() {
  return (
    <div className="pattern-diagonal flex h-full w-full flex-col items-center justify-center gap-2 text-muted">
      <ImageIcon size={24} aria-hidden="true" />
      <span className="text-xs font-medium uppercase tracking-[0.12em]">
        Photo coming soon
      </span>
    </div>
  );
}

function Slot({ item }: { item: FieldMedia }) {
  const [failed, setFailed] = useState(false);
  const empty = !item.src || failed;

  return (
    <div className="relative h-full overflow-hidden rounded-xl border border-border bg-babyblue-light shadow-sm">
      {empty ? (
        <Placeholder />
      ) : item.type === "video" ? (
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={item.alt}
          onError={() => setFailed(true)}
        >
          <source src={item.src} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(min-width: 1024px) 400px, 50vw"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export default function FieldGrid({ items }: { items: FieldMedia[] }) {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-24">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="In the Field"
            title="On the ground at the ports"
          />
        </FadeIn>
        {/* Rows are sized from the column width, so every landscape tile is
            exactly 4:3 and portrait tiles span two rows. */}
        <div className="field-wrap mt-6 sm:mt-10">
          <Stagger className="field-grid">
            {items.map((item, i) => (
              <FadeItem
                key={`${item.alt}-${i}`}
                className={item.shape === "portrait" ? "row-span-2" : undefined}
              >
                <Slot item={item} />
              </FadeItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
