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

/** Simple burst/asterisk shape standing in for Yelp (not the trademarked logo). */
export function YelpIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 3v7" />
      <path d="M12 14v7" />
      <path d="M4.2 7.5l6 3.5" />
      <path d="M13.8 13l6 3.5" />
      <path d="M19.8 7.5l-6 3.5" />
      <path d="M10.2 13l-6 3.5" />
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
