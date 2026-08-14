/**
 * Maps an opponent name (as stored on the fixture) to a real crest image
 * under /public/brand/clubs. Falls back to the generated colour-circle
 * badge (see ClubBadge) for any opponent without a crest on file yet —
 * e.g. a newly added cup fixture before someone supplies the real logo.
 *
 * Matching is normalised (case/punctuation/"FC" suffix insensitive) so
 * "Leicester City F.C", "Leicester City FC", and "Leicester City" all
 * resolve to the same crest.
 */
const CREST_BY_OPPONENT: Record<string, string> = {
  sunderland: "sunderland",
  liverpool: "liverpool",
  fulham: "fulham",
  "nottingham forest": "nottingham-forest",
  bournemouth: "bournemouth",
  "afc bournemouth": "bournemouth",
  "aston villa": "aston-villa",
  "newcastle united": "newcastle-united",
  newcastle: "newcastle-united",
  brentford: "brentford",
  chelsea: "chelsea",
  "coventry city": "coventry-city",
  "hull city": "hull-city",
  "tottenham hotspur": "tottenham-hotspur",
  tottenham: "tottenham-hotspur",
  arsenal: "arsenal",
  "brighton and hove albion": "brighton",
  brighton: "brighton",
  "crystal palace": "crystal-palace",
  "manchester united": "manchester-united",
  "leeds united": "leeds-united",
  "manchester city": "manchester-city",
  everton: "everton",
  "leicester city": "leicester-city",
};

function normalise(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    // Strip punctuation first so "F.C" collapses to "fc" before the word-boundary check below.
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\b(fc|afc|cf)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getClubCrestPath(opponent: string): string | null {
  const slug = CREST_BY_OPPONENT[normalise(opponent)];
  return slug ? `/brand/clubs/${slug}.png` : null;
}
