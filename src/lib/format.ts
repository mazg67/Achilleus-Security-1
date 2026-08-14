import { addMinutes, format, parse } from "date-fns";

/** Parses a Postgres `date` + `time` pair into a Date. */
function combineDateTime(date: string, time: string): Date {
  const trimmedTime = time.slice(0, 5); // HH:MM:SS -> HH:MM
  return parse(`${date} ${trimmedTime}`, "yyyy-MM-dd HH:mm", new Date());
}

/** "Sat 16 Aug 2026" */
export function formatUKDate(date: string): string {
  return format(parse(date, "yyyy-MM-dd", new Date()), "EEE d MMM yyyy");
}

/** "15:00" from a Postgres time string ("15:00:00"). */
export function formatUKTime(time: string): string {
  return time.slice(0, 5);
}

export function formatKickoff(time: string): string {
  return `KO: ${formatUKTime(time)}`;
}

export function boxOpensTime(date: string, kickoff: string, minutesBefore: number): string {
  const dt = addMinutes(combineDateTime(date, kickoff), -minutesBefore);
  return format(dt, "HH:mm");
}

export function boxClosesTime(date: string, kickoff: string, minutesAfter: number): string {
  const dt = addMinutes(combineDateTime(date, kickoff), minutesAfter);
  return format(dt, "HH:mm");
}

/** Suggested arrival time default for the assign-seat form: KO minus 90 minutes. */
export function defaultArrivalTime(date: string, kickoff: string): string {
  const dt = addMinutes(combineDateTime(date, kickoff), -90);
  return format(dt, "HH:mm");
}

export function formatDateTimeStamp(d: Date): string {
  return format(d, "d MMM yyyy 'at' HH:mm");
}
