import { NextResponse } from "next/server";
import {
  authenticate,
  createSessionToken,
  isAuthConfigured,
  isSecureRequest,
  sessionCookieOptions,
} from "@/lib/crm/auth";
import { SESSION_COOKIE } from "@/lib/crm/config";
import { errors, json, readJson, sameOrigin } from "@/lib/crm/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: Request) {
  if (!sameOrigin(req)) return errors.forbidden();

  if (!isAuthConfigured()) {
    return json({ ok: false, error: "Staff login is not set up yet." }, 503);
  }

  const body = (await readJson(req)) as { username?: unknown; password?: unknown } | undefined;
  const username = typeof body?.username === "string" ? body.username : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!username || !password || username.length > 64 || password.length > 256) {
    await sleep(600);
    return json({ ok: false, error: "Wrong username or password." }, 401);
  }

  const staff = authenticate(username, password);
  if (!staff) {
    await sleep(600);
    return json({ ok: false, error: "Wrong username or password." }, 401);
  }

  const token = await createSessionToken(staff);
  const res = NextResponse.json({ ok: true, name: staff.name });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(isSecureRequest(req)));
  return res;
}
