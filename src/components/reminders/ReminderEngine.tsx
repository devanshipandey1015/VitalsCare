"use client";

import { useEffect } from "react";
import type { ReminderSetting } from "@/lib/reminders/queries";
import { fireReminder, checkReminders, scheduleNextReminders } from "@/lib/reminders/scheduler";
import type { ReminderType } from "@/lib/types/reminder";

export function ReminderEngine({ settings }: { settings: ReminderSetting[] }) {
  useEffect(() => {
    void checkReminders(settings, { includeMissed: true });

    const cancelSchedule = scheduleNextReminders(settings, (type: ReminderType) => {
      void fireReminder(type);
    });

    const backupInterval = setInterval(() => {
      void checkReminders(settings);
    }, 60_000);

    function onVisible() {
      if (document.visibilityState === "visible") {
        void checkReminders(settings, { includeMissed: true });
      }
    }

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    return () => {
      cancelSchedule();
      clearInterval(backupInterval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [settings]);

  return null;
}
