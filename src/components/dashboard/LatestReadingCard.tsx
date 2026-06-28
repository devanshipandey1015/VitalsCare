import { formatMeasuredAtLong } from "@/lib/dates/measured-at";
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
      subtitle={formatMeasuredAtLong(reading.measured_at)}
    >
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4 sm:p-5">
          <p className="text-base font-semibold text-slate-700 sm:text-lg">
            Blood Pressure
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            {reading.systolic}/{reading.diastolic}
          </p>
          <p className="mt-1 text-base text-slate-600 sm:text-lg">mmHg</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 sm:p-5">
          <p className="text-base font-semibold text-slate-700 sm:text-lg">
            Blood Sugar
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            {reading.sugar_value ?? "—"}
          </p>
          <p className="mt-1 text-base text-slate-600 sm:text-lg">
            {reading.sugar_value != null ? "mg/dL" : "Not recorded"}
          </p>
          {reading.sugar_value != null && (
            <p className="text-sm text-slate-500 sm:text-base">
              {formatSugarType(reading.sugar_type)}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-slate-50 p-4 sm:p-5">
          <p className="text-base font-semibold text-slate-700 sm:text-lg">
            Weight
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            {reading.weight_kg ?? "—"}
          </p>
          <p className="mt-1 text-base text-slate-600 sm:text-lg">
            {reading.weight_kg != null ? "kg" : "Not recorded"}
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
