import { cn } from "@/lib/utils";
import type { FixtureStatus } from "@/lib/database.types";

const STYLES: Record<FixtureStatus, string> = {
  upcoming: "bg-brand-yellow text-brand-black",
  today: "bg-brand-red text-white animate-pulse",
  completed: "bg-muted text-muted-foreground",
};

const LABELS: Record<FixtureStatus, string> = {
  upcoming: "Upcoming",
  today: "Today",
  completed: "Completed",
};

export function StatusBadge({ status, className }: { status: FixtureStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        STYLES[status],
        className,
      )}
    >
      {LABELS[status]}
    </span>
  );
}
