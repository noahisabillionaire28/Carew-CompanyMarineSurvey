import { NextResponse } from "next/server";
import { isSecureRequest, sessionCookieOptions } from "@/lib/crm/auth";
import { SESSION_COOKIE } from "@/lib/crm/config";
import { errors, sameOrigin } from "@/lib/crm/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return errors.forbidden();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(isSecureRequest(req)), maxAge: 0 });
  return res;
}
