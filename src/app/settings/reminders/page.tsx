import { ProtectedShell } from "@/components/layout/ProtectedShell";
import { RemindersManager } from "@/components/reminders/RemindersManager";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { getReminderSettings } from "@/lib/reminders/queries";

export const metadata = {
  title: "Reminders — VitalsCare",
};

export default async function RemindersPage() {
  const { settings, remoteAvailable } = await getReminderSettings();

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
                Choose a time and enable each reminder. On mobile, add VitalsCare to your
                home screen and allow notifications. If a push is missed, you will see an
                in-app reminder when you open the app.
              </p>
            </div>
          </div>
        </Card>

        <RemindersManager
          initialSettings={settings}
          remoteAvailable={remoteAvailable}
        />
      </div>
    </ProtectedShell>
  );
}
