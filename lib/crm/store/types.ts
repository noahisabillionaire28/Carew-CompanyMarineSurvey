import type { Lead } from "../types";

/** Minimal storage interface so the CRM can move between backends. */
export interface LeadStore {
  list(): Promise<Lead[]>;
  get(id: string): Promise<Lead | null>;
  put(lead: Lead): Promise<void>;
  remove(id: string): Promise<void>;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Only UUIDs are accepted as ids, so ids can never become path tricks. */
export function isSafeId(id: string): boolean {
  return UUID.test(id);
}
