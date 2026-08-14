"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createGuest, updateGuest, type GuestFormState } from "@/lib/actions/guests";
import type { Guest } from "@/lib/database.types";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-brand-red hover:bg-brand-red/90 text-white">
      {pending ? "Saving…" : label}
    </Button>
  );
}

function PinField({ defaultValue }: { defaultValue: string }) {
  const [pin, setPin] = useState(defaultValue);
  return (
    <div className="space-y-1.5">
      <Label htmlFor="g-pin">Security PIN</Label>
      <div className="flex gap-2">
        <Input
          id="g-pin"
          name="security_pin"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="e.g. 4821"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Generate random PIN"
          onClick={() => setPin(String(Math.floor(1000 + Math.random() * 9000)))}
        >
          <RefreshCw className="size-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Shown on the Hospitality Security List to verify this guest&rsquo;s identity on match day.
      </p>
    </div>
  );
}

export function GuestFormSheet({
  open,
  onOpenChange,
  guest,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guest: Guest | null;
}) {
  const isEdit = !!guest;
  const action = isEdit ? updateGuest : createGuest;
  const [state, formAction] = useActionState<GuestFormState, FormData>(action, undefined);

  useEffect(() => {
    if (state?.guestId) {
      toast.success(isEdit ? "Guest updated" : "Guest added");
      onOpenChange(false);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, onOpenChange, isEdit]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit guest" : "Add guest"}</SheetTitle>
          <SheetDescription>
            {isEdit ? "Update this guest's details." : "Add a new guest to the client database."}
          </SheetDescription>
        </SheetHeader>

        <form key={guest?.id ?? "new"} action={formAction} className="flex-1 flex flex-col gap-4 px-4 overflow-y-auto">
          {isEdit && <input type="hidden" name="id" value={guest!.id} />}

          <div className="space-y-1.5">
            <Label htmlFor="g-name">Name</Label>
            <Input id="g-name" name="name" required defaultValue={guest?.name ?? ""} autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="g-company">Company</Label>
            <Input id="g-company" name="company" defaultValue={guest?.company ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="g-email">Email</Label>
            <Input id="g-email" name="email" type="email" defaultValue={guest?.email ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="g-phone">Phone</Label>
            <Input id="g-phone" name="phone" defaultValue={guest?.phone ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="g-dietary">Dietary requirement</Label>
            <Input id="g-dietary" name="dietary" placeholder="None" defaultValue={guest?.dietary ?? "None"} />
          </div>
          <PinField defaultValue={guest?.security_pin ?? ""} />
          <div className="space-y-1.5">
            <Label htmlFor="g-notes">Notes</Label>
            <Textarea id="g-notes" name="notes" rows={3} defaultValue={guest?.notes ?? ""} />
          </div>

          {state?.error && <p className="text-sm text-brand-red font-medium">{state.error}</p>}

          <SheetFooter className="px-0">
            <SubmitButton label={isEdit ? "Save changes" : "Add guest"} />
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
