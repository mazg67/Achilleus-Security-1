import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DietaryBadge } from "@/components/guests/dietary-badge";
import { cn } from "@/lib/utils";
import type { SeatWithAllocation } from "@/lib/queries/fixture-detail";
import type { SeatType } from "@/lib/database.types";

const TYPE_STYLES: Record<SeatType, string> = {
  fixed: "bg-sky-100 text-sky-800",
  rotating: "bg-emerald-100 text-emerald-800",
  host: "bg-brand-amber/25 text-brand-black",
};

const TYPE_LABELS: Record<SeatType, string> = {
  fixed: "Fixed",
  rotating: "Rotating",
  host: "Host",
};

export function SeatCard({
  seat,
  canEdit,
  onAssign,
}: {
  seat: SeatWithAllocation;
  canEdit: boolean;
  onAssign: () => void;
}) {
  const isFilled = !!seat.allocation;

  return (
    <Card className={cn("p-4 flex flex-col gap-2.5", isFilled ? "border-border" : "border-dashed")}>
      <div className="flex items-center justify-between">
        <span className="font-heading text-sm">{seat.label}</span>
        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", TYPE_STYLES[seat.type])}>
          {TYPE_LABELS[seat.type]}
        </span>
      </div>

      {isFilled ? (
        <div className="flex-1 space-y-1.5 text-sm">
          {seat.guest && (
            <>
              <p className="font-semibold leading-tight">{seat.guest.name}</p>
              {seat.guest.company && (
                <p className="text-muted-foreground text-xs">{seat.guest.company}</p>
              )}
              <DietaryBadge dietary={seat.guest.dietary} />
            </>
          )}
          {seat.allocation?.host_name && (
            <p className="text-xs text-muted-foreground">Host: {seat.allocation.host_name}</p>
          )}
          {seat.allocation?.arrival_time && (
            <p className="text-xs text-muted-foreground">
              Arrives: {seat.allocation.arrival_time.slice(0, 5)}
            </p>
          )}
        </div>
      ) : (
        <p className="flex-1 text-sm text-muted-foreground italic">Unassigned</p>
      )}

      {canEdit && (
        <Button size="sm" variant={isFilled ? "outline" : "default"} className={cn(!isFilled && "bg-brand-red hover:bg-brand-red/90 text-white")} onClick={onAssign}>
          {isFilled ? "Change" : "Assign"}
        </Button>
      )}
    </Card>
  );
}
