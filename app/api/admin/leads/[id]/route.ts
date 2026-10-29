import { NextResponse } from "next/server";
import { z } from "zod";
import { errors, json, readJson, staffOrError } from "@/lib/crm/api";
import { STATUS_VALUES } from "@/lib/crm/config";
import { deleteLead, getLead, updateStatus } from "@/lib/crm/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({ status: z.enum(STATUS_VALUES) });

export async function GET(req: Request, { params }: Ctx) {
  const auth = await staffOrError(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) return errors.notFound();
  return json({ ok: true, lead });
}

/** Change status. */
export async function PATCH(req: Request, { params }: Ctx) {
  const auth = await staffOrError(req);
  if (auth instanceof NextResponse) return auth;

  const parsed = patchSchema.safeParse(await readJson(req));
  if (!parsed.success) return errors.invalid("Unknown status.");

  const { id } = await params;
  const lead = await updateStatus(id, parsed.data.status, auth);
  if (!lead) return errors.notFound();
  return json({ ok: true, lead });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const auth = await staffOrError(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const removed = await deleteLead(id);
  if (!removed) return errors.notFound();
  return json({ ok: true });
}
