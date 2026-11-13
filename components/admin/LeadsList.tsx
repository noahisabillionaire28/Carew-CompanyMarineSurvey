"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { STATUSES } from "@/lib/crm/config";
import type { LeadRow } from "@/lib/crm/rows";
import type { LeadStatus } from "@/lib/crm/types";
import { EmptyState, SourceBadge, StatusPill, inputClass, primaryBtn } from "./ui";

type StatusFilter = "all" | LeadStatus;

export default function LeadsList({ rows }: { rows: LeadRow[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [service, setService] = useState("all");

  const services = useMemo(
    () => [...new Set(rows.map((r) => r.service))].sort((a, b) => a.localeCompare(b)),
    [rows],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (service !== "all" && r.service !== service) return false;
      if (!q) return true;
      return [r.name, r.company, r.email, r.phone, r.service, r.equipment, r.location]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [rows, query, status, service]);

  if (rows.length === 0) {
    return (
      <EmptyState
        title="No leads yet"
        body="Requests from the website show up here automatically. You can also add a phone-call lead by hand."
        action={
          <Link href="/admin/new" className={primaryBtn}>
            Add a lead
          </Link>
        }
      />
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search leads</span>
          <Search
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, company, email, phone"
            className={`${inputClass} mt-0 pl-11`}
          />
        </label>
        <label className="sm:w-64">
          <span className="sr-only">Filter by service</span>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className={`${inputClass} mt-0`}
          >
            <option value="all">All services</option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        role="group"
        aria-label="Filter by status"
        className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        <Chip active={status === "all"} onClick={() => setStatus("all")}>
          All <Count n={counts.all} />
        </Chip>
        {STATUSES.map((s) => (
          <Chip key={s.value} active={status === s.value} onClick={() => setStatus(s.value)}>
            <span aria-hidden="true" className={`h-2 w-2 rounded-full ${s.dot}`} />
            {s.label} <Count n={counts[s.value] ?? 0} />
          </Chip>
        ))}
      </div>

      <p className="mt-3 text-sm text-muted" aria-live="polite">
        Showing {filtered.length} of {rows.length}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-3">
          <EmptyState title="No matches" body="Try a different search or clear the filters." />
        </div>
      ) : (
        <>
          {/* Phones: cards */}
          <ul className="mt-3 space-y-3 md:hidden">
            {filtered.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/admin/leads/${r.id}`}
                  className="block rounded-2xl border border-border bg-white p-4 shadow-sm transition-colors active:bg-babyblue-light"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-navy">{r.name}</p>
                      <p className="truncate text-sm text-muted">{r.company}</p>
                    </div>
                    <StatusPill status={r.status} />
                  </div>
                  <p className="mt-3 text-sm text-text">{r.service}</p>
                  <p className="text-xs text-muted">
                    {r.equipment} · {r.location}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted">
                    <span>{r.ago}</span>
                    <SourceBadge source={r.source} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop: table */}
          <div className="mt-3 hidden overflow-hidden rounded-2xl border border-border bg-white shadow-sm md:block">
            <table className="w-full text-sm">
              <thead className="bg-babyblue-light/60 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Equipment · Location</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">
                    <span className="sr-only">Open</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-babyblue-light/40">
                    <td className="px-4 py-3 align-top">
                      <Link
                        href={`/admin/leads/${r.id}`}
                        className="font-semibold text-navy hover:underline"
                      >
                        {r.name}
                      </Link>
                      <p className="text-muted">{r.company}</p>
                    </td>
                    <td className="px-4 py-3 align-top text-text">{r.service}</td>
                    <td className="px-4 py-3 align-top">
                      <p className="text-text">{r.equipment}</p>
                      <p className="text-muted">{r.location}</p>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <p className="whitespace-nowrap text-text">{r.when}</p>
                      <p className="flex items-center gap-2 text-xs text-muted">
                        {r.ago} <SourceBadge source={r.source} />
                      </p>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <StatusPill status={r.status} />
                    </td>
                    <td className="px-4 py-3 text-right align-top">
                      <Link
                        href={`/admin/leads/${r.id}`}
                        aria-label={`Open ${r.name}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-navy hover:bg-babyblue-light"
                      >
                        <ChevronRight size={18} aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? "border-navy bg-navy text-white"
          : "border-border bg-white text-navy hover:border-babyblue hover:bg-babyblue-light"
      }`}
    >
      {children}
    </button>
  );
}

function Count({ n }: { n: number }) {
  return <span className="opacity-70">{n}</span>;
}
