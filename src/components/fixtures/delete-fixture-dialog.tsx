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
import { deleteFixture } from "@/lib/actions/fixtures";

export function DeleteFixtureDialog({
  open,
  onOpenChange,
  fixtureId,
  opponent,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fixtureId: string;
  opponent: string;
}) {
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    const res = await deleteFixture(fixtureId);
    setPending(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Fixture deleted");
    onOpenChange(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete fixture vs {opponent}?</AlertDialogTitle>
          <AlertDialogDescription>
            This also deletes its seat allocations and menu. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
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
