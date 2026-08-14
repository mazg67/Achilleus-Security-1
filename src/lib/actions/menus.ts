"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/dal";
import { permissions } from "@/lib/permissions";

export type MenuFormState = { error?: string; success?: boolean } | undefined;

export async function saveMenu(
  _prevState: MenuFormState,
  formData: FormData,
): Promise<MenuFormState> {
  const profile = await getCurrentProfile();
  if (!permissions.canManageMenus(profile.role)) {
    return { error: "You don't have permission to edit the menu." };
  }

  const fixtureId = String(formData.get("fixture_id") || "");
  if (!fixtureId) return { error: "Missing fixture." };

  const fields = {
    fixture_id: fixtureId,
    welcome_drinks: String(formData.get("welcome_drinks") || "").trim() || null,
    starter: String(formData.get("starter") || "").trim() || null,
    main_course: String(formData.get("main_course") || "").trim() || null,
    dessert: String(formData.get("dessert") || "").trim() || null,
    drinks_included: String(formData.get("drinks_included") || "").trim() || null,
    additional_notes: String(formData.get("additional_notes") || "").trim() || null,
    updated_at: new Date().toISOString(),
  };

  const supabase = await createClient();
  const { error } = await supabase.from("menus").upsert(fields, { onConflict: "fixture_id" });

  if (error) return { error: error.message };

  revalidatePath(`/fixtures/${fixtureId}`);
  return { success: true };
}
