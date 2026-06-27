import Link from "next/link";
import { LatestReadingCard } from "@/components/dashboard/LatestReadingCard";
import { DashboardGreeting } from "@/components/dashboard/DashboardGreeting";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProtectedShell } from "@/components/layout/ProtectedShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { getDisplayName } from "@/lib/auth/display-name";
import { calculateAverages, getReadings } from "@/lib/readings/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Dashboard — VitalsCare",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const displayName = getDisplayName(user);

  const readings = await getReadings("all");
  const latest = readings[0] ?? null;
  const averages = calculateAverages(readings);

  return (
    <ProtectedShell>
      <div className="space-y-6 sm:space-y-8">
        <DashboardGreeting name={displayName} />

        <PageHeader
          title="Your Health Dashboard"
          description="Overview of your latest readings and 7-day averages"
        />

        {!latest ? (
          <EmptyState
            title="No readings yet"
            description="Start by adding your first blood pressure and blood sugar reading."
            action={
              <Link href="/readings/new">
                <Button size="lg">Add Your First Reading</Button>
              </Link>
            }
          />
        ) : (
          <>
            <LatestReadingCard reading={latest} />

            <section>
              <h2 className="mb-3 text-xl font-bold text-slate-900 sm:mb-4 sm:text-2xl">
                7-Day Averages
              </h2>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
                <StatCard
                  title="Avg Systolic"
                  value={averages.systolic ?? "—"}
                  unit={averages.systolic ? "mmHg" : undefined}
                  subtitle={
                    averages.count > 0
                      ? `Based on ${averages.count} reading${averages.count === 1 ? "" : "s"}`
                      : "No readings in last 7 days"
                  }
                />
                <StatCard
                  title="Avg Diastolic"
                  value={averages.diastolic ?? "—"}
                  unit={averages.diastolic ? "mmHg" : undefined}
                />
                <StatCard
                  title="Avg Blood Sugar"
                  value={averages.sugar ?? "—"}
                  unit={averages.sugar ? "mg/dL" : undefined}
                />
                <StatCard
                  title="Total Readings"
                  value={readings.length}
                  subtitle="All time"
                />
              </div>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/readings/new">
                <Button size="lg" fullWidth>
                  Add New Reading
                </Button>
              </Link>
              <Link href="/charts">
                <Button variant="secondary" size="lg" fullWidth>
                  View Charts
                </Button>
              </Link>
              <Link href="/export">
                <Button variant="secondary" size="lg" fullWidth>
                  Doctor Export
                </Button>
              </Link>
            </div>
          </>
        )}

      </div>
    </ProtectedShell>
  );
}
