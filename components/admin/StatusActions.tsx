"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { STATUSES } from "@/lib/crm/config";
import type { LeadStatus } from "@/lib/crm/types";

export default function StatusActions({ id, status }: { id: string; status: LeadStatus }) {
  const router = useRouter();
  const [current, setCurrent] = useState<LeadStatus>(status);
  const [pending, setPending] = useState<LeadStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function set(next: LeadStatus) {
    if (next === current || pending) return;
    setError(null);
    setPending(next);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("failed");
      setCurrent(next);
      router.refresh();
    } catch {
      setError("Could not update the status. Please try again.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div>
      <ul className="space-y-2">
        {STATUSES.map((s) => {
          const active = s.value === current;
          return (
            <li key={s.value}>
              <button
                type="button"
                onClick={() => set(s.value)}
                disabled={pending !== null}
                aria-pressed={active}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors disabled:cursor-wait ${
                  active
                    ? `${s.pill} ring-2 ring-babyblue ring-offset-1`
                    : "border-border bg-white text-navy hover:border-babyblue hover:bg-babyblue-light"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${active && s.value === "scheduled" ? "bg-babyblue" : s.dot}`}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{s.label}</span>
                  <span className="block text-xs opacity-75">{s.description}</span>
                </span>
                {pending === s.value ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : active ? (
                  <Check size={16} aria-hidden="true" />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
