"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateSeatConfig } from "@/lib/actions/settings";
import type { SeatConfig, SeatType, Guest } from "@/lib/database.types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-brand-red hover:bg-brand-red/90 text-white">
      {pending ? "Saving…" : "Save changes"}
    </Button>
  );
}

export function SeatEditDialog({
  open,
  onOpenChange,
  seat,
  guests,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seat: SeatConfig;
  guests: Guest[];
}) {
  const [state, formAction] = useActionState(updateSeatConfig, undefined);
  const [type, setType] = useState<SeatType>(seat.type);

  useEffect(() => {
    if (state?.success) {
      toast.success("Seat configuration updated");
      onOpenChange(false);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit {seat.label}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="id" value={seat.id} />
          <div className="space-y-1.5">
            <Label htmlFor="s-label">Label</Label>
            <Input id="s-label" name="label" defaultValue={seat.label} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="s-type">Type</Label>
            <Select name="type" defaultValue={seat.type} onValueChange={(v) => setType(v as SeatType)}>
              <SelectTrigger id="s-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="rotating">Rotating</SelectItem>
                <SelectItem value="host">Host</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {type === "fixed" && (
            <div className="space-y-1.5">
              <Label htmlFor="s-default-guest">Default guest</Label>
              <Select name="default_guest_id" defaultValue={seat.default_guest_id ?? undefined}>
                <SelectTrigger id="s-default-guest" className="w-full">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {guests.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {state?.error && <p className="text-sm text-brand-red font-medium">{state.error}</p>}
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
