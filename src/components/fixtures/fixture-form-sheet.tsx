"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createFixture, updateFixture, type FixtureFormState } from "@/lib/actions/fixtures";
import type { Fixture } from "@/lib/database.types";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-brand-red hover:bg-brand-red/90 text-white">
      {pending ? "Saving…" : label}
    </Button>
  );
}

export function FixtureFormSheet({
  open,
  onOpenChange,
  fixture,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fixture: Fixture | null;
}) {
  const isEdit = !!fixture;
  const action = isEdit ? updateFixture : createFixture;
  const [state, formAction] = useActionState<FixtureFormState, FormData>(action, undefined);

  useEffect(() => {
    if (state?.fixtureId) {
      toast.success(isEdit ? "Fixture updated" : "Fixture added");
      onOpenChange(false);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, onOpenChange, isEdit]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit fixture" : "Add fixture"}</SheetTitle>
          <SheetDescription>
            {isEdit ? "Update this fixture's details." : "Add a new home fixture — e.g. a rescheduled or cup match."}
          </SheetDescription>
        </SheetHeader>

        <form
          key={fixture?.id ?? "new"}
          action={formAction}
          className="flex-1 flex flex-col gap-4 px-4 overflow-y-auto"
        >
          {isEdit && <input type="hidden" name="id" value={fixture!.id} />}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" defaultValue={fixture?.date ?? ""} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="kickoff_time">Kick-off</Label>
              <Input
                id="kickoff_time"
                name="kickoff_time"
                type="time"
                defaultValue={fixture?.kickoff_time?.slice(0, 5) ?? ""}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="opponent">Opponent</Label>
            <Input id="opponent" name="opponent" defaultValue={fixture?.opponent ?? ""} required />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="opponent_primary_colour">Primary colour</Label>
              <Input
                id="opponent_primary_colour"
                name="opponent_primary_colour"
                type="color"
                defaultValue={fixture?.opponent_primary_colour ?? "#666666"}
                className="h-9 p-1"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="opponent_secondary_colour">Secondary colour</Label>
              <Input
                id="opponent_secondary_colour"
                name="opponent_secondary_colour"
                type="color"
                defaultValue={fixture?.opponent_secondary_colour ?? "#FFFFFF"}
                className="h-9 p-1"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="opponent_abbreviation">Abbreviation</Label>
              <Input
                id="opponent_abbreviation"
                name="opponent_abbreviation"
                maxLength={4}
                placeholder="e.g. ARS"
                defaultValue={fixture?.opponent_abbreviation ?? ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="competition">Competition</Label>
              <Input id="competition" name="competition" defaultValue={fixture?.competition ?? "Premier League"} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="venue">Venue</Label>
              <Input id="venue" name="venue" defaultValue={fixture?.venue ?? "Portman Road"} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={fixture?.status ?? "upcoming"}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" rows={3} defaultValue={fixture?.notes ?? ""} />
          </div>

          <SheetFooter className="px-0">
            <SubmitButton label={isEdit ? "Save changes" : "Add fixture"} />
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
