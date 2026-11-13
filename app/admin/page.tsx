import Link from "next/link";
import { Download, Plus } from "lucide-react";
import LeadsList from "@/components/admin/LeadsList";
import StorageBanner from "@/components/admin/StorageBanner";
import { PageHeader, primaryBtn, secondaryBtn } from "@/components/admin/ui";
import { requireStaff } from "@/lib/crm/auth";
import { OPEN_STATUSES } from "@/lib/crm/config";
import { toRow } from "@/lib/crm/rows";
import { listLeads } from "@/lib/crm/store";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  await requireStaff();
  const leads = await listLeads();
  const now = Date.now();
  const rows = leads.map((l) => toRow(l, now));
  const open = leads.filter((l) => OPEN_STATUSES.includes(l.status)).length;

  return (
    <>
      <PageHeader
        title="Leads"
        subtitle={`${leads.length} total · ${open} open`}
        actions={
          <>
            <a href="/api/admin/export" className={secondaryBtn} download>
              <Download size={16} aria-hidden="true" />
              Export CSV
            </a>
            <Link href="/admin/new" className={primaryBtn}>
              <Plus size={16} aria-hidden="true" />
              New lead
            </Link>
          </>
        }
      />
      <StorageBanner />
      <LeadsList rows={rows} />
    </>
  );
}
