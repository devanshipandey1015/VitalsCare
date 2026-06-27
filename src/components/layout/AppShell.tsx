"use client";

import { AppNav } from "@/components/layout/AppNav";
import { MobileNav } from "@/components/layout/MobileNav";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { ReminderEngine } from "@/components/reminders/RemindersManager";
import type { ReminderSetting } from "@/lib/reminders/queries";

interface AppShellProps {
  children: React.ReactNode;
  reminderSettings?: ReminderSetting[];
}

export function AppShell({ children, reminderSettings = [] }: AppShellProps) {
  return (
    <div className="min-h-full bg-gradient-to-b from-teal-50/80 via-slate-50 to-slate-100">
      <MobileTopBar />
      <AppNav />
      <main className="mx-auto max-w-6xl px-4 py-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-8 md:pb-8">
        {children}
      </main>
      <MobileNav />
      <ReminderEngine settings={reminderSettings} />
    </div>
  );
}
