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

// ---- Failed-login throttle (per server instance; cheap defence against scripted guessing) ----
type Bucket = { count: number; resetAt: number };
const WINDOW_MS = 15 * 60_000;
const IP_MAX = 10; // failures per IP per window
const USER_MAX = 30; // failures per username per window
const failures = new Map<string, Bucket>();

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function bucket(key: string): Bucket {
  const now = Date.now();
  let b = failures.get(key);
  if (!b || b.resetAt <= now) {
    b = { count: 0, resetAt: now + WINDOW_MS };
    failures.set(key, b);
  }
  if (failures.size > 2000) {
    for (const [k, v] of failures) if (v.resetAt <= now) failures.delete(k);
  }
  return b;
}

function blockedUntil(req: Request, username: string): number | null {
  const ip = bucket(`ip:${clientIp(req)}`);
  const user = bucket(`user:${username.trim().toLowerCase()}`);
  if (ip.count >= IP_MAX) return ip.resetAt;
  if (user.count >= USER_MAX) return user.resetAt;
  return null;
}

function recordFailure(req: Request, username: string) {
  bucket(`ip:${clientIp(req)}`).count++;
  bucket(`user:${username.trim().toLowerCase()}`).count++;
}

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

  const until = blockedUntil(req, username);
  if (until) {
    const minutes = Math.max(1, Math.ceil((until - Date.now()) / 60_000));
    return NextResponse.json(
      { ok: false, error: `Too many attempts. Try again in ${minutes} min.` },
      { status: 429, headers: { "Retry-After": String(minutes * 60) } },
    );
  }

  const staff = authenticate(username, password);
  if (!staff) {
    recordFailure(req, username);
    await sleep(600);
    return json({ ok: false, error: "Wrong username or password." }, 401);
  }

  const token = await createSessionToken(staff);
  const res = NextResponse.json({ ok: true, name: staff.name });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(isSecureRequest(req)));
  return res;
}
