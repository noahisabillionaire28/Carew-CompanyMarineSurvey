import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { BRAND } from "@/lib/crm/config";
import type { Staff } from "@/lib/crm/types";
import AdminNav from "./AdminNav";
import LogoutButton from "./LogoutButton";

export default function AdminHeader({ staff }: { staff: Staff }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/admin" className="inline-flex items-center gap-3 rounded-md" aria-label="Staff home">
          <LogoMark size={36} className="rounded-[9px]" />
          <span className="flex flex-col leading-none">
            <span className="font-heading text-lg font-extrabold tracking-tight text-navy">
              {BRAND.short} Staff
            </span>
            <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted">
              Lead tracker
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted sm:inline">{staff.name}</span>
          <LogoutButton />
        </div>
      </div>
      <AdminNav />
    </header>
  );
}
