import { AppShell } from "@/components/layout/AppShell";
import { getReminderSettings } from "@/lib/reminders/queries";

export async function ProtectedShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const reminderSettings = await getReminderSettings();

  return (
    <AppShell reminderSettings={reminderSettings}>{children}</AppShell>
  );
}
