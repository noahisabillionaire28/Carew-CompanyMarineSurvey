/**
 * Staff CRM data model. One Lead = one JSON file in storage.
 */

export type LeadStatus = "new" | "contacted" | "scheduled" | "completed" | "lost";
export type LeadSource = "website" | "manual";

export interface Note {
  id: string;
  author: string; // staff display name
  body: string;
  createdAt: string; // ISO
}

export interface StatusChange {
  status: LeadStatus;
  at: string; // ISO
  by: string; // staff display name, or "website" for the initial entry
}

/** Fields collected by the public form and the manual-entry form. */
export interface LeadInput {
  name: string;
  company: string;
  phone: string;
  email: string;
  service: string;
  equipment: string;
  location: string;
  units?: number;
  preferredDate?: string;
  message?: string;
}

export interface Lead extends LeadInput {
  id: string; // UUID
  createdAt: string; // ISO
  updatedAt: string; // ISO
  source: LeadSource;
  createdBy?: string; // staff username for manual leads
  status: LeadStatus;
  statusHistory: StatusChange[];
  notes: Note[];
}

export interface Staff {
  username: string;
  name: string;
}
