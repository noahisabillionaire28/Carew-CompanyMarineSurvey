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
    <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-babyblue-light shadow-sm">
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
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export default function FieldGrid({ items: all }: { items: FieldMedia[] }) {
  const items = all.slice(0, 6);
  return (
    <section className="bg-white py-20 sm:py-24">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="In the Field"
            title="On the ground at the ports"
            subtitle="Container and intermodal equipment inspections at the Ports of Los Angeles & Long Beach."
          />
        </FadeIn>
        <Stagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <FadeItem key={`${item.alt}-${i}`}>
              <Slot item={item} />
            </FadeItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
