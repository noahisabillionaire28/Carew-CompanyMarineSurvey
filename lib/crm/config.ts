/**
 * The one client-specific file for the staff CRM.
 * Change statuses, labels and colours here; everything else is generic.
 */
import { site } from "@/data/site";
import type { LeadSource, LeadStatus } from "./types";

export const BRAND = { short: site.shortName, name: site.name };

export const SESSION_COOKIE = "ccms_staff";
export const SESSION_DAYS = 30;

export interface StatusMeta {
  value: LeadStatus;
  label: string;
  description: string;
  /** Pill classes (border + background + text) */
  pill: string;
  /** Small dot / bar colour */
  dot: string;
}

export const STATUSES: StatusMeta[] = [
  {
    value: "new",
    label: "New",
    description: "Just came in. Nobody has reached out yet.",
    pill: "border-babyblue bg-babyblue-light text-navy",
    dot: "bg-babyblue",
  },
  {
    value: "contacted",
    label: "Contacted",
    description: "Someone has called or emailed them.",
    pill: "border-amber-200 bg-amber-50 text-amber-900",
    dot: "bg-amber-400",
  },
  {
    value: "scheduled",
    label: "Scheduled",
    description: "Survey date is set.",
    pill: "border-navy bg-navy text-white",
    dot: "bg-navy",
  },
  {
    value: "completed",
    label: "Completed",
    description: "Survey done.",
    pill: "border-green-200 bg-green-50 text-green-800",
    dot: "bg-green-500",
  },
  {
    value: "lost",
    label: "Lost",
    description: "Did not go ahead.",
    pill: "border-border bg-slate-100 text-muted",
    dot: "bg-slate-400",
  },
];

export const STATUS_VALUES = STATUSES.map((s) => s.value) as [LeadStatus, ...LeadStatus[]];
export const OPEN_STATUSES: LeadStatus[] = ["new", "contacted", "scheduled"];

export function statusMeta(value: LeadStatus): StatusMeta {
  return STATUSES.find((s) => s.value === value) ?? STATUSES[0];
}

export const SOURCE_LABELS: Record<LeadSource, string> = {
  website: "Website",
  manual: "Phone / manual",
};
