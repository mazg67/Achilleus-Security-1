"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { changePassword, type ChangePasswordState } from "@/lib/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-brand-red hover:bg-brand-red/90 text-white">
      {pending ? "Saving…" : "Set new password"}
    </Button>
  );
}

export function ChangePasswordDialog({ open }: { open: boolean }) {
  const [state, formAction] = useActionState<ChangePasswordState, FormData>(
    changePassword,
    undefined,
  );

  useEffect(() => {
    if (state?.success) toast.success("Password updated");
    else if (state?.error) toast.error(state.error);
  }, [state]);

  // On success the server action clears must_change_password and the layout
  // revalidates, so this dialog simply won't be mounted on next render.
  return (
    <Dialog open={open && !state?.success} disablePointerDismissal>
      <DialogContent showCloseButton={false} className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Set a new password</DialogTitle>
          <DialogDescription>
            For security, please choose a new password before continuing.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">New password</Label>
            <Input id="password" name="password" type="password" required minLength={8} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" name="confirm" type="password" required minLength={8} />
          </div>
          {state?.error && <p className="text-sm text-brand-red font-medium">{state.error}</p>}
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
