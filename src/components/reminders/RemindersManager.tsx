"use client";

import { useCallback, useEffect, useState } from "react";
import { upsertReminderSetting } from "@/lib/reminders/actions";
import type { ReminderSetting } from "@/lib/reminders/queries";
import {
  REMINDER_LABELS,
  type ReminderType,
} from "@/lib/types/reminder";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const REMINDER_MESSAGES: Record<ReminderType, string> = {
  morning: "Time for your morning vitals — log blood pressure and fasting sugar.",
  evening: "Time for your evening vitals check before bed.",
  after_meal: "Time to log your post-meal blood sugar reading.",
};

const STORAGE_KEY = "vitalscare-reminder-settings";

function saveLocalSettings(settings: ReminderSetting[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

interface RemindersManagerProps {
  initialSettings: ReminderSetting[];
}

export function RemindersManager({ initialSettings }: RemindersManagerProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState<ReminderType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const persist = useCallback(
    async (type: ReminderType, enabled: boolean, reminderTime: string) => {
      setSaving(type);
      setError(null);
      setNotice(null);

      const next = settings.map((s) =>
        s.reminder_type === type ? { ...s, enabled, reminder_time: reminderTime } : s
      );
      setSettings(next);
      saveLocalSettings(next);

      const result = await upsertReminderSetting(type, enabled, reminderTime);

      if (!result.success) {
        setError(result.error);
      } else {
        setNotice("Reminder settings saved.");
      }

      setSaving(null);
    },
    [settings]
  );

  async function handleToggle(type: ReminderType, enabled: boolean) {
    const current = settings.find((s) => s.reminder_type === type)!;

    if (enabled && typeof Notification !== "undefined") {
      if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setError(
            "Browser notifications are blocked. Reminders will only show while this app is open."
          );
        }
      }
    }

    await persist(type, enabled, current.reminder_time);
  }

  async function handleTimeChange(type: ReminderType, reminderTime: string) {
    const current = settings.find((s) => s.reminder_type === type)!;
    await persist(type, current.enabled, reminderTime);
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-base text-red-800">
          {error}
        </div>
      )}
      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-base text-emerald-800">
          {notice}
        </div>
      )}

      {(Object.keys(REMINDER_LABELS) as ReminderType[]).map((type) => {
        const config = REMINDER_LABELS[type];
        const setting = settings.find((s) => s.reminder_type === type)!;
        const isSaving = saving === type;

        return (
          <Card
            key={type}
            className={cn(
              "transition-shadow",
              setting.enabled && "border-teal-200 ring-1 ring-teal-100"
            )}
          >
            <div className="flex items-start gap-4">
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-3xl"
                aria-hidden
              >
                {config.icon}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-slate-900">{config.title}</h2>
                <p className="mt-1 text-base text-slate-600">{config.description}</p>

                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <label className="block">
                    <span className="mb-2 block text-base font-semibold text-slate-700">
                      Reminder time
                    </span>
                    <input
                      type="time"
                      value={setting.reminder_time}
                      disabled={isSaving}
                      onChange={(e) => handleTimeChange(type, e.target.value)}
                      className="w-full max-w-[200px] rounded-xl border-2 border-slate-200 px-4 py-3 text-lg focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
                    />
                  </label>

                  <label className="flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={setting.enabled}
                      disabled={isSaving}
                      onChange={(e) => handleToggle(type, e.target.checked)}
                      className="h-7 w-7 shrink-0 rounded border-slate-300 accent-teal-700"
                    />
                    <span className="text-lg font-semibold text-slate-800">
                      {isSaving ? "Saving..." : setting.enabled ? "Enabled" : "Enable"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </Card>
        );
      })}

    </div>
  );
}

export function ReminderEngine({ settings }: { settings: ReminderSetting[] }) {
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      for (const setting of settings) {
        if (!setting.enabled || setting.reminder_time !== currentTime) continue;

        const firedKey = `vitalscare-fired-${setting.reminder_type}-${today}`;
        if (sessionStorage.getItem(firedKey)) continue;
        sessionStorage.setItem(firedKey, "1");

        const message = REMINDER_MESSAGES[setting.reminder_type];
        const title = REMINDER_LABELS[setting.reminder_type].title;

        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification(title, {
            body: message,
            icon: "/favicon.ico",
          });
        }
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, [settings]);

  return null;
}
