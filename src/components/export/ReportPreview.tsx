import { format } from "date-fns";
import type { DoctorReport, PeriodStats } from "@/lib/types/report";
import { formatSugarType } from "@/lib/health/blood-sugar";
import { Card } from "@/components/ui/Card";

function PeriodPreview({ period }: { period: PeriodStats }) {
  const { extremes } = period;

  return (
    <Card title={period.label} subtitle={`${period.count} reading${period.count === 1 ? "" : "s"}`}>
      {period.count === 0 ? (
        <p className="text-lg text-slate-600">No readings in this period.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-base font-semibold text-slate-600">Average BP</p>
            <p className="text-2xl font-bold text-slate-900">
              {period.avgSystolic}/{period.avgDiastolic}{" "}
              <span className="text-lg font-normal text-slate-500">mmHg</span>
            </p>
          </div>
          <div>
            <p className="text-base font-semibold text-slate-600">Average Sugar</p>
            <p className="text-2xl font-bold text-slate-900">
              {period.avgSugar}{" "}
              <span className="text-lg font-normal text-slate-500">mg/dL</span>
            </p>
          </div>
          {extremes.highestBp && (
            <div>
              <p className="text-base font-semibold text-slate-600">Highest BP</p>
              <p className="text-lg text-slate-800">
                {extremes.highestBp.systolic}/{extremes.highestBp.diastolic} mmHg
              </p>
              <p className="text-base text-slate-500">
                {format(new Date(extremes.highestBp.measured_at), "MMM d, yyyy h:mm a")}
              </p>
            </div>
          )}
          {extremes.lowestBp && (
            <div>
              <p className="text-base font-semibold text-slate-600">Lowest BP</p>
              <p className="text-lg text-slate-800">
                {extremes.lowestBp.systolic}/{extremes.lowestBp.diastolic} mmHg
              </p>
              <p className="text-base text-slate-500">
                {format(new Date(extremes.lowestBp.measured_at), "MMM d, yyyy h:mm a")}
              </p>
            </div>
          )}
          {extremes.highestSugar && (
            <div>
              <p className="text-base font-semibold text-slate-600">Highest Sugar</p>
              <p className="text-lg text-slate-800">
                {extremes.highestSugar.sugar_value} mg/dL (
                {formatSugarType(extremes.highestSugar.sugar_type)})
              </p>
            </div>
          )}
          {extremes.lowestSugar && (
            <div>
              <p className="text-base font-semibold text-slate-600">Lowest Sugar</p>
              <p className="text-lg text-slate-800">
                {extremes.lowestSugar.sugar_value} mg/dL (
                {formatSugarType(extremes.lowestSugar.sugar_type)})
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

interface ReportPreviewProps {
  report: DoctorReport;
}

export function ReportPreview({ report }: ReportPreviewProps) {
  return (
    <div className="space-y-6">
      <PeriodPreview period={report.last7Days} />
      <PeriodPreview period={report.last30Days} />
    </div>
  );
}
