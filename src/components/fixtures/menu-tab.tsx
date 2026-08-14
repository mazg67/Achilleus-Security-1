"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveMenu, type MenuFormState } from "@/lib/actions/menus";
import type { Menu } from "@/lib/database.types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-brand-red hover:bg-brand-red/90 text-white">
      {pending ? "Saving…" : "Save menu"}
    </Button>
  );
}

function PreviewLine({ label, value }: { label: string; value: string }) {
  if (!value.trim()) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-red">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}

export function MenuTab({
  fixtureId,
  menu,
  canEdit,
}: {
  fixtureId: string;
  menu: Menu | null;
  canEdit: boolean;
}) {
  const [state, formAction] = useActionState<MenuFormState, FormData>(saveMenu, undefined);
  const [fields, setFields] = useState({
    welcome_drinks: menu?.welcome_drinks ?? "",
    starter: menu?.starter ?? "",
    main_course: menu?.main_course ?? "",
    dessert: menu?.dessert ?? "",
    drinks_included: menu?.drinks_included ?? "",
    additional_notes: menu?.additional_notes ?? "",
  });

  useEffect(() => {
    if (state?.success) toast.success("Menu saved");
    else if (state?.error) toast.error(state.error);
  }, [state]);

  function update(key: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="fixture_id" value={fixtureId} />

        <div className="space-y-1.5">
          <Label htmlFor="welcome_drinks">Welcome / arrival drinks</Label>
          <Input
            id="welcome_drinks"
            name="welcome_drinks"
            value={fields.welcome_drinks}
            onChange={update("welcome_drinks")}
            disabled={!canEdit}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="starter">Starter</Label>
          <Input
            id="starter"
            name="starter"
            placeholder="Option one / Option two"
            value={fields.starter}
            onChange={update("starter")}
            disabled={!canEdit}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="main_course">Main course</Label>
          <Input
            id="main_course"
            name="main_course"
            placeholder="Option one / Option two"
            value={fields.main_course}
            onChange={update("main_course")}
            disabled={!canEdit}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dessert">Dessert</Label>
          <Input
            id="dessert"
            name="dessert"
            placeholder="Option one / Option two"
            value={fields.dessert}
            onChange={update("dessert")}
            disabled={!canEdit}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="drinks_included">Drinks included</Label>
          <Input
            id="drinks_included"
            name="drinks_included"
            value={fields.drinks_included}
            onChange={update("drinks_included")}
            disabled={!canEdit}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="additional_notes">Additional notes / dietary accommodations</Label>
          <Textarea
            id="additional_notes"
            name="additional_notes"
            rows={3}
            value={fields.additional_notes}
            onChange={update("additional_notes")}
            disabled={!canEdit}
          />
        </div>

        {canEdit && <SubmitButton />}
      </form>

      <Card className="p-6 h-fit">
        <p className="font-script text-brand-red text-lg mb-3">Match Day Menu</p>
        <div className="space-y-3">
          <PreviewLine label="Welcome drinks" value={fields.welcome_drinks} />
          <PreviewLine label="Starter" value={fields.starter} />
          <PreviewLine label="Main course" value={fields.main_course} />
          <PreviewLine label="Dessert" value={fields.dessert} />
          <PreviewLine label="Drinks included" value={fields.drinks_included} />
          <PreviewLine label="Notes" value={fields.additional_notes} />
          {Object.values(fields).every((v) => !v.trim()) && (
            <p className="text-sm text-muted-foreground">Nothing added yet — fill in the form to preview.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
