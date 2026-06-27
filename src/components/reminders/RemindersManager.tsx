"use client";

import { useCallback, useEffect, useState } from "react";
import { upsertReminderSetting } from "@/lib/reminders/actions";
import type { ReminderSetting } from "@/lib/reminders/queries";
import {
  isMissingTableError,
  loadLocalReminderSettings,
  mergeReminderSettings,
  saveLocalReminderSettings,
} from "@/lib/reminders/local-storage";
import { requestNotificationPermission } from "@/lib/reminders/notifications";
import {
  REMINDER_LABELS,
  type ReminderType,
} from "@/lib/types/reminder";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface RemindersManagerProps {
  initialSettings: ReminderSetting[];
  remoteAvailable?: boolean;
}

export function RemindersManager({
  initialSettings,
  remoteAvailable = true,
}: RemindersManagerProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState<ReminderType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [localOnly, setLocalOnly] = useState(!remoteAvailable);

  useEffect(() => {
    const local = loadLocalReminderSettings();
    setSettings(mergeReminderSettings(initialSettings, local));
  }, [initialSettings]);

  const persist = useCallback(
    async (type: ReminderType, enabled: boolean, reminderTime: string) => {
      setSaving(type);
      setError(null);
      setNotice(null);

      const next = settings.map((s) =>
        s.reminder_type === type ? { ...s, enabled, reminder_time: reminderTime } : s
      );
      setSettings(next);
      saveLocalReminderSettings(next);

      const result = await upsertReminderSetting(type, enabled, reminderTime);

      if (!result.success) {
        if (isMissingTableError(result.error)) {
          setLocalOnly(true);
          setNotice("Reminder saved on this device.");
        } else {
          setError(result.error);
        }
      } else {
        setLocalOnly(false);
        setNotice("Reminder settings saved.");
      }

      setSaving(null);
    },
    [settings]
  );

  async function handleToggle(type: ReminderType, enabled: boolean) {
    const current = settings.find((s) => s.reminder_type === type)!;

    if (enabled) {
      const result = await requestNotificationPermission();
      if (result !== "granted") {
        setError(
          "Browser notifications are blocked. Reminders will only show while this app is open."
        );
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
      {localOnly && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-base text-amber-900">
          Reminders are saved on this device only. To sync across devices, run the
          reminder section in{" "}
          <code className="rounded bg-amber-100 px-1.5 py-0.5 text-sm">
            supabase/schema.sql
          </code>{" "}
          in your Supabase SQL Editor.
        </div>
      )}
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

