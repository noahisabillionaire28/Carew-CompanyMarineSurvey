/** Helpers shared by the /api/admin route handlers. */
import { NextResponse } from "next/server";
import { getStaff } from "./auth";
import type { Staff } from "./types";

/** Reject cross-site requests even if a cookie somehow rides along. */
export function sameOrigin(req: Request): boolean {
  const site = req.headers.get("sec-fetch-site");
  return !site || site === "same-origin" || site === "none";
}

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export const errors = {
  forbidden: () => json({ ok: false, error: "Forbidden" }, 403),
  unauthorized: () => json({ ok: false, error: "Please log in again." }, 401),
  notFound: () => json({ ok: false, error: "Not found" }, 404),
  invalid: (message = "Please check the fields.") => json({ ok: false, error: message }, 400),
};

/**
 * Returns the signed-in staff member, or a ready-to-return error response.
 * Usage: const auth = await staffOrError(req); if (auth instanceof NextResponse) return auth;
 */
export async function staffOrError(req: Request): Promise<Staff | NextResponse> {
  if (!sameOrigin(req)) return errors.forbidden();
  const staff = await getStaff();
  if (!staff) return errors.unauthorized();
  return staff;
}

export async function readJson(req: Request): Promise<unknown | undefined> {
  try {
    return await req.json();
  } catch {
    return undefined;
  }
}
