"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { deleteGuest } from "@/lib/actions/guests";

export function DeleteGuestDialog({
  open,
  onOpenChange,
  guestId,
  guestName,
  onDeleted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guestId: string;
  guestName: string;
  onDeleted?: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setPending(true);
    const res = await deleteGuest(guestId);
    setPending(false);
    if (res.error) {
      setError(res.error);
      toast.error(res.error);
      return;
    }
    toast.success(`${guestName} deleted`);
    onOpenChange(false);
    onDeleted?.();
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {guestName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the guest from the database and from any seat allocations. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p className="text-sm text-brand-red font-medium">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-brand-red hover:bg-brand-red/90 text-white"
          >
            {pending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
