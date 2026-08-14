"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { visibleNavItems } from "@/components/layout/nav-items";
import type { UserRole } from "@/lib/database.types";

export function MobileNav({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const items = visibleNavItems(role);

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-brand-black border-t border-white/10 flex">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
              active ? "text-brand-red" : "text-offwhite/60",
            )}
          >
            <item.icon className="size-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
