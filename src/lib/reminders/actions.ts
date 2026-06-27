"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ReminderType } from "@/lib/types/reminder";

export async function upsertReminderSetting(
  reminderType: ReminderType,
  enabled: boolean,
  reminderTime: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false as const, error: "Not signed in." };
  }

  const { error } = await supabase.from("reminder_preferences").upsert(
    {
      user_id: user.id,
      reminder_type: reminderType,
      enabled,
      reminder_time: reminderTime,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,reminder_type" }
  );

  if (error) {
    return {
      success: false as const,
      error:
        error.message.includes("reminder_preferences")
          ? "Reminder table not found. Run supabase/reminders.sql in your Supabase SQL Editor."
          : error.message,
    };
  }

  revalidatePath("/settings/reminders");
  return { success: true as const };
}
