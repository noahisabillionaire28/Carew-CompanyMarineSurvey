import StorageBanner from "@/components/admin/StorageBanner";
import { Card, PageHeader, StatusPill, cardClass } from "@/components/admin/ui";
import { requireStaff } from "@/lib/crm/auth";
import { STATUSES } from "@/lib/crm/config";
import { computeStats, formatHours, type CountRow } from "@/lib/crm/stats";
import { listLeads } from "@/lib/crm/store";

export const dynamic = "force-dynamic";

function Tile({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className={`${cardClass} p-4 sm:p-5`}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-1 font-heading text-3xl font-extrabold tracking-tight text-navy">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function Breakdown({ title, rows, total }: { title: string; rows: CountRow[]; total: number }) {
  return (
    <Card title={title}>
      {rows.length === 0 ? (
        <p className="text-sm text-muted">No data yet.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => {
            const pct = total ? Math.round((r.count / total) * 100) : 0;
            return (
              <li key={r.label}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-text">{r.label}</span>
                  <span className="shrink-0 font-semibold text-navy">
                    {r.count} <span className="font-normal text-muted">({pct}%)</span>
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-babyblue-light">
                  <div className="h-1.5 rounded-full bg-navy" style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

export default async function StatsPage() {
  await requireStaff();
  const leads = await listLeads();
  const s = computeStats(leads);
  const maxMonth = Math.max(1, ...s.months.map((m) => m.count));

  return (
    <>
      <PageHeader title="Stats" subtitle="Everything that has come through the website and by phone." />
      <StorageBanner />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <Tile label="Total leads" value={s.total} hint={`${s.bySource.website} website · ${s.bySource.manual} phone`} />
        <Tile label="Open" value={s.open} hint="New, contacted or scheduled" />
        <Tile label="This month" value={s.thisMonth} />
        <Tile label="Last 30 days" value={s.last30Days} />
        <Tile
          label="First response"
          value={formatHours(s.response.medianHours)}
          hint={
            s.response.sample
              ? `Median · avg ${formatHours(s.response.averageHours)} · ${s.response.sample} leads`
              : "No responses logged yet"
          }
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:gap-5">
        <Card title="Pipeline">
          <ul className="space-y-3">
            {STATUSES.map((st) => {
              const n = s.byStatus[st.value];
              const pct = s.total ? Math.round((n / s.total) * 100) : 0;
              return (
                <li key={st.value} className="flex items-center gap-3">
                  <StatusPill status={st.value} className="w-28 justify-center" />
                  <div className="h-2 flex-1 rounded-full bg-babyblue-light">
                    <div className={`h-2 rounded-full ${st.dot}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-right text-sm font-semibold text-navy">{n}</span>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card title="Requests per month">
          <div className="flex h-44 items-end gap-1.5 sm:gap-2">
            {s.months.map((m) => (
              <div key={m.key} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="text-[10px] font-semibold text-navy">{m.count || ""}</span>
                <div
                  className="w-full rounded-t-md bg-navy transition-[height]"
                  style={{ height: `${Math.max(m.count ? 6 : 2, (m.count / maxMonth) * 100)}%` }}
                  title={`${m.label}: ${m.count}`}
                />
                <span className="text-[10px] text-muted">{m.label.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3 lg:gap-5">
        <Breakdown title="By service" rows={s.byService} total={s.total} />
        <Breakdown title="By equipment" rows={s.byEquipment} total={s.total} />
        <Breakdown title="By location" rows={s.byLocation} total={s.total} />
      </div>
    </>
  );
}
