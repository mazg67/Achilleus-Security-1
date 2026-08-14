"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function SyncFixturesButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSync() {
    setPending(true);
    try {
      const res = await fetch("/api/cron/sync-fixtures");
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data.error ?? "Sync failed — check the football-data.org API key in settings.");
        return;
      }
      toast.success(`Synced with football-data.org — ${data.updated} fixture(s) updated.`);
      if (data.unmatched?.length) {
        const list = data.unmatched.map((m: { opponent: string; date: string }) => m.opponent).join(", ");
        toast.warning(
          `${data.unmatched.length} fixture(s) from football-data.org couldn't be matched — add manually: ${list}`,
          { duration: 10000 },
        );
      }
      router.refresh();
    } catch {
      toast.error("Couldn't reach the fixture sync service.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSync} disabled={pending}>
      <RefreshCw className={cn("size-3.5", pending && "animate-spin")} />
      {pending ? "Syncing…" : "Sync Fixtures"}
    </Button>
  );
}
