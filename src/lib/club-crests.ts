/**
 * Maps an opponent name (as stored on the fixture) to a real crest image
 * under /public/brand/clubs. Falls back to the generated colour-circle
 * badge (see ClubBadge) for any opponent without a crest on file yet —
 * e.g. a newly added cup fixture before someone supplies the real logo.
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
  "brighton & hove albion": "brighton",
  "brighton and hove albion": "brighton",
  brighton: "brighton",
  "crystal palace": "crystal-palace",
  "manchester united": "manchester-united",
  "leeds united": "leeds-united",
  "manchester city": "manchester-city",
  everton: "everton",
};

export function getClubCrestPath(opponent: string): string | null {
  const slug = CREST_BY_OPPONENT[opponent.trim().toLowerCase()];
  return slug ? `/brand/clubs/${slug}.png` : null;
}
