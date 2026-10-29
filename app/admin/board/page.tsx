import Board from "@/components/admin/Board";
import StorageBanner from "@/components/admin/StorageBanner";
import { PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/crm/auth";
import { toRow } from "@/lib/crm/rows";
import { listLeads } from "@/lib/crm/store";

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  await requireStaff();
  const leads = await listLeads();
  const now = Date.now();
  const rows = leads.map((l) => toRow(l, now));

  return (
    <>
      <PageHeader
        title="Board"
        subtitle="Swipe sideways on a phone. Use the dropdown on a card to move it."
      />
      <StorageBanner />
      <Board rows={rows} />
    </>
  );
}
