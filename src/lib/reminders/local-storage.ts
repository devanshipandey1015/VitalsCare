import type { ReminderSetting } from "@/lib/reminders/queries";
import { REMINDER_LABELS, type ReminderType } from "@/lib/types/reminder";

const STORAGE_KEY = "vitalscare-reminder-settings";

function defaultSettings(): ReminderSetting[] {
  return (Object.keys(REMINDER_LABELS) as ReminderType[]).map((type) => ({
    reminder_type: type,
    enabled: false,
    reminder_time: REMINDER_LABELS[type].defaultTime,
  }));
}

export function loadLocalReminderSettings(): ReminderSetting[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReminderSetting[]) : null;
  } catch {
    return null;
  }
}

export function saveLocalReminderSettings(settings: ReminderSetting[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function mergeReminderSettings(
  serverSettings: ReminderSetting[],
  localSettings: ReminderSetting[] | null
): ReminderSetting[] {
  if (!localSettings) return serverSettings;

  return serverSettings.map((setting) => {
    const local = localSettings.find(
      (item) => item.reminder_type === setting.reminder_type
    );
    return local ?? setting;
  });
}

export function isMissingTableError(message: string): boolean {
  return (
    message.includes("reminder_preferences") ||
    message.includes("Reminder table not found")
  );
}

export { defaultSettings };
