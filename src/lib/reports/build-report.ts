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
    };
  }

  return {
    highestBp: readings.reduce((max, r) =>
      r.systolic > max.systolic ? r : max
    ),
    lowestBp: readings.reduce((min, r) =>
      r.systolic < min.systolic ? r : min
    ),
    highestSugar: readings.reduce((max, r) =>
      r.sugar_value > max.sugar_value ? r : max
    ),
    lowestSugar: readings.reduce((min, r) =>
      r.sugar_value < min.sugar_value ? r : min
    ),
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
      extremes: computeExtremes([]),
      notes: [],
      readings: [],
    };
  }

  const totals = periodReadings.reduce(
    (acc, r) => ({
      systolic: acc.systolic + r.systolic,
      diastolic: acc.diastolic + r.diastolic,
      sugar: acc.sugar + r.sugar_value,
    }),
    { systolic: 0, diastolic: 0, sugar: 0 }
  );

  const count = periodReadings.length;

  return {
    label,
    days,
    count,
    avgSystolic: Math.round(totals.systolic / count),
    avgDiastolic: Math.round(totals.diastolic / count),
    avgSugar: Math.round(totals.sugar / count),
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
