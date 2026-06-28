"use client";

import { formatMeasuredAt } from "@/lib/dates/measured-at";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteReading } from "@/lib/readings/actions";
import type { Reading } from "@/lib/types/reading";
import { formatSugarType } from "@/lib/health/blood-sugar";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ReadingsListProps {
  readings: Reading[];
}

export function ReadingsMobileCards({ readings }: ReadingsListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this reading?")) return;

    setDeletingId(id);
    startTransition(async () => {
      await deleteReading(id);
      setDeletingId(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4 md:hidden">
      {readings.map((reading) => (
        <article
          key={reading.id}
          className={cn(
            "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm",
            deletingId === reading.id && "opacity-50"
          )}
        >
          <p className="text-base font-semibold text-slate-500">
            {formatMeasuredAt(reading.measured_at, "MMM d, yyyy · h:mm a")}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-600">Blood Pressure</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {reading.systolic}/{reading.diastolic}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-600">Blood Sugar</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {reading.sugar_value ?? "—"}
              </p>
              <p className="text-sm text-slate-500">
                {reading.sugar_value != null
                  ? formatSugarType(reading.sugar_type)
                  : "Not recorded"}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-600">Weight</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {reading.weight_kg != null ? reading.weight_kg : "—"}
              </p>
              <p className="text-sm text-slate-500">
                {reading.weight_kg != null ? "kg" : "Not recorded"}
              </p>
            </div>
          </div>

          {reading.notes && (
            <p className="mt-4 text-base text-slate-600">
              <span className="font-semibold">Notes:</span> {reading.notes}
            </p>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link href={`/readings/${reading.id}/edit`}>
              <Button variant="secondary" fullWidth size="sm">
                Edit
              </Button>
            </Link>
            <Button
              variant="danger"
              size="sm"
              fullWidth
              disabled={isPending && deletingId === reading.id}
              onClick={() => handleDelete(reading.id)}
            >
              Delete
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
