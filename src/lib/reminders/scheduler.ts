import type { ReminderSetting } from "@/lib/reminders/queries";
import {
  isDueNow,
  markFiredToday,
  msUntilNextOccurrence,
  wasFiredToday,
  wasMissedRecently,
} from "@/lib/reminders/fired-tracking";
import {
  loadLocalReminderSettings,
  mergeReminderSettings,
} from "@/lib/reminders/local-storage";
import { showReminderNotification } from "@/lib/reminders/notifications";
import {
  REMINDER_LABELS,
  type ReminderType,
} from "@/lib/types/reminder";

const REMINDER_MESSAGES: Record<ReminderType, string> = {
  morning: "Time for your morning vitals — log blood pressure and fasting sugar.",
  evening: "Time for your evening vitals check before bed.",
  after_meal: "Time to log your post-meal blood sugar reading.",
};

export const REMINDER_EVENT = "vitalscare-reminder";

export interface ReminderEventDetail {
  type: ReminderType;
  title: string;
  message: string;
  missed?: boolean;
}

function dispatchReminder(detail: ReminderEventDetail) {
  window.dispatchEvent(new CustomEvent(REMINDER_EVENT, { detail }));
}

export async function fireReminder(
  type: ReminderType,
  options?: { missed?: boolean }
): Promise<void> {
  if (wasFiredToday(type)) return;

  markFiredToday(type);
  const title = REMINDER_LABELS[type].title;
  const message = REMINDER_MESSAGES[type];

  const shown = await showReminderNotification(title, message, `vitalscare-${type}`);

  dispatchReminder({
    type,
    title,
    message,
    missed: options?.missed ?? !shown,
  });
}

export function getActiveSettings(serverSettings: ReminderSetting[]): ReminderSetting[] {
  const local = loadLocalReminderSettings();
  return mergeReminderSettings(serverSettings, local);
}

export async function checkReminders(
  serverSettings: ReminderSetting[],
  options?: { includeMissed?: boolean }
): Promise<void> {
  const settings = getActiveSettings(serverSettings);
  const includeMissed = options?.includeMissed ?? false;

  for (const setting of settings) {
    if (!setting.enabled || wasFiredToday(setting.reminder_type)) continue;

    if (isDueNow(setting.reminder_time)) {
      await fireReminder(setting.reminder_type);
      continue;
    }

    if (includeMissed && wasMissedRecently(setting.reminder_time)) {
      await fireReminder(setting.reminder_type, { missed: true });
    }
  }
}

export function scheduleNextReminders(
  serverSettings: ReminderSetting[],
  onFire: (type: ReminderType) => void
): () => void {
  const timeouts: ReturnType<typeof setTimeout>[] = [];
  let cancelled = false;
  const settings = getActiveSettings(serverSettings);

  function scheduleOne(type: ReminderType, reminderTime: string) {
    if (cancelled) return;

    const delay = msUntilNextOccurrence(reminderTime);
    const timeout = setTimeout(() => {
      if (cancelled) return;
      onFire(type);
      scheduleOne(type, reminderTime);
    }, delay);
    timeouts.push(timeout);
  }

  for (const setting of settings) {
    if (!setting.enabled) continue;
    scheduleOne(setting.reminder_type, setting.reminder_time);
  }

  return () => {
    cancelled = true;
    for (const timeout of timeouts) clearTimeout(timeout);
  };
}
