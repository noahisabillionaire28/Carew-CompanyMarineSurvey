"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteLeadButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    if (!window.confirm(`Delete the lead for ${name}? This cannot be undone.`)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Could not delete. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={remove}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60"
      >
        {busy ? (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          <Trash2 size={16} aria-hidden="true" />
        )}
        Delete lead
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
