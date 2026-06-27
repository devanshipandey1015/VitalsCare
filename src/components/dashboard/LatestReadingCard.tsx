import { format } from "date-fns";
import type { Reading } from "@/lib/types/reading";
import { formatSugarType } from "@/lib/health/blood-sugar";
import { Card } from "@/components/ui/Card";

interface LatestReadingCardProps {
  reading: Reading;
}

export function LatestReadingCard({ reading }: LatestReadingCardProps) {
  return (
    <Card
      title="Latest Reading"
      subtitle={format(
        new Date(reading.measured_at),
        "EEEE, MMM d, yyyy 'at' h:mm a"
      )}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-5">
          <p className="text-lg font-semibold text-slate-700">Blood Pressure</p>
          <p className="mt-2 text-4xl font-bold text-slate-900 sm:text-5xl">
            {reading.systolic}/{reading.diastolic}
          </p>
          <p className="mt-1 text-lg text-slate-600">mmHg</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-5">
          <p className="text-lg font-semibold text-slate-700">Blood Sugar</p>
          <p className="mt-2 text-4xl font-bold text-slate-900 sm:text-5xl">
            {reading.sugar_value}
          </p>
          <p className="mt-1 text-lg text-slate-600">
            mg/dL · {formatSugarType(reading.sugar_type)}
          </p>
        </div>
      </div>

      {reading.notes && (
        <p className="mt-6 rounded-xl bg-white p-4 text-lg text-slate-700">
          <span className="font-semibold">Notes: </span>
          {reading.notes}
        </p>
      )}
    </Card>
  );
}
