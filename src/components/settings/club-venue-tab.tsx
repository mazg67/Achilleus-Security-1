"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { updateClubSettings } from "@/lib/actions/settings";
import type { Settings } from "@/lib/database.types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-brand-red hover:bg-brand-red/90 text-white">
      {pending ? "Saving…" : "Save changes"}
    </Button>
  );
}

export function ClubVenueTab({ settings }: { settings: Settings }) {
  const [state, formAction] = useActionState(updateClubSettings, undefined);

  useEffect(() => {
    if (state?.success) toast.success("Settings saved");
    else if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <Card className="p-6 max-w-xl">
      <form action={formAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="suite_name">Hospitality suite name</Label>
          <Input id="suite_name" name="suite_name" defaultValue={settings.suite_name} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hospitality_entrance">Hospitality entrance</Label>
          <Input id="hospitality_entrance" name="hospitality_entrance" defaultValue={settings.hospitality_entrance} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="box_office_location">Box office / gate location</Label>
          <Input id="box_office_location" name="box_office_location" defaultValue={settings.box_office_location} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="stadium_address">Stadium address</Label>
          <Input id="stadium_address" name="stadium_address" defaultValue={settings.stadium_address} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="season">Season label</Label>
          <Input id="season" name="season" defaultValue={settings.season} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="box_opens_before_ko">Box opens (mins before KO)</Label>
            <Input
              id="box_opens_before_ko"
              name="box_opens_before_ko"
              type="number"
              defaultValue={settings.box_opens_before_ko}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="box_closes_after_ko">Box closes (mins after KO)</Label>
            <Input
              id="box_closes_after_ko"
              name="box_closes_after_ko"
              type="number"
              defaultValue={settings.box_closes_after_ko}
            />
          </div>
        </div>
        <SubmitButton />
      </form>
    </Card>
  );
}
