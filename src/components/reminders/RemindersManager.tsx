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
import {
  getNotificationPermission,
  getNotificationSupport,
  isIosDevice,
  isStandaloneApp,
  requestNotificationPermission,
  showReminderNotification,
} from "@/lib/reminders/notifications";
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
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [support, setSupport] = useState<ReturnType<typeof getNotificationSupport>>("full");
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    setPermission(getNotificationPermission());
    setSupport(getNotificationSupport());
  }, []);
  useEffect(() => {
    const local = loadLocalReminderSettings();
    setSettings(mergeReminderSettings(initialSettings, local));
  }, [initialSettings]);

  async function handleEnableNotifications() {
    const result = await requestNotificationPermission();
    setPermission(result);
    setSupport(getNotificationSupport());
  }

  async function handleTestNotification() {
    setTesting(true);
    const shown = await showReminderNotification(
      "VitalsCare test",
      "If you see this, reminders are working on this device.",
      "vitalscare-test"
    );
    if (!shown) {
      setError(
        "Could not show a notification. Follow the mobile setup steps below, then try again."
      );
    } else {
      setNotice("Test notification sent.");
      setError(null);
    }
    setTesting(false);
  }

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
      setPermission(result);
      setSupport(getNotificationSupport());
      if (result !== "granted") {
        setError(
          "Notifications are blocked. You will still see in-app reminders when you open VitalsCare."
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

      <Card className="border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Notification status</h2>
        <p className="mt-2 text-base text-slate-600">
          {permission === "granted"
            ? "Notifications are allowed on this device."
            : permission === "denied"
              ? "Notifications are blocked in your browser settings."
              : "Notifications are not enabled yet."}
        </p>
        {support === "in-app-only" && isIosDevice() && !isStandaloneApp() && (
          <p className="mt-2 text-base text-amber-800">
            On iPhone, add VitalsCare to your Home Screen first, then allow notifications.
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          {permission !== "granted" && permission !== "unsupported" && (
            <button
              type="button"
              onClick={handleEnableNotifications}
              className="rounded-xl bg-teal-700 px-4 py-3 text-base font-semibold text-white"
            >
              Allow notifications
            </button>
          )}
          <button
            type="button"
            onClick={handleTestNotification}
            disabled={testing}
            className="rounded-xl border-2 border-slate-200 px-4 py-3 text-base font-semibold text-slate-800 disabled:opacity-50"
          >
            {testing ? "Sending..." : "Send test notification"}
          </button>
        </div>
      </Card>

      <Card className="border-slate-200 bg-slate-50/80">
        <h2 className="text-lg font-bold text-slate-900">Mobile setup (important)</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-base text-slate-700">
          <li>
            <strong>iPhone:</strong> Tap Share → Add to Home Screen, open VitalsCare from
            the icon, then enable notifications above.
          </li>
          <li>
            <strong>Android:</strong> Tap the browser menu → Install app (or Add to Home
            Screen), then allow notifications.
          </li>
          <li>
            Phone browsers cannot run reminders when the app is fully closed. If you miss
            a push notification, you will see an in-app reminder when you open VitalsCare.
          </li>
        </ul>
      </Card>

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

