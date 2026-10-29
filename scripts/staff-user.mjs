#!/usr/bin/env node
/**
 * Prints one STAFF_USERS entry for the staff CRM.
 *
 *   node scripts/staff-user.mjs "Stanley Carew" stanley "their-password"
 *
 * Paste the printed object into the STAFF_USERS JSON array in Vercel
 * (Settings → Environment Variables), then redeploy.
 *
 * To make a SESSION_SECRET:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */
import { randomBytes, scryptSync } from "node:crypto";

const [name, username, password] = process.argv.slice(2);

if (!name || !username || !password) {
  console.error('Usage: node scripts/staff-user.mjs "Full Name" username "password"');
  process.exit(1);
}
if (!/^[a-z0-9._-]{2,32}$/i.test(username)) {
  console.error("Username: 2–32 letters, numbers, dots, dashes or underscores.");
  process.exit(1);
}
if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = `scrypt$${salt}$${scryptSync(password, salt, 64).toString("hex")}`;

console.log(JSON.stringify({ name, username, hash }));
