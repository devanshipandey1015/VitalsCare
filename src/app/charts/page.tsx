import Link from "next/link";
import { ProtectedShell } from "@/components/layout/ProtectedShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { BloodPressureChart } from "@/components/charts/BloodPressureChart";
import { BloodSugarChart } from "@/components/charts/BloodSugarChart";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { getReadings } from "@/lib/readings/queries";

export const metadata = {
  title: "Charts — VitalsCare",
};

export default async function ChartsPage() {
  const readings = await getReadings("all");

  return (
    <ProtectedShell>
      <div className="space-y-6 sm:space-y-8">
        <PageHeader
          title="Health Trends"
          description="Visual charts of your blood pressure and blood sugar over time"
        />

        {readings.length === 0 ? (
          <EmptyState
            title="No data to chart yet"
            description="Add a few readings to see your trends over time."
            action={
              <Link href="/readings/new">
                <Button size="lg">Add a Reading</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-8">
            <BloodPressureChart readings={readings} />
            <BloodSugarChart readings={readings} />
          </div>
        )}

      </div>
    </ProtectedShell>
  );
}
