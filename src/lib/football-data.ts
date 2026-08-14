import "server-only";

const BASE_URL = "https://api.football-data.org/v4";

export interface FootballDataMatch {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: { name: string; shortName: string | null };
  awayTeam: { name: string; shortName: string | null };
}

const STATUS_MAP: Record<string, "upcoming" | "today" | "completed"> = {
  SCHEDULED: "upcoming",
  TIMED: "upcoming",
  POSTPONED: "upcoming",
  SUSPENDED: "upcoming",
  IN_PLAY: "today",
  PAUSED: "today",
  FINISHED: "completed",
  CANCELLED: "upcoming",
};

export function mapMatchStatus(status: string): "upcoming" | "today" | "completed" {
  return STATUS_MAP[status] ?? "upcoming";
}

/** Normalizes a club name for fuzzy matching ("Ipswich Town FC" -> "ipswich town"). */
export function normaliseClubName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    // Strip punctuation first so "F.C" collapses to "fc" before the word-boundary check below.
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\b(fc|afc|cf)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function clubNamesMatch(a: string, b: string): boolean {
  const na = normaliseClubName(a);
  const nb = normaliseClubName(b);
  return na === nb || na.includes(nb) || nb.includes(na);
}

/**
 * Fetches every Premier League match for the given season (the year the
 * season starts, e.g. 2026 for 2026/27) and returns only Ipswich Town's
 * home fixtures. Requires a football-data.org API key — free tier, see
 * https://www.football-data.org/client/register.
 */
export async function fetchIpswichHomeFixtures(
  apiKey: string,
  season: number,
): Promise<FootballDataMatch[]> {
  const res = await fetch(`${BASE_URL}/competitions/PL/matches?season=${season}`, {
    headers: { "X-Auth-Token": apiKey },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`football-data.org request failed (${res.status}): ${body}`);
  }

  const data: { matches: FootballDataMatch[] } = await res.json();

  return data.matches.filter((m) => clubNamesMatch(m.homeTeam.name, "Ipswich Town"));
}
