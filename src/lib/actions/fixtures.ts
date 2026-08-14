"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/dal";
import { permissions } from "@/lib/permissions";
import type { FixtureStatus } from "@/lib/database.types";

export type FixtureFormState = { error?: string; fixtureId?: string } | undefined;

function readFixtureFields(formData: FormData) {
  return {
    date: String(formData.get("date") || ""),
    kickoff_time: String(formData.get("kickoff_time") || ""),
    opponent: String(formData.get("opponent") || "").trim(),
    opponent_primary_colour: String(formData.get("opponent_primary_colour") || "#666666"),
    opponent_secondary_colour: String(formData.get("opponent_secondary_colour") || "#FFFFFF"),
    opponent_abbreviation: String(formData.get("opponent_abbreviation") || "")
      .trim()
      .toUpperCase()
      .slice(0, 4),
    competition: String(formData.get("competition") || "Premier League").trim(),
    venue: String(formData.get("venue") || "Portman Road").trim(),
    status: String(formData.get("status") || "upcoming") as FixtureStatus,
    notes: String(formData.get("notes") || "").trim() || null,
  };
}

export async function createFixture(
  _prevState: FixtureFormState,
  formData: FormData,
): Promise<FixtureFormState> {
  const profile = await getCurrentProfile();
  if (!permissions.canManageFixtures(profile.role)) {
    return { error: "Only admins can add fixtures." };
  }

  const fields = readFixtureFields(formData);
  if (!fields.date || !fields.kickoff_time || !fields.opponent) {
    return { error: "Date, kick-off time, and opponent are required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("fixtures").insert(fields).select("id").single();
  if (error || !data) return { error: error?.message ?? "Failed to add fixture." };

  revalidatePath("/fixtures");
  revalidatePath("/dashboard");
  return { fixtureId: data.id };
}

export async function updateFixture(
  _prevState: FixtureFormState,
  formData: FormData,
): Promise<FixtureFormState> {
  const profile = await getCurrentProfile();
  if (!permissions.canManageFixtures(profile.role)) {
    return { error: "Only admins can edit fixtures." };
  }

  const id = String(formData.get("id") || "");
  const fields = readFixtureFields(formData);
  if (!id) return { error: "Missing fixture id." };
  if (!fields.date || !fields.kickoff_time || !fields.opponent) {
    return { error: "Date, kick-off time, and opponent are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("fixtures").update(fields).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/fixtures");
  revalidatePath(`/fixtures/${id}`);
  revalidatePath("/dashboard");
  return { fixtureId: id };
}

export async function deleteFixture(id: string): Promise<{ error?: string }> {
  const profile = await getCurrentProfile();
  if (!permissions.canDeleteFixtures(profile.role)) {
    return { error: "Only admins can delete fixtures." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("fixtures").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/fixtures");
  revalidatePath("/dashboard");
  return {};
}
