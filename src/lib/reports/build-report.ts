import { subDays } from "date-fns";
import type { Reading } from "@/lib/types/reading";
import type { DoctorReport, PeriodStats, ReadingExtremes } from "@/lib/types/report";

function filterByDays(readings: Reading[], days: number): Reading[] {
  const cutoff = subDays(new Date(), days);
  return readings.filter((r) => new Date(r.measured_at) >= cutoff);
}

function computeExtremes(readings: Reading[]): ReadingExtremes {
  if (readings.length === 0) {
    return {
      highestBp: null,
      lowestBp: null,
      highestSugar: null,
      lowestSugar: null,
      highestWeight: null,
      lowestWeight: null,
    };
  }

  const withSugar = readings.filter((r) => r.sugar_value != null);
  const withWeight = readings.filter((r) => r.weight_kg != null);

  return {
    highestBp: readings.reduce((max, r) =>
      r.systolic > max.systolic ? r : max
    ),
    lowestBp: readings.reduce((min, r) =>
      r.systolic < min.systolic ? r : min
    ),
    highestSugar:
      withSugar.length > 0
        ? withSugar.reduce((max, r) =>
            r.sugar_value! > max.sugar_value! ? r : max
          )
        : null,
    lowestSugar:
      withSugar.length > 0
        ? withSugar.reduce((min, r) =>
            r.sugar_value! < min.sugar_value! ? r : min
          )
        : null,
    highestWeight:
      withWeight.length > 0
        ? withWeight.reduce((max, r) =>
            r.weight_kg! > max.weight_kg! ? r : max
          )
        : null,
    lowestWeight:
      withWeight.length > 0
        ? withWeight.reduce((min, r) =>
            r.weight_kg! < min.weight_kg! ? r : min
          )
        : null,
  };
}

function computePeriodStats(
  label: string,
  days: number,
  readings: Reading[]
): PeriodStats {
  const periodReadings = filterByDays(readings, days);

  if (periodReadings.length === 0) {
    return {
      label,
      days,
      count: 0,
      avgSystolic: null,
      avgDiastolic: null,
      avgSugar: null,
      avgWeight: null,
      extremes: computeExtremes([]),
      notes: [],
      readings: [],
    };
  }

  const totals = periodReadings.reduce(
    (acc, r) => ({
      systolic: acc.systolic + r.systolic,
      diastolic: acc.diastolic + r.diastolic,
      sugar: acc.sugar + (r.sugar_value ?? 0),
      sugarCount: acc.sugarCount + (r.sugar_value != null ? 1 : 0),
      weight: acc.weight + (r.weight_kg ?? 0),
      weightCount: acc.weightCount + (r.weight_kg != null ? 1 : 0),
    }),
    { systolic: 0, diastolic: 0, sugar: 0, sugarCount: 0, weight: 0, weightCount: 0 }
  );

  const count = periodReadings.length;

  return {
    label,
    days,
    count,
    avgSystolic: Math.round(totals.systolic / count),
    avgDiastolic: Math.round(totals.diastolic / count),
    avgSugar:
      totals.sugarCount > 0
        ? Math.round(totals.sugar / totals.sugarCount)
        : null,
    avgWeight:
      totals.weightCount > 0
        ? Math.round((totals.weight / totals.weightCount) * 10) / 10
        : null,
    extremes: computeExtremes(periodReadings),
    notes: periodReadings
      .filter((r) => r.notes?.trim())
      .map((r) => ({ measuredAt: r.measured_at, text: r.notes!.trim() })),
    readings: periodReadings,
  };
}

export function buildDoctorReport(
  readings: Reading[],
  patientEmail: string | null
): DoctorReport {
  return {
    generatedAt: new Date().toISOString(),
    patientEmail,
    last7Days: computePeriodStats("Last 7 Days", 7, readings),
    last30Days: computePeriodStats("Last 30 Days", 30, readings),
  };
}
