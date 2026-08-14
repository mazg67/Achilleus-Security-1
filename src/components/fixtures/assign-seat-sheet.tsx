"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { GuestPicker } from "@/components/fixtures/guest-picker";
import { QuickAddGuestDialog } from "@/components/guests/quick-add-guest-dialog";
import { assignSeat, clearSeat, type AssignSeatState } from "@/lib/actions/seats";
import { defaultArrivalTime } from "@/lib/format";
import type { Guest } from "@/lib/database.types";
import type { SeatWithAllocation } from "@/lib/queries/fixture-detail";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-brand-red hover:bg-brand-red/90 text-white">
      {pending ? "Saving…" : "Save"}
    </Button>
  );
}

function AssignSeatForm({
  fixtureId,
  fixtureDate,
  fixtureKickoff,
  seat,
  guests,
  staffNames,
  onOpenChange,
}: {
  fixtureId: string;
  fixtureDate: string;
  fixtureKickoff: string;
  seat: SeatWithAllocation;
  guests: Guest[];
  staffNames: string[];
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState<AssignSeatState, FormData>(assignSeat, undefined);
  const [guestId, setGuestId] = useState<string | null>(seat.allocation?.guest_id ?? null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (state?.success) {
      toast.success("Seat updated");
      onOpenChange(false);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, onOpenChange]);

  const defaultArrival = seat.allocation?.arrival_time?.slice(0, 5) || defaultArrivalTime(fixtureDate, fixtureKickoff);

  async function handleClear() {
    setClearing(true);
    const res = await clearSeat(fixtureId, seat.id);
    setClearing(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Seat cleared");
    onOpenChange(false);
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle>{seat.label}</SheetTitle>
        <SheetDescription>
          {seat.type === "host" ? "Host seat — always present on match day." : "Assign a guest to this seat."}
        </SheetDescription>
      </SheetHeader>

      <form action={formAction} className="flex-1 flex flex-col gap-4 px-4 overflow-y-auto">
        <input type="hidden" name="fixture_id" value={fixtureId} />
        <input type="hidden" name="seat_id" value={seat.id} />
        <input type="hidden" name="guest_id" value={guestId ?? ""} />

        {seat.type !== "host" && (
          <div className="space-y-1.5">
            <Label>Guest</Label>
            <GuestPicker
              guests={guests}
              value={guestId}
              onChange={setGuestId}
              onAddNew={() => setQuickAddOpen(true)}
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="arrival_time">Arrival time</Label>
          <Input id="arrival_time" name="arrival_time" type="time" defaultValue={defaultArrival} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="host_name">Host</Label>
          <Input
            id="host_name"
            name="host_name"
            list="staff-names"
            placeholder="Host name"
            defaultValue={seat.allocation?.host_name ?? ""}
          />
          <datalist id="staff-names">
            {staffNames.map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" rows={3} defaultValue={seat.allocation?.notes ?? ""} />
        </div>

        {seat.type === "fixed" && (
          <label className="flex items-center gap-2 text-sm">
            <Checkbox name="set_as_default" />
            Set as season default for this seat
          </label>
        )}

        {state?.error && <p className="text-sm text-brand-red font-medium">{state.error}</p>}

        <SheetFooter className="px-0">
          {seat.allocation && (
            <Button type="button" variant="outline" disabled={clearing} onClick={handleClear}>
              {clearing ? "Clearing…" : "Clear seat"}
            </Button>
          )}
          <SubmitButton />
        </SheetFooter>
      </form>

      <QuickAddGuestDialog
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
        onCreated={(id) => {
          setGuestId(id);
          router.refresh();
        }}
      />
    </>
  );
}

export function AssignSeatSheet({
  fixtureId,
  fixtureDate,
  fixtureKickoff,
  seat,
  guests,
  staffNames,
  open,
  onOpenChange,
}: {
  fixtureId: string;
  fixtureDate: string;
  fixtureKickoff: string;
  seat: SeatWithAllocation | null;
  guests: Guest[];
  staffNames: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        {seat && (
          <AssignSeatForm
            key={seat.id}
            fixtureId={fixtureId}
            fixtureDate={fixtureDate}
            fixtureKickoff={fixtureKickoff}
            seat={seat}
            guests={guests}
            staffNames={staffNames}
            onOpenChange={onOpenChange}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
