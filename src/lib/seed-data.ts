// Shared seed data — the 2026/27 Ipswich Town home Premier League fixture
// list, sample guests, and the 14-seat configuration. Used by both the seed
// script and as a fallback when the football-data.org feed has no data yet
// for a given match (e.g. very early in the season before their fixture ID
// exists), see lib/fixtures-feed.ts.

export interface SeedFixture {
  date: string; // YYYY-MM-DD
  kickoff_time: string; // HH:MM
  opponent: string;
  opponent_primary_colour: string;
  opponent_secondary_colour: string;
  opponent_abbreviation: string;
}

export const SEED_FIXTURES: SeedFixture[] = [
  { date: "2026-08-16", kickoff_time: "15:00", opponent: "Fulham", opponent_primary_colour: "#000000", opponent_secondary_colour: "#FFFFFF", opponent_abbreviation: "FUL" },
  { date: "2026-08-30", kickoff_time: "12:30", opponent: "Chelsea", opponent_primary_colour: "#034694", opponent_secondary_colour: "#FFFFFF", opponent_abbreviation: "CHE" },
  { date: "2026-09-13", kickoff_time: "15:00", opponent: "Newcastle United", opponent_primary_colour: "#241F20", opponent_secondary_colour: "#FFFFFF", opponent_abbreviation: "NEW" },
  { date: "2026-09-27", kickoff_time: "15:00", opponent: "Brighton & Hove Albion", opponent_primary_colour: "#0057B8", opponent_secondary_colour: "#FFFFFF", opponent_abbreviation: "BHA" },
  { date: "2026-10-18", kickoff_time: "15:00", opponent: "Nottingham Forest", opponent_primary_colour: "#DD0000", opponent_secondary_colour: "#FFFFFF", opponent_abbreviation: "NFO" },
  { date: "2026-11-01", kickoff_time: "15:00", opponent: "Wolverhampton Wanderers", opponent_primary_colour: "#FDB913", opponent_secondary_colour: "#231F20", opponent_abbreviation: "WOL" },
  { date: "2026-11-08", kickoff_time: "15:00", opponent: "Aston Villa", opponent_primary_colour: "#670E36", opponent_secondary_colour: "#95BFE5", opponent_abbreviation: "AVL" },
  { date: "2026-11-22", kickoff_time: "14:00", opponent: "Leeds United", opponent_primary_colour: "#1D428A", opponent_secondary_colour: "#FFCD00", opponent_abbreviation: "LEE" },
  { date: "2026-12-06", kickoff_time: "12:30", opponent: "Arsenal", opponent_primary_colour: "#EF0107", opponent_secondary_colour: "#FFFFFF", opponent_abbreviation: "ARS" },
  { date: "2026-12-20", kickoff_time: "15:00", opponent: "Tottenham Hotspur", opponent_primary_colour: "#132257", opponent_secondary_colour: "#FFFFFF", opponent_abbreviation: "TOT" },
  { date: "2026-12-26", kickoff_time: "12:30", opponent: "Crystal Palace", opponent_primary_colour: "#1B458F", opponent_secondary_colour: "#C4122E", opponent_abbreviation: "CRY" },
  { date: "2027-01-03", kickoff_time: "15:00", opponent: "Manchester City", opponent_primary_colour: "#6CABDD", opponent_secondary_colour: "#1C2C5B", opponent_abbreviation: "MCI" },
  { date: "2027-01-17", kickoff_time: "15:00", opponent: "Southampton", opponent_primary_colour: "#D71920", opponent_secondary_colour: "#FFFFFF", opponent_abbreviation: "SOU" },
  { date: "2027-02-07", kickoff_time: "15:00", opponent: "Brentford", opponent_primary_colour: "#E30613", opponent_secondary_colour: "#FFD700", opponent_abbreviation: "BRE" },
  { date: "2027-02-21", kickoff_time: "15:00", opponent: "West Ham United", opponent_primary_colour: "#7A263A", opponent_secondary_colour: "#1BB1E7", opponent_abbreviation: "WHU" },
  { date: "2027-03-07", kickoff_time: "15:00", opponent: "Bournemouth", opponent_primary_colour: "#DA291C", opponent_secondary_colour: "#000000", opponent_abbreviation: "BOU" },
  { date: "2027-03-21", kickoff_time: "17:30", opponent: "Manchester United", opponent_primary_colour: "#DA291C", opponent_secondary_colour: "#FBE122", opponent_abbreviation: "MUN" },
  { date: "2027-04-11", kickoff_time: "15:00", opponent: "Liverpool", opponent_primary_colour: "#C8102E", opponent_secondary_colour: "#FFFFFF", opponent_abbreviation: "LIV" },
  { date: "2027-05-03", kickoff_time: "15:00", opponent: "Everton", opponent_primary_colour: "#003399", opponent_secondary_colour: "#FFFFFF", opponent_abbreviation: "EVE" },
];

export interface SeedSeat {
  id: number;
  label: string;
  type: "fixed" | "rotating" | "host";
}

export const SEED_SEATS: SeedSeat[] = [
  ...Array.from({ length: 2 }, (_, i) => ({ id: i + 1, label: `Seat ${i + 1}`, type: "fixed" as const })),
  ...Array.from({ length: 10 }, (_, i) => ({ id: i + 3, label: `Seat ${i + 3}`, type: "rotating" as const })),
  ...Array.from({ length: 2 }, (_, i) => ({ id: i + 13, label: `Host ${i + 1}`, type: "host" as const })),
];

export interface SeedGuest {
  name: string;
  company: string;
  dietary: string;
}

export const SEED_GUESTS: SeedGuest[] = [
  { name: "James Hargreaves", company: "Hargreaves & Partners", dietary: "None" },
  { name: "Sarah Mitchell", company: "Mitchell Consulting", dietary: "Vegetarian" },
  { name: "David Chen", company: "Chen Capital", dietary: "No shellfish" },
  { name: "Emma Thompson", company: "Thompson Legal LLP", dietary: "Gluten-free" },
  { name: "Robert Walsh", company: "Walsh Construction", dietary: "None" },
  { name: "Claire Winters", company: "Winters PR", dietary: "Vegan" },
  { name: "Tom Bradley", company: "Bradley Investments", dietary: "None" },
  { name: "Louise Gray", company: "Gray Healthcare", dietary: "Diabetic-friendly" },
  { name: "Mark Sullivan", company: "Sullivan Tech", dietary: "None" },
  { name: "Karen Price", company: "Price Accounting", dietary: "Halal" },
];
