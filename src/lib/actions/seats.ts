"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/dal";
import { permissions } from "@/lib/permissions";

export type AssignSeatState = { error?: string; success?: boolean } | undefined;

export async function assignSeat(
  _prevState: AssignSeatState,
  formData: FormData,
): Promise<AssignSeatState> {
  const profile = await getCurrentProfile();
  if (!permissions.canManageSeats(profile.role)) {
    return { error: "You don't have permission to assign seats." };
  }

  const fixtureId = String(formData.get("fixture_id") || "");
  const seatId = Number(formData.get("seat_id"));
  const guestId = String(formData.get("guest_id") || "").trim() || null;
  const hostName = String(formData.get("host_name") || "").trim() || null;
  const arrivalTime = String(formData.get("arrival_time") || "").trim() || null;
  const notes = String(formData.get("notes") || "").trim() || null;
  const setAsDefault = formData.get("set_as_default") === "on";

  if (!fixtureId || !seatId) return { error: "Missing fixture or seat." };

  const supabase = await createClient();

  const { error } = await supabase.from("seat_allocations").upsert(
    {
      fixture_id: fixtureId,
      seat_id: seatId,
      guest_id: guestId,
      host_name: hostName,
      arrival_time: arrivalTime,
      notes,
    },
    { onConflict: "fixture_id,seat_id" },
  );

  if (error) return { error: error.message };

  if (setAsDefault && guestId) {
    await supabase.from("seat_config").update({ default_guest_id: guestId }).eq("id", seatId);
  }

  revalidatePath(`/fixtures/${fixtureId}`);
  revalidatePath("/dashboard");
  revalidatePath("/fixtures");
  return { success: true };
}

export async function clearSeat(fixtureId: string, seatId: number): Promise<{ error?: string }> {
  const profile = await getCurrentProfile();
  if (!permissions.canManageSeats(profile.role)) {
    return { error: "You don't have permission to change seats." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("seat_allocations")
    .delete()
    .eq("fixture_id", fixtureId)
    .eq("seat_id", seatId);

  if (error) return { error: error.message };

  revalidatePath(`/fixtures/${fixtureId}`);
  revalidatePath("/dashboard");
  revalidatePath("/fixtures");
  return {};
}
