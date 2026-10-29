/**
 * Local filesystem adapter, used when BLOB_READ_WRITE_TOKEN is not set
 * (local development and tests). Files live in .crm-data/leads/ (gitignored).
 *
 * Note: on Vercel the filesystem is temporary, so this adapter must not be
 * relied on in production.
 */
import { mkdir, readdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Lead } from "../types";
import { isSafeId, type LeadStore } from "./types";

const DIR = path.join(process.cwd(), ".crm-data", "leads");
const fileFor = (id: string) => path.join(DIR, `${id}.json`);

async function ensureDir() {
  await mkdir(DIR, { recursive: true });
}

export const fsStore: LeadStore = {
  async list() {
    await ensureDir();
    const names = (await readdir(DIR)).filter((n) => n.endsWith(".json"));
    const leads = await Promise.all(
      names.map(async (n) => {
        try {
          return JSON.parse(await readFile(path.join(DIR, n), "utf8")) as Lead;
        } catch {
          return null;
        }
      }),
    );
    return leads.filter((l): l is Lead => l !== null);
  },

  async get(id) {
    if (!isSafeId(id)) return null;
    try {
      return JSON.parse(await readFile(fileFor(id), "utf8")) as Lead;
    } catch {
      return null;
    }
  },

  async put(lead) {
    await ensureDir();
    const target = fileFor(lead.id);
    const tmp = `${target}.tmp`;
    await writeFile(tmp, JSON.stringify(lead, null, 2), "utf8");
    await rename(tmp, target);
  },

  async remove(id) {
    if (!isSafeId(id)) return;
    try {
      await unlink(fileFor(id));
    } catch {
      /* already gone */
    }
  },
};
