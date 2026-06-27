import { format } from "date-fns";
import type { DoctorReport, PeriodStats } from "@/lib/types/report";
import { formatSugarType } from "@/lib/health/blood-sugar";

function escapeCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatReadingLine(
  measuredAt: string,
  systolic: number,
  diastolic: number,
  sugar: number,
  sugarType: string,
  notes: string | null
): string {
  return [
    escapeCsv(format(new Date(measuredAt), "yyyy-MM-dd HH:mm")),
    escapeCsv(`${systolic}/${diastolic}`),
    escapeCsv(sugar),
    escapeCsv(formatSugarType(sugarType as "fasting" | "post_meal" | "random")),
    escapeCsv(notes ?? ""),
  ].join(",");
}

function formatBpExtreme(
  label: string,
  reading: PeriodStats["extremes"]["highestBp"]
): string {
  if (!reading) return `${label},No data`;
  return `${label},${reading.systolic}/${reading.diastolic} mmHg on ${format(new Date(reading.measured_at), "yyyy-MM-dd HH:mm")}`;
}

function formatSugarExtreme(
  label: string,
  reading: PeriodStats["extremes"]["highestSugar"]
): string {
  if (!reading) return `${label},No data`;
  return `${label},${reading.sugar_value} mg/dL (${formatSugarType(reading.sugar_type)}) on ${format(new Date(reading.measured_at), "yyyy-MM-dd HH:mm")}`;
}

function periodSummarySection(period: PeriodStats): string[] {
  const lines = [
    "",
    `"${period.label} Summary"`,
    "Metric,Value",
    `Reading Count,${period.count}`,
    `Average Systolic (mmHg),${period.avgSystolic ?? "N/A"}`,
    `Average Diastolic (mmHg),${period.avgDiastolic ?? "N/A"}`,
    `Average Blood Sugar (mg/dL),${period.avgSugar ?? "N/A"}`,
    formatBpExtreme("Highest BP Reading", period.extremes.highestBp),
    formatBpExtreme("Lowest BP Reading", period.extremes.lowestBp),
    formatSugarExtreme("Highest Sugar Reading", period.extremes.highestSugar),
    formatSugarExtreme("Lowest Sugar Reading", period.extremes.lowestSugar),
  ];

  if (period.notes.length > 0) {
    lines.push("", `"${period.label} Notes"`, "Date & Time,Note");
    for (const note of period.notes) {
      lines.push(
        `${escapeCsv(format(new Date(note.measuredAt), "yyyy-MM-dd HH:mm"))},${escapeCsv(note.text)}`
      );
    }
  }

  if (period.readings.length > 0) {
    lines.push(
      "",
      `"${period.label} Readings"`,
      "Date & Time,BP (mmHg),Sugar (mg/dL),Sugar Type,Notes"
    );
    for (const r of period.readings) {
      lines.push(formatReadingLine(
        r.measured_at,
        r.systolic,
        r.diastolic,
        r.sugar_value,
        r.sugar_type,
        r.notes
      ));
    }
  }

  return lines;
}

export function generateCsvReport(report: DoctorReport): string {
  const lines = [
    "VitalsCare Doctor Report",
    `Generated,${escapeCsv(format(new Date(report.generatedAt), "yyyy-MM-dd HH:mm"))}`,
    `Patient Email,${escapeCsv(report.patientEmail ?? "Not provided")}`,
  ];

  lines.push(...periodSummarySection(report.last7Days));
  lines.push(...periodSummarySection(report.last30Days));

  return lines.join("\n");
}

export function downloadCsvReport(report: DoctorReport): void {
  const csv = generateCsvReport(report);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `vitalscare-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
