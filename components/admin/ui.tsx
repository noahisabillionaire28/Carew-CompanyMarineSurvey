import type { ReactNode } from "react";
import { SOURCE_LABELS, statusMeta } from "@/lib/crm/config";
import type { LeadSource, LeadStatus } from "@/lib/crm/types";

export const inputClass =
  "mt-1.5 block w-full rounded-xl border border-border bg-white px-4 py-3 text-base text-text placeholder:text-muted/70 focus:border-babyblue focus:outline-none focus:ring-3 focus:ring-babyblue";
export const labelClass = "block text-sm font-semibold text-navy";
export const cardClass = "rounded-2xl border border-border bg-white shadow-sm";
export const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-navy-light active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transform-none";
export const secondaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 py-2.5 text-sm font-semibold text-navy shadow-sm transition-colors hover:border-babyblue hover:bg-babyblue-light disabled:cursor-not-allowed disabled:opacity-60";

export function StatusPill({ status, className = "" }: { status: LeadStatus; className?: string }) {
  const m = statusMeta(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${m.pill} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${m.value === "scheduled" ? "bg-babyblue" : m.dot}`}
      />
      {m.label}
    </span>
  );
}

export function SourceBadge({ source }: { source: LeadSource }) {
  return (
    <span className="inline-flex whitespace-nowrap rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-muted">
      {SOURCE_LABELS[source]}
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-navy sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`${cardClass} p-4 sm:p-5 ${className}`}>
      {(title || action) && (
        <header className="mb-3 flex items-center justify-between gap-3">
          {title && (
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{title}</h2>
          )}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className={`${cardClass} px-6 py-12 text-center`}>
      <p className="font-heading text-lg font-bold text-navy">{title}</p>
      {body && <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{body}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

/** Label + value pair used on the lead detail page. */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm text-text">{children}</dd>
    </div>
  );
}
