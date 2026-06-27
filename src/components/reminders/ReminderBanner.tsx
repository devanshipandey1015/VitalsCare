"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  REMINDER_EVENT,
  type ReminderEventDetail,
} from "@/lib/reminders/scheduler";

export function ReminderBanner() {
  const [active, setActive] = useState<ReminderEventDetail | null>(null);

  const dismiss = useCallback(() => setActive(null), []);

  useEffect(() => {
    function onReminder(event: Event) {
      const detail = (event as CustomEvent<ReminderEventDetail>).detail;
      setActive(detail);
    }

    window.addEventListener(REMINDER_EVENT, onReminder);
    return () => window.removeEventListener(REMINDER_EVENT, onReminder);
  }, []);

  if (!active) return null;

  return (
    <div
      role="alert"
      className="-mx-4 mb-5 border border-teal-200 bg-teal-700 px-4 py-3 text-white shadow-md sm:-mx-6 sm:rounded-xl"
    >
      <div className="mx-auto flex max-w-6xl items-start gap-3">
        <span className="text-2xl shrink-0" aria-hidden>
          🔔
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold">{active.title}</p>
          <p className="mt-0.5 text-sm text-teal-50">{active.message}</p>
          {active.missed && (
            <p className="mt-1 text-xs text-teal-100">
              You may have missed this while the app was closed.
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Link
            href="/readings/new"
            onClick={dismiss}
            className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-teal-800"
          >
            Log now
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-lg border border-teal-400 px-3 py-2 text-sm font-semibold text-white"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
