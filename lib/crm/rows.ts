/** Flattened, display-ready lead rows for client list components. Built on the server. */
import { formatDateTime, timeAgo } from "./format";
import type { Lead, LeadSource, LeadStatus } from "./types";

export interface LeadRow {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  service: string;
  equipment: string;
  location: string;
  status: LeadStatus;
  source: LeadSource;
  /** "Oct 27, 2026, 11:00 AM" */
  when: string;
  /** "3h ago" */
  ago: string;
}

export function toRow(lead: Lead, nowMs: number = Date.now()): LeadRow {
  return {
    id: lead.id,
    name: lead.name,
    company: lead.company,
    phone: lead.phone,
    email: lead.email,
    service: lead.service,
    equipment: lead.equipment,
    location: lead.location,
    status: lead.status,
    source: lead.source,
    when: formatDateTime(lead.createdAt),
    ago: timeAgo(lead.createdAt, nowMs),
  };
}
