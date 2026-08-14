import type { UserRole } from "@/lib/database.types";

export const permissions = {
  canManageFixtures: (role: UserRole) => role === "admin",
  canDeleteFixtures: (role: UserRole) => role === "admin",
  canManageSeats: (role: UserRole) => role === "admin" || role === "editor",
  canManageGuests: (role: UserRole) => role === "admin" || role === "editor",
  canDeleteGuests: (role: UserRole) => role === "admin",
  canManageMenus: (role: UserRole) => role === "admin" || role === "editor",
  canGenerateEmails: (role: UserRole) => role === "admin" || role === "editor",
  canGenerateReports: (role: UserRole) => role === "admin" || role === "editor" || role === "viewer",
  canManageSettings: (role: UserRole) => role === "admin",
  canManageUsers: (role: UserRole) => role === "admin",
};

export type Permissions = typeof permissions;
