import { format } from "date-fns";

/**
 * Readings are stored as the user's chosen date/time (wall clock) in UTC fields.
 * This avoids server/client timezone mismatches on Vercel vs the browser.
 */

export function localDatetimeToStoredIso(localValue: string): string {
  const [datePart, timePart] = localValue.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  return new Date(Date.UTC(year, month - 1, day, hours, minutes, 0)).toISOString();
}

export function storedIsoToLocalDatetime(iso: string): string {
  const date = new Date(iso);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function toWallClockDate(iso: string): Date {
  const date = new Date(iso);
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
}

export function formatMeasuredAt(
  iso: string,
  pattern = "MMM d, yyyy h:mm a"
): string {
  return format(toWallClockDate(iso), pattern);
}

export function formatMeasuredAtLong(iso: string): string {
  return formatMeasuredAt(iso, "EEEE, MMM d, yyyy 'at' h:mm a");
}

export function formatMeasuredAtChartDay(iso: string): string {
  return formatMeasuredAt(iso, "MMM d");
}
