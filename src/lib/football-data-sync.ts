import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchIpswichHomeFixtures, mapMatchStatus, clubNamesMatch } from "@/lib/football-data";
import type { Database, Fixture } from "@/lib/database.types";

export interface SyncResult {
  matched: number;
  updated: number;
  unmatched: { opponent: string; date: string }[];
}

/**
 * Reconciles fixtures against the live football-data.org schedule. Matches
 * each API fixture to an existing DB row by football_data_fixture_id first,
 * falling back to a fuzzy opponent-name match (the seeded 2026/27 list is
 * opponent-only, so early syncs rely on this). Only updates date/kickoff
 * time/status and stamps the football_data_fixture_id for stable matching
 * next time — it never creates or deletes fixtures, since brand colours and
 * abbreviations are hand-curated and cup fixtures are admin-managed.
 */
export async function syncFixturesFromFootballData(season: number): Promise<SyncResult> {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) throw new Error("FOOTBALL_DATA_API_KEY is not configured");

  const supabase = createAdminClient();
  const [{ data: fixtures, error }, matches] = await Promise.all([
    supabase.from("fixtures").select("*"),
    fetchIpswichHomeFixtures(apiKey, season),
  ]);
  if (error) throw new Error(error.message);

  const existing = fixtures ?? [];
  const byFootballDataId = new Map(
    existing.filter((f) => f.football_data_fixture_id != null).map((f) => [f.football_data_fixture_id, f]),
  );
  const claimed = new Set<string>();

  let updated = 0;
  const unmatched: SyncResult["unmatched"] = [];

  for (const match of matches) {
    let target: Fixture | undefined = byFootballDataId.get(match.id);

    if (!target) {
      target = existing.find(
        (f) => !claimed.has(f.id) && clubNamesMatch(f.opponent, match.awayTeam.name),
      );
    }

    if (!target) {
      unmatched.push({ opponent: match.awayTeam.name, date: match.utcDate.slice(0, 10) });
      continue;
    }

    claimed.add(target.id);

    const date = match.utcDate.slice(0, 10);
    const status = mapMatchStatus(match.status);
    // football-data.org only confirms the exact kickoff time once broadcast
    // picks are set (status TIMED) — until then utcDate carries a 00:00
    // placeholder, so keep whatever time we already have rather than
    // overwriting it with midnight.
    const kickoff_time = match.status === "TIMED" ? match.utcDate.slice(11, 16) : null;

    const update: Database["public"]["Tables"]["fixtures"]["Update"] = {
      date,
      status,
      football_data_fixture_id: match.id,
    };
    if (kickoff_time) update.kickoff_time = kickoff_time;

    const changed =
      target.date !== date ||
      target.status !== status ||
      target.football_data_fixture_id !== match.id ||
      (kickoff_time !== null && target.kickoff_time.slice(0, 5) !== kickoff_time);

    if (changed) {
      const { error: updateError } = await supabase.from("fixtures").update(update).eq("id", target.id);
      if (!updateError) updated += 1;
    }
  }

  return { matched: claimed.size, updated, unmatched };
}
