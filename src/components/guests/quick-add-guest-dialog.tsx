"use client";

import { useActionState, useEffect } from "react";
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
import { createGuest, type GuestFormState } from "@/lib/actions/guests";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-brand-red hover:bg-brand-red/90 text-white">
      {pending ? "Adding…" : "Add guest"}
    </Button>
  );
}

export function QuickAddGuestDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (guestId: string) => void;
}) {
  const [state, formAction] = useActionState<GuestFormState, FormData>(createGuest, undefined);

  useEffect(() => {
    if (state?.guestId) {
      toast.success("Guest added");
      onCreated(state.guestId);
      onOpenChange(false);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, onCreated, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add new guest</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="qa-name">Name</Label>
            <Input id="qa-name" name="name" required autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="qa-company">Company</Label>
            <Input id="qa-company" name="company" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="qa-dietary">Dietary requirement</Label>
            <Input id="qa-dietary" name="dietary" placeholder="None" />
          </div>
          {state?.error && <p className="text-sm text-brand-red font-medium">{state.error}</p>}
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
