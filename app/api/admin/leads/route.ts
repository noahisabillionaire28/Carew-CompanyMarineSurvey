import { NextResponse } from "next/server";
import { errors, json, readJson, staffOrError } from "@/lib/crm/api";
import { createLead, listLeads } from "@/lib/crm/store";
import { leadInputSchema } from "@/lib/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** All leads, newest first. */
export async function GET(req: Request) {
  const auth = await staffOrError(req);
  if (auth instanceof NextResponse) return auth;
  const leads = await listLeads();
  return json({ ok: true, leads });
}

/** Manual lead entry (phone calls, walk-ins). */
export async function POST(req: Request) {
  const auth = await staffOrError(req);
  if (auth instanceof NextResponse) return auth;

  const parsed = leadInputSchema.safeParse(await readJson(req));
  if (!parsed.success) return errors.invalid();

  const lead = await createLead(parsed.data, "manual", auth);
  return json({ ok: true, id: lead.id }, 201);
}
