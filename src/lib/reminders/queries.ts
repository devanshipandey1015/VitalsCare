import { createClient } from "@/lib/supabase/server";
import {
  REMINDER_LABELS,
  type ReminderPreference,
  type ReminderType,
} from "@/lib/types/reminder";

export interface ReminderSetting {
  reminder_type: ReminderType;
  enabled: boolean;
  reminder_time: string;
}

function normalizeTime(time: string): string {
  return time.slice(0, 5);
}

function defaultSettings(): ReminderSetting[] {
  return (Object.keys(REMINDER_LABELS) as ReminderType[]).map((type) => ({
    reminder_type: type,
    enabled: false,
    reminder_time: REMINDER_LABELS[type].defaultTime,
  }));
}

export async function getReminderSettings(): Promise<ReminderSetting[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reminder_preferences")
    .select("*");

  if (error) {
    return defaultSettings();
  }

  const saved = (data ?? []) as ReminderPreference[];
  const defaults = defaultSettings();

  return defaults.map((d) => {
    const match = saved.find((s) => s.reminder_type === d.reminder_type);
    if (!match) return d;
    return {
      reminder_type: match.reminder_type,
      enabled: match.enabled,
      reminder_time: normalizeTime(match.reminder_time),
    };
  });
}
