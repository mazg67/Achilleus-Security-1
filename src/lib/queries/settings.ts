import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile, SeatConfig, Settings } from "@/lib/database.types";

export interface UserRow extends Profile {
  email: string;
}

export async function getUsersForSettings(): Promise<UserRow[]> {
  const supabase = await createClient();
  const admin = createAdminClient();

  const [{ data: profiles }, { data: authUsers }] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: true }),
    admin.auth.admin.listUsers({ perPage: 200 }),
  ]);

  const emailById = new Map(authUsers?.users.map((u) => [u.id, u.email ?? ""]) ?? []);

  return (profiles ?? []).map((p) => ({ ...p, email: emailById.get(p.id) ?? "" }));
}

export async function getSeatConfigWithGuests(): Promise<
  (SeatConfig & { defaultGuestName: string | null })[]
> {
  const supabase = await createClient();
  const [{ data: seats }, { data: guests }] = await Promise.all([
    supabase.from("seat_config").select("*").order("id", { ascending: true }),
    supabase.from("guests").select("id, name"),
  ]);

  const nameById = new Map((guests ?? []).map((g) => [g.id, g.name]));

  return (seats ?? []).map((s) => ({
    ...s,
    defaultGuestName: s.default_guest_id ? nameById.get(s.default_guest_id) ?? null : null,
  }));
}

export async function getSettingsRow(): Promise<Settings> {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("*").eq("id", 1).single();
  return data!;
}
