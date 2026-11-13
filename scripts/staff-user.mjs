#!/usr/bin/env node
/**
 * Prints one STAFF_USERS entry for the staff CRM.
 *
 *   node scripts/staff-user.mjs "Stanley Carew" stanley
 *
 * You are prompted for the password (it is not echoed and never lands in
 * your shell history). Paste the printed object into the STAFF_USERS JSON
 * array in Vercel (Settings → Environment Variables), then redeploy.
 *
 * To make a SESSION_SECRET:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */
import { randomBytes, scryptSync } from "node:crypto";
import { stdin, stdout, stderr } from "node:process";

const [name, username] = process.argv.slice(2);

if (!name || !username || process.argv.length > 4) {
  stderr.write('Usage: node scripts/staff-user.mjs "Full Name" username\n');
  stderr.write("The password is asked for interactively (or piped on stdin).\n");
  process.exit(1);
}
if (!/^[a-z0-9._-]{2,32}$/i.test(username)) {
  stderr.write("Username: 2–32 letters, numbers, dots, dashes or underscores.\n");
  process.exit(1);
}

function readPassword() {
  return new Promise((resolve) => {
    let data = "";
    if (stdin.isTTY) {
      stderr.write(`Password for ${username}: `);
      stdin.setRawMode(true);
      stdin.resume();
      stdin.setEncoding("utf8");
      stdin.on("data", (ch) => {
        for (const c of ch) {
          if (c === "\r" || c === "\n" || c === "\u0004") {
            stdin.setRawMode(false);
            stdin.pause();
            stderr.write("\n");
            resolve(data);
            return;
          }
          if (c === "\u0003") process.exit(130); // Ctrl+C
          if (c === "\u007f" || c === "\b") data = data.slice(0, -1);
          else data += c;
        }
      });
    } else {
      stdin.setEncoding("utf8");
      stdin.on("data", (c) => (data += c));
      stdin.on("end", () => resolve(data.replace(/\r?\n$/, "")));
    }
  });
}

const password = await readPassword();
if (password.length < 8) {
  stderr.write("Password must be at least 8 characters.\n");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = `scrypt$${salt}$${scryptSync(password, salt, 64).toString("hex")}`;

stdout.write(JSON.stringify({ name, username, hash }) + "\n");
