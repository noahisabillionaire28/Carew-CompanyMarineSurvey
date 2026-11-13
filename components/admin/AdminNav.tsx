"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, List, Plus, TrendingUp } from "lucide-react";

const tabs = [
  { href: "/admin", label: "Leads", icon: List },
  { href: "/admin/board", label: "Board", icon: LayoutGrid },
  { href: "/admin/new", label: "New lead", icon: Plus },
  { href: "/admin/stats", label: "Stats", icon: TrendingUp },
];

export default function AdminNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin" || pathname.startsWith("/admin/leads");
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav aria-label="Staff sections" className="border-t border-border">
      <ul className="no-scrollbar mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-2 sm:px-4">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? "border-navy text-navy"
                    : "border-transparent text-muted hover:text-navy"
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
