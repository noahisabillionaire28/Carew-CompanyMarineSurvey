import { NextResponse } from "next/server";
import { z } from "zod";
import { errors, json, readJson, staffOrError } from "@/lib/crm/api";
import { addNote } from "@/lib/crm/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const noteSchema = z.object({ body: z.string().trim().min(1, "Write something first.").max(2000) });

export async function POST(req: Request, { params }: Ctx) {
  const auth = await staffOrError(req);
  if (auth instanceof NextResponse) return auth;

  const parsed = noteSchema.safeParse(await readJson(req));
  if (!parsed.success) return errors.invalid(parsed.error.issues[0]?.message);

  const { id } = await params;
  const lead = await addNote(id, auth, parsed.data.body);
  if (!lead) return errors.notFound();
  return json({ ok: true, lead }, 201);
}
