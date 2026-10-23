import Link from "next/link";

type Props = {
  variant?: "dark" | "light";
  className?: string;
  asLink?: boolean;
};

/** Mark: a "C" built from two stacked rounded rectangles (container profiles). */
export function LogoMark({
  color = "#0B1F3A",
  size = 40,
  className,
}: {
  color?: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Top container profile */}
      <path
        d="M14 6h16a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4H14a8 8 0 0 0-8 8v-10a8 8 0 0 1 8-8Z"
        fill={color}
      />
      {/* Bottom container profile */}
      <path
        d="M14 34h16a4 4 0 0 0 4-4v-2a4 4 0 0 0-4-4H14a8 8 0 0 1-8-8v10a8 8 0 0 0 8 8Z"
        fill={color}
      />
      {/* Spine joining the two profiles */}
      <rect x="6" y="14" width="8" height="12" rx="1" fill={color} />
      {/* Corrugation lines */}
      <rect x="18" y="9" width="2" height="4" rx="1" fill={color} opacity="0.35" />
      <rect x="23" y="9" width="2" height="4" rx="1" fill={color} opacity="0.35" />
      <rect x="18" y="27" width="2" height="4" rx="1" fill={color} opacity="0.35" />
      <rect x="23" y="27" width="2" height="4" rx="1" fill={color} opacity="0.35" />
    </svg>
  );
}

export default function Logo({
  variant = "dark",
  className = "",
  asLink = true,
}: Props) {
  const fg = variant === "dark" ? "#0B1F3A" : "#FFFFFF";
  const textClass = variant === "dark" ? "text-navy" : "text-white";
  const subClass = variant === "dark" ? "text-muted" : "text-babyblue";

  const inner = (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark color={fg} size={40} />
      <span className="flex flex-col leading-none">
        <span
          className={`font-heading text-2xl font-extrabold tracking-tight ${textClass}`}
        >
          CCMS
        </span>
        <span
          className={`mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] ${subClass}`}
        >
          Carew &amp; Company Marine Survey
        </span>
      </span>
    </span>
  );

  if (!asLink) return inner;
  return (
    <Link
      href="/"
      aria-label="Carew & Company Marine Survey — home"
      className="rounded-md"
    >
      {inner}
    </Link>
  );
}
