import Link from "next/link";
import { Suspense } from "react";
import { ProtectedShell } from "@/components/layout/ProtectedShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { DateFilterTabs } from "@/components/readings/DateFilterTabs";
import { ReadingsTable } from "@/components/readings/ReadingsTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { getReadings } from "@/lib/readings/queries";
import type { DateFilter } from "@/lib/types/reading";

export const metadata = {
  title: "Reading History — VitalsCare",
};

interface ReadingsPageProps {
  searchParams: Promise<{ filter?: string }>;
}

async function ReadingsContent({ filter }: { filter: DateFilter }) {
  const readings = await getReadings(filter);

  if (readings.length === 0) {
    return (
      <EmptyState
        title="No readings found"
        description={
          filter === "all"
            ? "You haven't logged any readings yet."
            : "No readings found for this time period."
        }
        action={
          <Link href="/readings/new">
            <Button size="lg">Add a Reading</Button>
          </Link>
        }
      />
    );
  }

  return <ReadingsTable readings={readings} />;
}

export default async function ReadingsPage({ searchParams }: ReadingsPageProps) {
  const params = await searchParams;
  const filter = (["7", "30", "all"].includes(params.filter ?? "")
    ? params.filter
    : "all") as DateFilter;

  return (
    <ProtectedShell>
      <div className="space-y-6 sm:space-y-8">
        <PageHeader
          title="Reading History"
          description="View, edit, or delete your past readings"
        >
          <Link href="/readings/new">
            <Button size="lg">Add Reading</Button>
          </Link>
        </PageHeader>

        <Suspense fallback={<LoadingSpinner label="Loading filters..." />}>
          <DateFilterTabs />
        </Suspense>

        <Suspense fallback={<LoadingSpinner label="Loading readings..." />}>
          <ReadingsContent filter={filter} />
        </Suspense>
      </div>
    </ProtectedShell>
  );
}
