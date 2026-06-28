import type { Reading } from "@/lib/types/reading";

export interface ReadingExtremes {
  highestBp: Reading | null;
  lowestBp: Reading | null;
  highestSugar: Reading | null;
  lowestSugar: Reading | null;
  highestWeight: Reading | null;
  lowestWeight: Reading | null;
}

export interface PeriodStats {
  label: string;
  days: number;
  count: number;
  avgSystolic: number | null;
  avgDiastolic: number | null;
  avgSugar: number | null;
  avgWeight: number | null;
  extremes: ReadingExtremes;
  notes: Array<{ measuredAt: string; text: string }>;
  readings: Reading[];
}

export interface DoctorReport {
  generatedAt: string;
  patientEmail: string | null;
  last7Days: PeriodStats;
  last30Days: PeriodStats;
}
