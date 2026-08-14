"use client";

import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRealtimeStatus } from "@/hooks/use-realtime-status";
import { logout } from "@/lib/actions/auth";
import { LogOut } from "lucide-react";
import { initials } from "@/lib/initials";
import type { UserRole } from "@/lib/database.types";

function roleLabel(role: UserRole) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function Topbar({ name, role }: { name: string; role: UserRole }) {
  const live = useRealtimeStatus();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-card/95 backdrop-blur px-4 md:px-6 py-3">
      <div className="flex items-center gap-4">
        <Image
          src="/brand/logo-horizontal.png"
          alt="Achilleus Security"
          width={2779}
          height={848}
          priority
          className="h-7 w-auto md:h-8"
        />
        <div className="hidden md:flex items-center gap-2 text-sm border-l border-border pl-4">
          <span
            className={`inline-flex size-2 rounded-full ${live ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/40"}`}
          />
          <span className="text-muted-foreground">{live ? "Live" : "Connecting…"}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold leading-tight">{name}</p>
          <p className="text-xs text-muted-foreground leading-tight">{roleLabel(role)}</p>
        </div>
        <Avatar className="size-9">
          <AvatarFallback className="bg-brand-red text-white font-semibold text-xs">
            {initials(name)}
          </AvatarFallback>
        </Avatar>
        <form action={logout}>
          <Button type="submit" variant="ghost" size="icon" title="Log out">
            <LogOut className="size-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
