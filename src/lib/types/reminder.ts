export type ReminderType = "morning" | "evening" | "after_meal";

export interface ReminderPreference {
  id: string;
  user_id: string;
  reminder_type: ReminderType;
  enabled: boolean;
  reminder_time: string;
  created_at: string;
  updated_at: string;
}

export const REMINDER_LABELS: Record<
  ReminderType,
  { title: string; description: string; defaultTime: string; icon: string }
> = {
  morning: {
    title: "Morning Reminder",
    description: "Remind you to log fasting blood pressure and sugar.",
    defaultTime: "08:00",
    icon: "🌅",
  },
  evening: {
    title: "Evening Reminder",
    description: "Remind you to log an evening check before bed.",
    defaultTime: "20:00",
    icon: "🌙",
  },
  after_meal: {
    title: "After Meal Reminder",
    description: "Remind you to log post-meal blood sugar readings.",
    defaultTime: "13:00",
    icon: "🍽️",
  },
};
