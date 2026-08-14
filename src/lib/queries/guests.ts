import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Fixture, Guest, SeatAllocation, SeatConfig } from "@/lib/database.types";

export interface GuestWithAppearances extends Guest {
  appearances: number;
}

export async function getGuestsWithAppearances(): Promise<GuestWithAppearances[]> {
  const supabase = await createClient();
  const [{ data: guests }, { data: allocations }] = await Promise.all([
    supabase.from("guests").select("*").order("name", { ascending: true }),
    supabase.from("seat_allocations").select("guest_id"),
  ]);

  const counts = new Map<string, number>();
  for (const a of allocations ?? []) {
    if (!a.guest_id) continue;
    counts.set(a.guest_id, (counts.get(a.guest_id) ?? 0) + 1);
  }

  return (guests ?? []).map((g) => ({ ...g, appearances: counts.get(g.id) ?? 0 }));
}

export interface GuestAppearance {
  fixture: Fixture;
  seat: SeatConfig;
  allocation: SeatAllocation;
}

export interface GuestProfile {
  guest: Guest;
  appearances: GuestAppearance[];
}

export async function getGuestProfile(guestId: string): Promise<GuestProfile> {
  const supabase = await createClient();

  const [{ data: guest }, { data: allocations }, { data: fixtures }, { data: seats }] =
    await Promise.all([
      supabase.from("guests").select("*").eq("id", guestId).single(),
      supabase.from("seat_allocations").select("*").eq("guest_id", guestId),
      supabase.from("fixtures").select("*"),
      supabase.from("seat_config").select("*"),
    ]);

  if (!guest) notFound();

  const fixtureById = new Map((fixtures ?? []).map((f) => [f.id, f]));
  const seatById = new Map((seats ?? []).map((s) => [s.id, s]));

  const appearances: GuestAppearance[] = (allocations ?? [])
    .map((allocation) => {
      const fixture = fixtureById.get(allocation.fixture_id);
      const seat = seatById.get(allocation.seat_id);
      if (!fixture || !seat) return null;
      return { fixture, seat, allocation };
    })
    .filter((a): a is GuestAppearance => a !== null)
    .sort((a, b) => b.fixture.date.localeCompare(a.fixture.date));

  return { guest, appearances };
}
