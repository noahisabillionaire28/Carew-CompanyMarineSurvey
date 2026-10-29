import { Info } from "lucide-react";
import { storageMode } from "@/lib/crm/store";

/**
 * Shown on Vercel when no private Blob store is connected yet. Without it the
 * serverless filesystem is used, which does not keep data between requests.
 */
export default function StorageBanner() {
  if (storageMode() === "blob") return null;
  if (process.env.VERCEL !== "1") return null;

  return (
    <div
      role="alert"
      className="mb-5 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
    >
      <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      <p>
        <strong>Lead storage is not connected, so leads are not being saved.</strong> In Vercel open
        the project, then Storage, Create, Blob. Choose Private, connect it to this project, and
        redeploy.
      </p>
    </div>
  );
}
