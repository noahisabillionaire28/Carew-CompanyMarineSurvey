import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import LoginForm from "@/components/admin/LoginForm";
import { cardClass } from "@/components/admin/ui";
import { getStaff, isAuthConfigured } from "@/lib/crm/auth";
import { BRAND } from "@/lib/crm/config";

export const dynamic = "force-dynamic";

function safeNext(value: string | undefined): string {
  return value && /^\/admin(\/[\w\-/]*)?$/.test(value) ? value : "/admin";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (await getStaff()) redirect("/admin");
  const { next } = await searchParams;

  return (
    <div className="mx-auto w-full max-w-md pt-6 sm:pt-14">
      <div className="flex flex-col items-center text-center">
        <LogoMark size={56} className="rounded-[14px]" />
        <h1 className="mt-4 font-heading text-2xl font-bold tracking-tight text-navy sm:text-3xl">
          Staff login
        </h1>
        <p className="mt-1 text-sm text-muted">{BRAND.name}</p>
      </div>

      <div className={`${cardClass} mt-6 p-6 sm:p-8`}>
        <LoginForm next={safeNext(next)} configured={isAuthConfigured()} />
      </div>

      <p className="mt-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-navy"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to the website
        </Link>
      </p>
    </div>
  );
}
