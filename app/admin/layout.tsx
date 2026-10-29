import type { Metadata } from "next";
import AdminHeader from "@/components/admin/AdminHeader";
import { getStaff } from "@/lib/crm/auth";

export const metadata: Metadata = {
  title: "Staff",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const staff = await getStaff();
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-babyblue-light/60">
      {staff && <AdminHeader staff={staff} />}
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
