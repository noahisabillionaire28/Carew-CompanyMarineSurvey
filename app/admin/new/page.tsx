import LeadForm from "@/components/admin/LeadForm";
import { Card, PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/crm/auth";

export const dynamic = "force-dynamic";

export default async function NewLeadPage() {
  await requireStaff();
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="New lead"
        subtitle="For requests that come in by phone or in person. Website requests are added automatically."
      />
      <Card>
        <LeadForm />
      </Card>
    </div>
  );
}
