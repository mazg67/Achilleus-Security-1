"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/dal";
import { permissions } from "@/lib/permissions";

export type GuestFormState = { error?: string; guestId?: string } | undefined;

function readGuestFields(formData: FormData) {
  return {
    name: String(formData.get("name") || "").trim(),
    company: String(formData.get("company") || "").trim() || null,
    email: String(formData.get("email") || "").trim() || null,
    phone: String(formData.get("phone") || "").trim() || null,
    dietary: String(formData.get("dietary") || "None").trim() || "None",
    notes: String(formData.get("notes") || "").trim() || null,
    security_pin: String(formData.get("security_pin") || "").trim() || null,
  };
}

export async function createGuest(
  _prevState: GuestFormState,
  formData: FormData,
): Promise<GuestFormState> {
  const profile = await getCurrentProfile();
  if (!permissions.canManageGuests(profile.role)) {
    return { error: "You don't have permission to add guests." };
  }

  const fields = readGuestFields(formData);
  if (!fields.name) return { error: "Guest name is required." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("guests")
    .insert({ ...fields, created_by: profile.id })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message ?? "Failed to add guest." };

  revalidatePath("/guests");
  revalidatePath("/fixtures", "layout");
  return { guestId: data.id };
}

export async function updateGuest(
  _prevState: GuestFormState,
  formData: FormData,
): Promise<GuestFormState> {
  const profile = await getCurrentProfile();
  if (!permissions.canManageGuests(profile.role)) {
    return { error: "You don't have permission to edit guests." };
  }

  const id = String(formData.get("id") || "");
  const fields = readGuestFields(formData);
  if (!id) return { error: "Missing guest id." };
  if (!fields.name) return { error: "Guest name is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("guests").update(fields).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/guests");
  revalidatePath(`/guests/${id}`);
  revalidatePath("/fixtures", "layout");
  return { guestId: id };
}

export async function deleteGuest(id: string): Promise<{ error?: string }> {
  const profile = await getCurrentProfile();
  if (!permissions.canDeleteGuests(profile.role)) {
    return { error: "Only admins can delete guests." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("guests").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/guests");
  revalidatePath("/fixtures", "layout");
  return {};
}
