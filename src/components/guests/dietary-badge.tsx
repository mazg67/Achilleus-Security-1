import { cn } from "@/lib/utils";

const COLOURS: Record<string, string> = {
  none: "bg-muted text-muted-foreground",
  vegetarian: "bg-emerald-100 text-emerald-800",
  vegan: "bg-emerald-100 text-emerald-800",
  "gluten-free": "bg-amber-100 text-amber-800",
  "no shellfish": "bg-sky-100 text-sky-800",
  halal: "bg-violet-100 text-violet-800",
  "diabetic-friendly": "bg-rose-100 text-rose-800",
};

export function DietaryBadge({ dietary, className }: { dietary: string; className?: string }) {
  const key = dietary.trim().toLowerCase();
  const style = COLOURS[key] ?? "bg-brand-amber/20 text-brand-black";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        style,
        className,
      )}
    >
      {dietary}
    </span>
  );
}
