/**
 * Staff accounts and sessions. Node runtime only (uses node:crypto and next/headers).
 *
 * STAFF_USERS   JSON array of { name, username, hash } — generate entries with
 *               node scripts/staff-user.mjs "Full Name" username "password"
 * SESSION_SECRET  32+ random bytes as hex — signs the session cookie
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { SESSION_COOKIE, SESSION_DAYS } from "./config";
import { signSession, verifySession } from "./session";
import type { Staff } from "./types";

export interface StaffUser extends Staff {
  hash: string;
}

// Used when the username doesn't exist so the timing matches a real check.
const DUMMY_HASH = `scrypt$${"0".repeat(32)}$${"0".repeat(128)}`;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const key = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${key}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [algo, salt, key] = stored.split("$");
  if (algo !== "scrypt" || !salt || !key) return false;
  const expected = Buffer.from(key, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function getStaffUsers(): StaffUser[] {
  const raw = process.env.STAFF_USERS;
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (u): u is StaffUser =>
        typeof u === "object" &&
        u !== null &&
        typeof (u as StaffUser).username === "string" &&
        typeof (u as StaffUser).name === "string" &&
        typeof (u as StaffUser).hash === "string",
    );
  } catch {
    return [];
  }
}

export function sessionSecret(): string {
  return process.env.SESSION_SECRET ?? "";
}

/** True when the CRM has what it needs to log anyone in. */
export function isAuthConfigured(): boolean {
  return sessionSecret().length >= 16 && getStaffUsers().length > 0;
}

export function authenticate(username: string, password: string): Staff | null {
  const wanted = username.trim().toLowerCase();
  const user = getStaffUsers().find((u) => u.username.toLowerCase() === wanted);
  const ok = verifyPassword(password, user?.hash ?? DUMMY_HASH);
  if (!user || !ok) return null;
  return { username: user.username, name: user.name };
}

export async function createSessionToken(staff: Staff): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_DAYS * 86400;
  return signSession({ u: staff.username, n: staff.name, exp }, sessionSecret());
}

export function sessionCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  };
}

/** Whether the incoming request arrived over HTTPS (direct or via Vercel's proxy). */
export function isSecureRequest(req: Request): boolean {
  const proto = req.headers.get("x-forwarded-proto");
  if (proto) return proto.split(",")[0].trim() === "https";
  return new URL(req.url).protocol === "https:";
}

/** The logged-in staff member, or null. Safe to call from pages, layouts and route handlers. */
export async function getStaff(): Promise<Staff | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token, sessionSecret());
  if (!session) return null;
  // Accounts removed from STAFF_USERS lose access immediately.
  const user = getStaffUsers().find((u) => u.username === session.u);
  if (!user) return null;
  return { username: user.username, name: user.name };
}

/** For pages: redirect to the login screen when not signed in. */
export async function requireStaff(): Promise<Staff> {
  const staff = await getStaff();
  if (!staff) redirect("/admin/login");
  return staff;
}
