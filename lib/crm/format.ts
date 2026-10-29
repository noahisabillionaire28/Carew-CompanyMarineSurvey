/** Date helpers. Everything is shown in the client's local business timezone. */

export const TZ = "America/Los_Angeles";

const dateTime = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  dateStyle: "medium",
  timeStyle: "short",
});

const dateOnly = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  dateStyle: "medium",
});

const monthLabel = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  month: "short",
  year: "2-digit",
});

const monthParts = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
});

export function formatDateTime(iso: string): string {
  return dateTime.format(new Date(iso));
}

export function formatDate(iso: string): string {
  return dateOnly.format(new Date(iso));
}

/** "Oct 2026" style label for a Date. */
export function formatMonth(date: Date): string {
  return monthLabel.format(date);
}

/** "YYYY-MM" in the business timezone. */
export function monthKey(date: Date): string {
  const parts = monthParts.formatToParts(date);
  const y = parts.find((p) => p.type === "year")?.value ?? "0000";
  const m = parts.find((p) => p.type === "month")?.value ?? "00";
  return `${y}-${m}`;
}

/** Short relative time for lists: "just now", "12m ago", "3h ago", "2d ago", else the date. */
export function timeAgo(iso: string, nowMs: number = Date.now()): string {
  const diff = Math.max(0, nowMs - new Date(iso).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 14) return `${d}d ago`;
  return formatDate(iso);
}

/** A date typed into the form as YYYY-MM-DD, shown as "Oct 29, 2026" without timezone drift. */
export function formatPlainDate(ymd: string | undefined): string {
  if (!ymd) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return ymd;
  return dateOnly.format(new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12)));
}
