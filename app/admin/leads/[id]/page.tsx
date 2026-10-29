import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import DeleteLeadButton from "@/components/admin/DeleteLeadButton";
import NoteForm from "@/components/admin/NoteForm";
import StatusActions from "@/components/admin/StatusActions";
import { Card, Field, SourceBadge, StatusPill } from "@/components/admin/ui";
import { requireStaff } from "@/lib/crm/auth";
import { statusMeta } from "@/lib/crm/config";
import { formatDateTime, formatPlainDate } from "@/lib/crm/format";
import { getLead } from "@/lib/crm/store";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  const telHref = `tel:${lead.phone.replace(/[^\d+]/g, "")}`;
  const history = [...lead.statusHistory].reverse();
  const notes = [...lead.notes].reverse();

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-navy"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        All leads
      </Link>

      <header className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            {lead.name}
          </h1>
          <p className="text-muted">{lead.company}</p>
          <p className="mt-1 text-xs text-muted">
            Submitted {formatDateTime(lead.createdAt)}
            {lead.createdBy ? ` by ${lead.createdBy}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SourceBadge source={lead.source} />
          <StatusPill status={lead.status} />
        </div>
      </header>

      <div className="mt-5 grid gap-4 lg:grid-cols-3 lg:gap-5">
        <div className="space-y-4 lg:col-span-2 lg:space-y-5">
          <Card title="Contact">
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={telHref}
                className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-navy transition-colors hover:border-babyblue hover:bg-babyblue-light"
              >
                <Phone size={18} aria-hidden="true" />
                <span className="font-semibold">{lead.phone}</span>
              </a>
              <a
                href={`mailto:${lead.email}`}
                className="flex min-w-0 items-center gap-3 rounded-xl border border-border px-4 py-3 text-navy transition-colors hover:border-babyblue hover:bg-babyblue-light"
              >
                <Mail size={18} aria-hidden="true" className="shrink-0" />
                <span className="truncate font-semibold">{lead.email}</span>
              </a>
            </div>
          </Card>

          <Card title="Request">
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field label="Service">{lead.service}</Field>
              <Field label="Equipment">{lead.equipment}</Field>
              <Field label="Location">{lead.location}</Field>
              <Field label="Units">{lead.units !== undefined ? lead.units : "—"}</Field>
              <Field label="Preferred date">{formatPlainDate(lead.preferredDate) || "—"}</Field>
              <div className="sm:col-span-2">
                <Field label="Message">
                  {lead.message ? (
                    <span className="whitespace-pre-line">{lead.message}</span>
                  ) : (
                    "—"
                  )}
                </Field>
              </div>
            </dl>
          </Card>

          <Card title={`Notes (${lead.notes.length})`}>
            {notes.length === 0 ? (
              <p className="text-sm text-muted">No notes yet. Keep track of calls and quotes here.</p>
            ) : (
              <ul className="space-y-3">
                {notes.map((n) => (
                  <li key={n.id} className="rounded-xl bg-babyblue-light/60 px-4 py-3">
                    <p className="whitespace-pre-line text-sm text-text">{n.body}</p>
                    <p className="mt-1.5 text-xs text-muted">
                      {n.author} · {formatDateTime(n.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <NoteForm leadId={lead.id} />
          </Card>
        </div>

        <div className="space-y-4 lg:space-y-5">
          <Card title="Status">
            <StatusActions id={lead.id} status={lead.status} />
          </Card>

          <Card title="History">
            <ol className="space-y-3">
              {history.map((h, i) => {
                const m = statusMeta(h.status);
                return (
                  <li key={`${h.at}-${i}`} className="flex gap-3 text-sm">
                    <span
                      aria-hidden="true"
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${m.dot}`}
                    />
                    <div>
                      <p className="font-semibold text-navy">{m.label}</p>
                      <p className="text-xs text-muted">
                        {formatDateTime(h.at)} · {h.by}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>

          <div className="pt-2">
            <DeleteLeadButton id={lead.id} name={lead.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
