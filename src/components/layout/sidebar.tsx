"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogoLockup } from "@/components/brand/logo";
import { visibleNavItems } from "@/components/layout/nav-items";
import type { UserRole } from "@/lib/database.types";

export function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const items = visibleNavItems(role);

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-brand-black">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="px-5 pt-6 pb-5 border-b border-white/10">
          <LogoLockup size={44} variant="dark" />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-red text-white"
                    : "text-offwhite/70 hover:bg-white/5 hover:text-offwhite",
                )}
              >
                <item.icon className="size-4.5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-[11px] text-offwhite/40">2026/27 Season</p>
        </div>
      </div>
    </aside>
  );
}
