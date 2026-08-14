"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/dal";
import type { UserRole, SeatType } from "@/lib/database.types";

type ActionState = { error?: string; success?: boolean } | undefined;

export async function updateUser(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await getCurrentProfile();
  if (profile.role !== "admin") return { error: "Only admins can manage users." };

  const userId = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const role = String(formData.get("role") || "") as UserRole;

  if (!userId || !name || !email) return { error: "Name and email are required." };

  const admin = createAdminClient();

  if (role !== "admin") {
    const { data: admins } = await admin.from("profiles").select("id").eq("role", "admin");
    const isCurrentlyAdmin = (admins ?? []).some((a) => a.id === userId);
    if (isCurrentlyAdmin && (admins?.length ?? 0) <= 1) {
      return { error: "Can't demote the last admin — promote another user first." };
    }
  }

  const { error: emailError } = await admin.auth.admin.updateUserById(userId, { email });
  if (emailError) return { error: emailError.message };

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ name, role }).eq("id", userId);
  if (error) return { error: error.message };

  revalidatePath("/settings");
  return { success: true };
}

export async function updateClubSettings(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await getCurrentProfile();
  if (profile.role !== "admin") return { error: "Only admins can edit settings." };

  const fields = {
    suite_name: String(formData.get("suite_name") || "").trim(),
    hospitality_entrance: String(formData.get("hospitality_entrance") || "").trim(),
    box_office_location: String(formData.get("box_office_location") || "").trim(),
    stadium_address: String(formData.get("stadium_address") || "").trim(),
    season: String(formData.get("season") || "").trim(),
    box_opens_before_ko: Number(formData.get("box_opens_before_ko")) || 0,
    box_closes_after_ko: Number(formData.get("box_closes_after_ko")) || 0,
  };

  const supabase = await createClient();
  const { error } = await supabase.from("settings").update(fields).eq("id", 1);
  if (error) return { error: error.message };

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/fixtures", "layout");
  return { success: true };
}

export async function updateSeatConfig(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await getCurrentProfile();
  if (profile.role !== "admin") return { error: "Only admins can edit seat configuration." };

  const seatId = Number(formData.get("id"));
  const label = String(formData.get("label") || "").trim();
  const type = String(formData.get("type") || "") as SeatType;
  const defaultGuestId = String(formData.get("default_guest_id") || "").trim() || null;

  if (!seatId || !label) return { error: "Seat label is required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("seat_config")
    .update({ label, type, default_guest_id: type === "fixed" ? defaultGuestId : null })
    .eq("id", seatId);

  if (error) return { error: error.message };

  revalidatePath("/settings");
  revalidatePath("/fixtures", "layout");
  return { success: true };
}
