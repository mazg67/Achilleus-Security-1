import { createClient } from "@/lib/supabase/server";
import type { Fixture, Settings } from "@/lib/database.types";

export interface FixtureWithStats extends Fixture {
  filledSeats: number;
}

export interface DashboardData {
  settings: Settings;
  fixtures: FixtureWithStats[];
  stats: {
    totalFixtures: number;
    completedFixtures: number;
    guestsHostedThisSeason: number;
    nextFixture: Fixture | null;
    seatsRemainingUpcoming: number;
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();

  const [{ data: settings }, { data: fixtures }, { data: allocations }] = await Promise.all([
    supabase.from("settings").select("*").eq("id", 1).single(),
    supabase.from("fixtures").select("*").order("date", { ascending: true }),
    supabase.from("seat_allocations").select("fixture_id, guest_id"),
  ]);

  const fixtureList = fixtures ?? [];
  const allocationList = allocations ?? [];

  const filledByFixture = new Map<string, number>();
  for (const a of allocationList) {
    filledByFixture.set(a.fixture_id, (filledByFixture.get(a.fixture_id) ?? 0) + 1);
  }

  const fixturesWithStats: FixtureWithStats[] = fixtureList.map((f) => ({
    ...f,
    filledSeats: filledByFixture.get(f.id) ?? 0,
  }));

  const today = new Date().toISOString().slice(0, 10);
  const nextFixture =
    fixtureList.find((f) => f.status !== "completed" && f.date >= today) ??
    fixtureList.find((f) => f.status !== "completed") ??
    null;

  const upcomingFixtures = fixtureList.filter((f) => f.status === "upcoming");
  const upcomingFixtureIds = new Set(upcomingFixtures.map((f) => f.id));
  const filledSeatsUpcoming = allocationList.filter((a) =>
    upcomingFixtureIds.has(a.fixture_id),
  ).length;
  const totalSeats = settings?.total_seats ?? DEFAULT_SETTINGS.total_seats;
  const seatsRemainingUpcoming = upcomingFixtures.length * totalSeats - filledSeatsUpcoming;

  const guestsHostedThisSeason = allocationList.filter((a) => a.guest_id).length;

  return {
    settings: settings ?? DEFAULT_SETTINGS,
    fixtures: fixturesWithStats,
    stats: {
      totalFixtures: fixtureList.length,
      completedFixtures: fixtureList.filter((f) => f.status === "completed").length,
      guestsHostedThisSeason,
      nextFixture,
      seatsRemainingUpcoming,
    },
  };
}

const DEFAULT_SETTINGS: Settings = {
  id: 1,
  box_name: "Achilleus Security Hospitality Suite",
  suite_name: "Sir Bobby Robson Executive Suite",
  hospitality_entrance: "Sir Alf Ramsey Stand — Portman Road Entrance",
  box_office_location: "East of England Co-op Stand, Gate C",
  stadium_address: "Portman Road, Ipswich, Suffolk, IP1 2DA",
  box_opens_before_ko: 120,
  box_closes_after_ko: 75,
  season: "2026/27",
  total_seats: 14,
};
