import { formatUKDate, formatUKTime, boxOpensTime, boxClosesTime } from "@/lib/format";
import type { Fixture, Guest, Menu, Settings } from "@/lib/database.types";

export interface EmailContext {
  fixture: Fixture;
  settings: Settings;
  menu: Menu | null;
  guest: Guest | null;
  seatLabel: string | null;
  hostName: string;
  arrivalTime: string | null;
}

export interface EmailDraft {
  subject: string;
  body: string;
}

const SIGNATURE = (hostName: string) =>
  `Kind regards,\n${hostName}\nAchilleus Security Management Limited\nWe Go Further To Protect You!`;

function greet(guest: Guest | null) {
  return guest ? `Dear ${guest.name.split(" ")[0]},` : "Dear Guest,";
}

export function buildInviteEmail(ctx: EmailContext): EmailDraft {
  const { fixture, settings, guest, hostName } = ctx;
  const subject = `You're invited — Ipswich Town vs ${fixture.opponent}, ${formatUKDate(fixture.date)}`;

  const body = [
    greet(guest),
    "",
    `On behalf of Achilleus Security Management Limited, I'd be delighted to welcome you to ${settings.suite_name} at Portman Road for:`,
    "",
    `Ipswich Town FC vs ${fixture.opponent}`,
    `${formatUKDate(fixture.date)} · Kick-off ${formatUKTime(fixture.kickoff_time)}`,
    `${settings.stadium_address}`,
    "",
    `You'll be joining us for pre-match hospitality with a full match day menu, followed by the game from our suite. Full itinerary details, including arrival time and access instructions, will follow closer to the date.`,
    "",
    "Please let us know if you have any dietary requirements or access needs, and do let us know if you're able to join us.",
    "",
    "We look forward to hosting you.",
    "",
    SIGNATURE(hostName),
  ].join("\n");

  return { subject, body };
}

export function buildItineraryEmail(ctx: EmailContext): EmailDraft {
  const { fixture, settings, guest, hostName, seatLabel, arrivalTime } = ctx;
  const opens = boxOpensTime(fixture.date, fixture.kickoff_time, settings.box_opens_before_ko);
  const closes = boxClosesTime(fixture.date, fixture.kickoff_time, settings.box_closes_after_ko);

  const subject = `Match Day Itinerary — Ipswich Town vs ${fixture.opponent}, ${formatUKDate(fixture.date)}`;

  const body = [
    greet(guest),
    "",
    `We're looking forward to welcoming you this ${formatUKDate(fixture.date)} for Ipswich Town vs ${fixture.opponent}. Here's everything you need for the day:`,
    "",
    `Box opens: ${opens}`,
    arrivalTime ? `Your arrival time: ${arrivalTime}` : null,
    `Kick-off: ${formatUKTime(fixture.kickoff_time)}`,
    `Box closes: approx. ${closes}`,
    seatLabel ? `Your seat: ${seatLabel}` : null,
    `Your host: ${hostName}`,
    "",
    `Hospitality entrance: ${settings.hospitality_entrance}`,
    `Box office / gate: ${settings.box_office_location}`,
    `Address: ${settings.stadium_address}`,
    "",
    "Please arrive in good time to allow for parking and access checks. If your plans change, let us know as soon as possible.",
    "",
    SIGNATURE(hostName),
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  return { subject, body };
}

export function buildMenuEmail(ctx: EmailContext): EmailDraft {
  const { fixture, guest, menu, hostName } = ctx;
  const subject = `Match Day Menu — Ipswich Town vs ${fixture.opponent}, ${formatUKDate(fixture.date)}`;

  const menuLines = menu
    ? [
        menu.welcome_drinks ? `Welcome drinks: ${menu.welcome_drinks}` : null,
        menu.starter ? `Starter: ${menu.starter}` : null,
        menu.main_course ? `Main course: ${menu.main_course}` : null,
        menu.dessert ? `Dessert: ${menu.dessert}` : null,
        menu.drinks_included ? `Drinks included: ${menu.drinks_included}` : null,
        menu.additional_notes ? `\n${menu.additional_notes}` : null,
      ].filter((line): line is string => line !== null)
    : ["Our match day menu will be confirmed shortly."];

  const body = [
    greet(guest),
    "",
    `Ahead of Ipswich Town vs ${fixture.opponent} on ${formatUKDate(fixture.date)}, here's a preview of the match day menu we'll be serving in the suite:`,
    "",
    ...menuLines,
    "",
    "Please let us know of any dietary requirements we should be aware of, and we'll happily accommodate them.",
    "",
    SIGNATURE(hostName),
  ].join("\n");

  return { subject, body };
}
