import { ProtectedShell } from "@/components/layout/ProtectedShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { ExportButtons } from "@/components/export/ExportButtons";
import { ReportPreview } from "@/components/export/ReportPreview";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { getReadings } from "@/lib/readings/queries";
import { buildDoctorReport } from "@/lib/reports/build-report";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = {
  title: "Doctor Export — VitalsCare",
};

export default async function ExportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const readings = await getReadings("all");
  const report = buildDoctorReport(readings, user?.email ?? null);

  return (
    <ProtectedShell>
      <div className="space-y-6 sm:space-y-8">
        <PageHeader
          title="Doctor Export"
          description="Download a report with 7-day and 30-day summaries, averages, extremes, and notes."
        />

        {readings.length === 0 ? (
          <EmptyState
            title="No readings to export"
            description="Add at least one reading before generating a report."
            action={
              <Link href="/readings/new">
                <Button size="lg">Add a Reading</Button>
              </Link>
            }
          />
        ) : (
          <>
            <ExportButtons report={report} />
            <ReportPreview report={report} />
          </>
        )}

      </div>
    </ProtectedShell>
  );
}
