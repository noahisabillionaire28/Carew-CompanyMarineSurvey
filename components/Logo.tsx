import Image from "next/image";
import Link from "next/link";

type Props = {
  variant?: "dark" | "light";
  className?: string;
  asLink?: boolean;
};

/**
 * Mark: the CCMS "C + ship" logo as a navy rounded tile. The tile keeps its
 * own navy background, so it reads the same on white and on navy.
 * Source: /public/logo-mark.png (160px, shown at 40px).
 */
export function LogoMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo-mark.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      priority
      className={`shrink-0 rounded-[10px] ${className}`}
    />
  );
}

export default function Logo({
  variant = "dark",
  className = "",
  asLink = true,
}: Props) {
  const textClass = variant === "dark" ? "text-navy" : "text-white";
  const subClass = variant === "dark" ? "text-muted" : "text-babyblue";

  const inner = (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark size={40} />
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
