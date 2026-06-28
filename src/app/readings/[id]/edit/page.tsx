import { notFound } from "next/navigation";
import { ProtectedShell } from "@/components/layout/ProtectedShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { ReadingForm } from "@/components/readings/ReadingForm";
import { Card } from "@/components/ui/Card";
import { getReadingById } from "@/lib/readings/queries";

export const metadata = {
  title: "Edit Reading — VitalsCare",
};

interface EditReadingPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditReadingPage({ params }: EditReadingPageProps) {
  const { id } = await params;
  const reading = await getReadingById(id);

  if (!reading) {
    notFound();
  }

  return (
    <ProtectedShell>
      <div className="mx-auto max-w-2xl space-y-6 sm:space-y-8">
        <PageHeader
          title="Edit Reading"
          description="Update your reading. Only blood pressure is required; sugar and weight are optional."
        />

        <Card>
          <ReadingForm reading={reading} mode="edit" />
        </Card>
      </div>
    </ProtectedShell>
  );
}
