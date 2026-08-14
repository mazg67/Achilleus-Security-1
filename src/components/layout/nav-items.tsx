import { LayoutDashboard, CalendarDays, Users, Settings } from "lucide-react";
import type { UserRole } from "@/lib/database.types";

export interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/fixtures", label: "Fixtures", icon: CalendarDays },
  { href: "/guests", label: "Guests", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings, adminOnly: true },
];

export function visibleNavItems(role: UserRole) {
  return NAV_ITEMS.filter((item) => !item.adminOnly || role === "admin");
}
