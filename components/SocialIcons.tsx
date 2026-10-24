import { site } from "@/data/site";

/** Inline LinkedIn "in" glyph (lucide-react no longer ships brand icons). */
function LinkedinIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v6.45h-4v-5.72c0-1.36-.03-3.12-1.9-3.12-1.9 0-2.2 1.49-2.2 3.02v5.82h-4v-11Z" />
    </svg>
  );
}

// Yelp-style burst: five rounded petals around a small open center.
// Each petal is the same teardrop shape, rotated (and scaled) into place.
const PETAL =
  "M-1.1 -2.6 L-2.9 -8.4 Q-3 -10.6 0 -10.6 Q3 -10.6 2.9 -8.4 L1.1 -2.6 Q0 -1.7 -1.1 -2.6Z";
const PETALS: [angle: number, scale: number][] = [
  [-8, 1.08], // top (longest)
  [68, 0.88], // upper right
  [140, 0.88], // lower right
  [208, 0.9], // bottom
  [282, 0.88], // left
];

export function YelpIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <g transform="translate(12 12.8)">
        {PETALS.map(([angle, scale]) => (
          <path key={angle} d={PETAL} transform={`rotate(${angle}) scale(${scale})`} />
        ))}
      </g>
    </svg>
  );
}

export default function SocialIcons({
  light = false,
  className = "",
}: {
  light?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors";
  const theme = light
    ? "border-white/20 text-white hover:bg-white/10"
    : "border-border text-navy hover:bg-babyblue-light";
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a
        href={site.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Stanley Carew on LinkedIn (opens in a new tab)"
        className={`${base} ${theme}`}
      >
        <LinkedinIcon />
      </a>
      <a
        href={site.yelp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Carew & Company Marine Survey on Yelp (opens in a new tab)"
        className={`${base} ${theme}`}
      >
        <YelpIcon />
      </a>
    </div>
  );
}
