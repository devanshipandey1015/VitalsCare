import { ProtectedShell } from "@/components/layout/ProtectedShell";
import { RemindersManager } from "@/components/reminders/RemindersManager";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { getReminderSettings } from "@/lib/reminders/queries";

export const metadata = {
  title: "Reminders — VitalsCare",
};

export default async function RemindersPage() {
  const settings = await getReminderSettings();

  return (
    <ProtectedShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader
          title="Reminders"
          description="Set daily reminders to help you stay on track with your readings."
        />

        <Card className="border-teal-200 bg-teal-50/60">
          <div className="flex gap-3">
            <span className="text-2xl" aria-hidden>
              🔔
            </span>
            <div>
              <p className="text-lg font-semibold text-teal-900">
                How reminders work
              </p>
              <p className="mt-1 text-base text-teal-800">
                Choose a time and enable each reminder. Your browser will notify
                you when it&apos;s time to log a reading. Allow notifications
                when prompted for the best experience.
              </p>
            </div>
          </div>
        </Card>

        <RemindersManager initialSettings={settings} />
      </div>
    </ProtectedShell>
  );
}
