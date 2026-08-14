import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Fixture, Guest, Menu, SeatAllocation, SeatConfig, Settings } from "@/lib/database.types";

export interface SeatWithAllocation extends SeatConfig {
  allocation: SeatAllocation | null;
  guest: Guest | null;
}

export interface FixtureDetail {
  fixture: Fixture;
  settings: Settings;
  seats: SeatWithAllocation[];
  menu: Menu | null;
  allGuests: Guest[];
  staffNames: string[];
}

export async function getFixtureDetail(fixtureId: string): Promise<FixtureDetail> {
  const supabase = await createClient();

  const [
    { data: fixture },
    { data: settings },
    { data: seatConfig },
    { data: allocations },
    { data: menu },
    { data: allGuests },
    { data: staff },
  ] = await Promise.all([
    supabase.from("fixtures").select("*").eq("id", fixtureId).single(),
    supabase.from("settings").select("*").eq("id", 1).single(),
    supabase.from("seat_config").select("*").order("id", { ascending: true }),
    supabase.from("seat_allocations").select("*").eq("fixture_id", fixtureId),
    supabase.from("menus").select("*").eq("fixture_id", fixtureId).maybeSingle(),
    supabase.from("guests").select("*").order("name", { ascending: true }),
    supabase.from("profiles").select("name").order("name", { ascending: true }),
  ]);

  if (!fixture) notFound();

  const guestById = new Map((allGuests ?? []).map((g) => [g.id, g]));
  const allocationBySeat = new Map((allocations ?? []).map((a) => [a.seat_id, a]));

  const seats: SeatWithAllocation[] = (seatConfig ?? []).map((seat) => {
    const allocation = allocationBySeat.get(seat.id) ?? null;
    return {
      ...seat,
      allocation,
      guest: allocation?.guest_id ? guestById.get(allocation.guest_id) ?? null : null,
    };
  });

  return {
    fixture,
    settings: settings!,
    seats,
    menu: menu ?? null,
    allGuests: allGuests ?? [],
    staffNames: (staff ?? []).map((s) => s.name),
  };
}
