import { NextResponse } from "next/server";
import { staffOrError } from "@/lib/crm/api";
import { leadsToCsv } from "@/lib/crm/csv";
import { listLeads } from "@/lib/crm/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Download every lead as a CSV file. */
export async function GET(req: Request) {
  const auth = await staffOrError(req);
  if (auth instanceof NextResponse) return auth;

  const leads = await listLeads();
  const csv = leadsToCsv(leads);
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ccms-leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
