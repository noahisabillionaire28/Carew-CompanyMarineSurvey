/**
 * Lead storage API used by pages and route handlers.
 * Picks Vercel Blob in production (when the token exists) and the local
 * filesystem otherwise.
 */
import { randomUUID } from "node:crypto";
import type { Lead, LeadInput, LeadSource, LeadStatus } from "../types";
import { blobStore } from "./blob";
import { fsStore } from "./fs";
import { isSafeId, type LeadStore } from "./types";

export type StorageMode = "blob" | "fs";

/** Who performed an action: a staff member, or the website itself. */
export interface Actor {
  name: string;
  username?: string;
}

export function storageMode(): StorageMode {
  return process.env.BLOB_READ_WRITE_TOKEN ? "blob" : "fs";
}

function store(): LeadStore {
  return storageMode() === "blob" ? blobStore : fsStore;
}

const nowIso = () => new Date().toISOString();

export async function listLeads(): Promise<Lead[]> {
  const leads = await store().list();
  return leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getLead(id: string): Promise<Lead | null> {
  if (!isSafeId(id)) return null;
  return store().get(id);
}

export async function createLead(input: LeadInput, source: LeadSource, actor: Actor): Promise<Lead> {
  const now = nowIso();
  const lead: Lead = {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    source,
    createdBy: source === "manual" ? (actor.username ?? actor.name) : undefined,
    status: "new",
    statusHistory: [{ status: "new", at: now, by: actor.name }],
    name: input.name,
    company: input.company,
    phone: input.phone,
    email: input.email,
    service: input.service,
    equipment: input.equipment,
    location: input.location,
    units: input.units,
    preferredDate: input.preferredDate || undefined,
    message: input.message || undefined,
    notes: [],
  };
  await store().put(lead);
  return lead;
}

export async function updateStatus(id: string, status: LeadStatus, actor: Actor): Promise<Lead | null> {
  const lead = await getLead(id);
  if (!lead) return null;
  if (lead.status === status) return lead;
  const now = nowIso();
  lead.status = status;
  lead.statusHistory.push({ status, at: now, by: actor.name });
  lead.updatedAt = now;
  await store().put(lead);
  return lead;
}

export async function addNote(id: string, actor: Actor, body: string): Promise<Lead | null> {
  const lead = await getLead(id);
  if (!lead) return null;
  const now = nowIso();
  lead.notes.push({ id: randomUUID(), author: actor.name, body, createdAt: now });
  lead.updatedAt = now;
  await store().put(lead);
  return lead;
}

export async function deleteLead(id: string): Promise<boolean> {
  const lead = await getLead(id);
  if (!lead) return false;
  await store().remove(id);
  return true;
}
