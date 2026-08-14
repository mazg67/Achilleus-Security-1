import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rows = 8, className }: { rows?: number; className?: string }) {
  return (
    <div className={className ?? "px-4 md:px-6 py-6 space-y-6 max-w-6xl mx-auto"}>
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-9 w-80" />
      <div className="rounded-xl border border-border overflow-hidden">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-none border-b border-border last:border-0" />
        ))}
      </div>
    </div>
  );
}
