/** Pure stats over a list of leads. No I/O, easy to test. */
import { OPEN_STATUSES, STATUS_VALUES } from "./config";
import { formatMonth, monthKey } from "./format";
import type { Lead, LeadStatus } from "./types";

export interface CountRow {
  label: string;
  count: number;
}

export interface MonthRow {
  key: string;
  label: string;
  count: number;
}

export interface Stats {
  total: number;
  open: number;
  thisMonth: number;
  last30Days: number;
  byStatus: Record<LeadStatus, number>;
  bySource: { website: number; manual: number };
  months: MonthRow[]; // oldest → newest, last 12 months
  byService: CountRow[];
  byEquipment: CountRow[];
  byLocation: CountRow[];
  /** Hours from submission to the first status change out of "new". */
  response: { averageHours: number | null; medianHours: number | null; sample: number };
}

function countBy(leads: Lead[], pick: (l: Lead) => string): CountRow[] {
  const map = new Map<string, number>();
  for (const l of leads) {
    const k = pick(l) || "—";
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function firstResponseHours(lead: Lead): number | null {
  const first = lead.statusHistory.find((h) => h.status !== "new");
  if (!first) return null;
  const ms = new Date(first.at).getTime() - new Date(lead.createdAt).getTime();
  return ms >= 0 ? ms / 3_600_000 : null;
}

export function computeStats(leads: Lead[], now: Date = new Date()): Stats {
  const byStatus = Object.fromEntries(STATUS_VALUES.map((s) => [s, 0])) as Record<LeadStatus, number>;
  for (const l of leads) byStatus[l.status] = (byStatus[l.status] ?? 0) + 1;

  const currentKey = monthKey(now);
  const thirtyDaysAgo = now.getTime() - 30 * 86_400_000;

  // Last 12 months, oldest first
  const months: MonthRow[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 15, 12));
    months.push({ key: monthKey(d), label: formatMonth(d), count: 0 });
  }
  const monthIndex = new Map(months.map((m, i) => [m.key, i]));
  for (const l of leads) {
    const idx = monthIndex.get(monthKey(new Date(l.createdAt)));
    if (idx !== undefined) months[idx].count++;
  }

  const hours = leads
    .map(firstResponseHours)
    .filter((h): h is number => h !== null)
    .sort((a, b) => a - b);
  const averageHours = hours.length ? hours.reduce((a, b) => a + b, 0) / hours.length : null;
  const medianHours = hours.length
    ? hours.length % 2
      ? hours[(hours.length - 1) / 2]
      : (hours[hours.length / 2 - 1] + hours[hours.length / 2]) / 2
    : null;

  return {
    total: leads.length,
    open: leads.filter((l) => OPEN_STATUSES.includes(l.status)).length,
    thisMonth: leads.filter((l) => monthKey(new Date(l.createdAt)) === currentKey).length,
    last30Days: leads.filter((l) => new Date(l.createdAt).getTime() >= thirtyDaysAgo).length,
    byStatus,
    bySource: {
      website: leads.filter((l) => l.source === "website").length,
      manual: leads.filter((l) => l.source === "manual").length,
    },
    months,
    byService: countBy(leads, (l) => l.service),
    byEquipment: countBy(leads, (l) => l.equipment),
    byLocation: countBy(leads, (l) => l.location),
    response: { averageHours, medianHours, sample: hours.length },
  };
}

/** "2.5h", "3d 4h" style label for an hours value. */
export function formatHours(hours: number | null): string {
  if (hours === null) return "—";
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))}m`;
  if (hours < 48) return `${hours.toFixed(hours < 10 ? 1 : 0)}h`;
  const d = Math.floor(hours / 24);
  const h = Math.round(hours - d * 24);
  return h ? `${d}d ${h}h` : `${d}d`;
}
