"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { STATUSES } from "@/lib/crm/config";
import type { LeadRow } from "@/lib/crm/rows";
import type { LeadStatus } from "@/lib/crm/types";
import { SourceBadge } from "./ui";

export default function Board({ rows }: { rows: LeadRow[] }) {
  const router = useRouter();
  // Optimistic status overrides, keyed by lead id, until the server re-renders.
  const [moved, setMoved] = useState<Record<string, LeadStatus>>({});
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const statusOf = (r: LeadRow) => moved[r.id] ?? r.status;

  async function move(id: string, status: LeadStatus) {
    setError(null);
    setMoved((m) => ({ ...m, [id]: status }));
    setPending(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("failed");
      router.refresh();
    } catch {
      setMoved((m) => {
        const next = { ...m };
        delete next[id];
        return next;
      });
      setError("Could not update that lead. Please try again.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div>
      {error && (
        <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
        {STATUSES.map((s) => {
          const column = rows.filter((r) => statusOf(r) === s.value);
          return (
            <section
              key={s.value}
              aria-label={s.label}
              className="w-[82vw] shrink-0 snap-start rounded-2xl border border-border bg-babyblue-light/50 p-3 sm:w-72 lg:w-auto"
            >
              <header className="flex items-center justify-between px-1 pb-3">
                <h2 className="flex items-center gap-2 text-sm font-bold text-navy">
                  <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
                  {s.label}
                </h2>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-muted">
                  {column.length}
                </span>
              </header>

              <ul className="space-y-3">
                {column.length === 0 && (
                  <li className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted">
                    Nothing here
                  </li>
                )}
                {column.map((r) => (
                  <li key={r.id} className="rounded-xl border border-border bg-white p-3 shadow-sm">
                    <Link href={`/admin/leads/${r.id}`} className="block">
                      <p className="font-semibold leading-tight text-navy">{r.name}</p>
                      <p className="text-xs text-muted">{r.company}</p>
                      <p className="mt-2 text-xs text-text">{r.service}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
                        <span>{r.ago}</span>
                        <SourceBadge source={r.source} />
                      </div>
                    </Link>
                    <label className="mt-3 block">
                      <span className="sr-only">Move {r.name} to</span>
                      <select
                        value={statusOf(r)}
                        disabled={pending === r.id}
                        onChange={(e) => move(r.id, e.target.value as LeadStatus)}
                        className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-xs font-medium text-navy focus:border-babyblue focus:outline-none focus:ring-2 focus:ring-babyblue disabled:opacity-60"
                      >
                        {STATUSES.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.value === statusOf(r) ? o.label : `Move to ${o.label}`}
                          </option>
                        ))}
                      </select>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
