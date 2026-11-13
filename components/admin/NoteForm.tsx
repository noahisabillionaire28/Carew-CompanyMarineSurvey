"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { inputClass, primaryBtn } from "./ui";

export default function NoteForm({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (!text) {
      setError("Write something first.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text }),
      });
      if (!res.ok) throw new Error("failed");
      setBody("");
      router.refresh();
    } catch {
      setError("Could not save the note. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4">
      <label htmlFor="note" className="sr-only">
        Add a note
      </label>
      <textarea
        id="note"
        rows={3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={2000}
        placeholder="Called and left a voicemail, quoted $…, waiting on their PO…"
        className={`${inputClass} mt-0`}
      />
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="mt-3 flex justify-end">
        <button type="submit" disabled={busy} className={primaryBtn}>
          {busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          Add note
        </button>
      </div>
    </form>
  );
}
