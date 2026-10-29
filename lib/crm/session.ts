/**
 * Signed session tokens using Web Crypto only, so the same code runs in
 * Edge middleware and in Node route handlers.
 *
 * Token = base64url(JSON payload) + "." + base64url(HMAC-SHA256(payload))
 */

export interface Session {
  /** username */
  u: string;
  /** display name */
  n: string;
  /** expiry, unix seconds */
  exp: number;
}

const enc = new TextEncoder();
const dec = new TextDecoder();

function toB64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(str: string): Uint8Array<ArrayBuffer> {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (str.length % 4)) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signSession(session: Session, secret: string): Promise<string> {
  if (!secret) throw new Error("SESSION_SECRET is not set");
  const payload = toB64url(enc.encode(JSON.stringify(session)));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(secret), enc.encode(payload));
  return `${payload}.${toB64url(new Uint8Array(sig))}`;
}

/** Returns the session when the signature is valid and it has not expired; otherwise null. */
export async function verifySession(
  token: string | undefined | null,
  secret: string,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): Promise<Session | null> {
  if (!token || !secret) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  let valid = false;
  try {
    valid = await crypto.subtle.verify("HMAC", await hmacKey(secret), fromB64url(sig), enc.encode(payload));
  } catch {
    return null;
  }
  if (!valid) return null;

  try {
    const s = JSON.parse(dec.decode(fromB64url(payload))) as Partial<Session>;
    if (typeof s.u !== "string" || typeof s.n !== "string" || typeof s.exp !== "number") return null;
    if (s.exp <= nowSeconds) return null;
    return { u: s.u, n: s.n, exp: s.exp };
  } catch {
    return null;
  }
}
