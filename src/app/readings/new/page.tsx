import { ProtectedShell } from "@/components/layout/ProtectedShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { ReadingForm } from "@/components/readings/ReadingForm";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "Add Reading — VitalsCare",
};

export default function NewReadingPage() {
  return (
    <ProtectedShell>
      <div className="mx-auto max-w-2xl space-y-6 sm:space-y-8">
        <PageHeader
          title="Add a Reading"
          description="Record your blood pressure (required). Blood sugar and weight are optional. Date and time default to now, but you can change them for past readings."
        />

        <Card>
          <ReadingForm mode="create" />
        </Card>
      </div>
    </ProtectedShell>
  );
}
