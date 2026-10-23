import { existsSync } from "node:fs";
import { join } from "node:path";

/** True if a file exists under /public (checked at build time, server only). */
export function publicFileExists(publicPath: string): boolean {
  if (!publicPath) return false;
  return existsSync(join(process.cwd(), "public", publicPath.replace(/^\//, "")));
}
