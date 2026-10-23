"use client";

import { useState } from "react";
import Image from "next/image";

export default function Headshot({ name, initials }: { name: string; initials: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-navy shadow-lg shadow-navy/10">
      {failed ? (
        <div
          className="pattern-grid flex h-full w-full items-center justify-center bg-gradient-to-br from-navy to-navy-light"
          role="img"
          aria-label={`${name} (photo coming soon)`}
        >
          <span className="font-heading text-7xl font-bold tracking-tight text-babyblue">
            {initials}
          </span>
        </div>
      ) : (
        <Image
          src="/stanley.jpg"
          alt={`${name}, President of Carew & Company Marine Survey`}
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
