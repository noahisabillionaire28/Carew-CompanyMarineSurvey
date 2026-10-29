/**
 * Vercel Blob adapter. Requires a PRIVATE Blob store connected to the project
 * (Vercel injects BLOB_READ_WRITE_TOKEN). One JSON file per lead under leads/.
 *
 * Writes are last-write-wins per lead, which is fine for a three-person team.
 */
import { del, get, list, put } from "@vercel/blob";
import type { Lead } from "../types";
import { isSafeId, type LeadStore } from "./types";

const PREFIX = "leads/";
const pathFor = (id: string) => `${PREFIX}${id}.json`;

async function read(pathname: string): Promise<Lead | null> {
  const res = await get(pathname, { access: "private", useCache: false });
  if (!res || res.statusCode !== 200 || !res.stream) return null;
  const text = await new Response(res.stream).text();
  return JSON.parse(text) as Lead;
}

export const blobStore: LeadStore = {
  async list() {
    const pathnames: string[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: PREFIX, limit: 1000, cursor });
      for (const b of page.blobs) {
        if (b.pathname.endsWith(".json")) pathnames.push(b.pathname);
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);

    const leads: Lead[] = [];
    const BATCH = 20;
    for (let i = 0; i < pathnames.length; i += BATCH) {
      const batch = await Promise.all(
        pathnames.slice(i, i + BATCH).map((p) => read(p).catch(() => null)),
      );
      for (const lead of batch) if (lead) leads.push(lead);
    }
    return leads;
  },

  async get(id) {
    if (!isSafeId(id)) return null;
    try {
      return await read(pathFor(id));
    } catch {
      return null;
    }
  },

  async put(lead) {
    await put(pathFor(lead.id), JSON.stringify(lead), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  },

  async remove(id) {
    if (!isSafeId(id)) return;
    await del(pathFor(id));
  },
};
