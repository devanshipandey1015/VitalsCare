import type { ReminderType } from "@/lib/types/reminder";

const FIRED_PREFIX = "vitalscare-fired-";

function todayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function storageKey(type: ReminderType): string {
  return `${FIRED_PREFIX}${type}-${todayKey()}`;
}

export function wasFiredToday(type: ReminderType): boolean {
  try {
    return localStorage.getItem(storageKey(type)) === "1";
  } catch {
    return false;
  }
}

export function markFiredToday(type: ReminderType): void {
  try {
    localStorage.setItem(storageKey(type), "1");
  } catch {
    // ignore quota / private mode
  }
}

export function parseReminderTime(reminderTime: string): { hours: number; minutes: number } {
  const [hours, minutes] = reminderTime.split(":").map(Number);
  return { hours, minutes };
}

export function isDueNow(reminderTime: string): boolean {
  const { hours, minutes } = parseReminderTime(reminderTime);
  const now = new Date();
  return now.getHours() === hours && now.getMinutes() === minutes;
}

/** True if reminder time passed today within the last `windowMinutes`. */
export function wasMissedRecently(reminderTime: string, windowMinutes = 90): boolean {
  const { hours, minutes } = parseReminderTime(reminderTime);
  const now = new Date();
  const scheduled = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0,
    0
  );

  if (now < scheduled) return false;

  const diffMs = now.getTime() - scheduled.getTime();
  return diffMs <= windowMinutes * 60 * 1000;
}

export function msUntilNextOccurrence(reminderTime: string): number {
  const { hours, minutes } = parseReminderTime(reminderTime);
  const now = new Date();
  const next = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0,
    0
  );

  if (next.getTime() <= now.getTime()) {
    next.setDate(next.getDate() + 1);
  }

  return next.getTime() - now.getTime();
}
