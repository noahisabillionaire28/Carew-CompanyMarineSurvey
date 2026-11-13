/**
 * Vercel Blob adapter. Requires a PRIVATE Blob store connected to the project
 * (Vercel injects BLOB_READ_WRITE_TOKEN).
 *
 * Layout in the store:
 *   leads/<id>.json   one file per lead — the source of truth
 *   leads/index.json  cached copy of every lead keyed by id, with the etag of
 *                     the file it was copied from
 *
 * Why the index: Vercel's free Blob tier counts every read. Without it each
 * admin page would read every lead file. With it a page costs one list call
 * plus one read, and the index heals itself: list() compares etags from the
 * listing against the index and re-reads only files that are new or changed.
 *
 * Writes are last-write-wins per lead (fine for a three-person team). Index
 * writes use ifMatch so two concurrent updates cannot silently drop each other.
 */
import { BlobPreconditionFailedError, del, get, list, put } from "@vercel/blob";
import type { Lead } from "../types";
import { isSafeId, type LeadStore } from "./types";

const PREFIX = "leads/";
const INDEX = `${PREFIX}index.json`;
const pathFor = (id: string) => `${PREFIX}${id}.json`;
const idFrom = (pathname: string) => pathname.slice(PREFIX.length, -".json".length);

interface IndexEntry {
  etag: string;
  lead: Lead;
}
interface IndexFile {
  version: 1;
  entries: Record<string, IndexEntry>;
}

const PUT_OPTS = {
  access: "private" as const,
  contentType: "application/json",
  addRandomSuffix: false,
  allowOverwrite: true,
};

/** ETags can arrive quoted or weak depending on the path they came through. */
const normEtag = (etag: string) => etag.replace(/^W\//, "").replace(/"/g, "");

async function readJson<T>(pathname: string): Promise<{ data: T; etag: string } | null> {
  const res = await get(pathname, { access: "private", useCache: false });
  if (!res || res.statusCode !== 200 || !res.stream) return null;
  const text = await new Response(res.stream).text();
  return { data: JSON.parse(text) as T, etag: res.blob.etag };
}

async function readLead(pathname: string): Promise<Lead | null> {
  const r = await readJson<Lead>(pathname);
  return r?.data ?? null;
}

async function readIndex(): Promise<{ entries: Record<string, IndexEntry>; etag: string | null }> {
  try {
    const r = await readJson<IndexFile>(INDEX);
    if (r?.data?.entries && typeof r.data.entries === "object") {
      return { entries: r.data.entries, etag: r.etag };
    }
  } catch {
    /* missing or unreadable index: rebuilt below */
  }
  return { entries: {}, etag: null };
}

async function writeIndex(entries: Record<string, IndexEntry>, etag: string | null) {
  const body: IndexFile = { version: 1, entries };
  await put(INDEX, JSON.stringify(body), etag ? { ...PUT_OPTS, ifMatch: etag } : PUT_OPTS);
}

/**
 * Read-modify-write the index with optimistic concurrency. Never throws: the
 * lead files are the source of truth and list() repairs the index later.
 */
async function updateIndex(mutate: (entries: Record<string, IndexEntry>) => void) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const { entries, etag } = await readIndex();
      mutate(entries);
      await writeIndex(entries, etag);
      return;
    } catch (err) {
      if (err instanceof BlobPreconditionFailedError) continue; // someone else wrote first; retry
      console.warn("CRM index update failed:", err instanceof Error ? err.message : err);
      return;
    }
  }
  console.warn("CRM index: repeated write conflicts; list() will reconcile");
}

export const blobStore: LeadStore = {
  async list() {
    // 1. What files exist right now (one call per 1000 leads)
    const listing = new Map<string, string>(); // id → etag
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: PREFIX, limit: 1000, cursor });
      for (const b of page.blobs) {
        if (b.pathname === INDEX || !b.pathname.endsWith(".json")) continue;
        const id = idFrom(b.pathname);
        if (isSafeId(id)) listing.set(id, normEtag(b.etag));
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);

    // 2. Cached copies
    const { entries, etag } = await readIndex();
    let changed = false;

    for (const id of Object.keys(entries)) {
      if (!listing.has(id)) {
        delete entries[id];
        changed = true;
      }
    }

    // 3. Re-read only files that are new or whose etag moved
    const stale = [...listing].filter(([id, tag]) => normEtag(entries[id]?.etag ?? "") !== tag);
    const BATCH = 20;
    for (let i = 0; i < stale.length; i += BATCH) {
      await Promise.all(
        stale.slice(i, i + BATCH).map(async ([id, tag]) => {
          try {
            const lead = await readLead(pathFor(id));
            if (lead) {
              entries[id] = { etag: tag, lead };
              changed = true;
            }
          } catch {
            /* skip this one for now */
          }
        }),
      );
    }

    if (changed) {
      try {
        await writeIndex(entries, etag);
      } catch (err) {
        if (!(err instanceof BlobPreconditionFailedError)) {
          console.warn("CRM index refresh failed:", err instanceof Error ? err.message : err);
        }
      }
    }

    return Object.values(entries).map((e) => e.lead);
  },

  async get(id) {
    if (!isSafeId(id)) return null;
    try {
      return await readLead(pathFor(id));
    } catch {
      return null;
    }
  },

  async put(lead) {
    const res = await put(pathFor(lead.id), JSON.stringify(lead), PUT_OPTS);
    await updateIndex((entries) => {
      entries[lead.id] = { etag: normEtag(res.etag), lead };
    });
  },

  async remove(id) {
    if (!isSafeId(id)) return;
    await del(pathFor(id));
    await updateIndex((entries) => {
      delete entries[id];
    });
  },
};
