import { TableSkeleton } from "@/components/ui/table-skeleton";

export default function Loading() {
  return <TableSkeleton rows={4} className="px-4 md:px-6 py-6 space-y-6 max-w-4xl mx-auto" />;
}
