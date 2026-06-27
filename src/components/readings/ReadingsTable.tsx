"use client";

import { formatMeasuredAt } from "@/lib/dates/measured-at";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteReading } from "@/lib/readings/actions";
import type { Reading } from "@/lib/types/reading";
import { formatSugarType } from "@/lib/health/blood-sugar";
import { Button } from "@/components/ui/Button";
import { ReadingsMobileCards } from "@/components/readings/ReadingsMobileCards";
import { cn } from "@/lib/utils";

interface ReadingsTableProps {
  readings: Reading[];
}

export function ReadingsTable({ readings }: ReadingsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this reading?")) {
      return;
    }

    setDeletingId(id);
    startTransition(async () => {
      await deleteReading(id);
      setDeletingId(null);
      router.refresh();
    });
  }

  return (
    <>
      <ReadingsMobileCards readings={readings} />

      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
      <table className="min-w-full text-left">
        <thead className="bg-slate-50">
          <tr>
            {["Date & Time", "BP", "Sugar", "Type", "Notes", "Actions"].map(
              (header) => (
                <th
                  key={header}
                  className="px-4 py-4 text-base font-bold text-slate-700 sm:text-lg"
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {readings.map((reading) => (
            <tr
              key={reading.id}
              className={cn(
                "border-t border-slate-100",
                deletingId === reading.id && "opacity-50"
              )}
            >
              <td className="px-4 py-4 text-base text-slate-800 sm:text-lg">
                {formatMeasuredAt(reading.measured_at)}
              </td>
              <td className="px-4 py-4 text-base font-semibold text-slate-900 sm:text-lg">
                {reading.systolic}/{reading.diastolic}
              </td>
              <td className="px-4 py-4 text-base font-semibold text-slate-900 sm:text-lg">
                {reading.sugar_value}
              </td>
              <td className="px-4 py-4 text-base text-slate-700 sm:text-lg">
                {formatSugarType(reading.sugar_type)}
              </td>
              <td className="max-w-[200px] truncate px-4 py-4 text-base text-slate-600">
                {reading.notes || "—"}
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link href={`/readings/${reading.id}/edit`}>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={isPending && deletingId === reading.id}
                    onClick={() => handleDelete(reading.id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}
