import { format } from "date-fns";
import { formatMeasuredAt } from "@/lib/dates/measured-at";
import type { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { DoctorReport, PeriodStats } from "@/lib/types/report";
import type { Reading } from "@/lib/types/reading";
import { formatSugarType } from "@/lib/health/blood-sugar";

function formatReadingSummary(reading: Reading | null): string {
  if (!reading) return "No data";
  return `${reading.systolic}/${reading.diastolic} mmHg on ${formatMeasuredAt(reading.measured_at)}`;
}

function formatSugarSummary(reading: Reading | null): string {
  if (!reading) return "No data";
  return `${reading.sugar_value} mg/dL (${formatSugarType(reading.sugar_type)}) on ${formatMeasuredAt(reading.measured_at)}`;
}

function getLastAutoTableY(doc: jsPDF): number {
  return (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
    .finalY;
}

function addPeriodSummary(
  doc: jsPDF,
  period: PeriodStats,
  startY: number
): number {
  doc.setFontSize(14);
  doc.setTextColor(15, 118, 110);
  doc.text(period.label, 14, startY);
  let y = startY + 6;

  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: [
      ["Reading Count", String(period.count)],
      [
        "Average Systolic",
        period.avgSystolic ? `${period.avgSystolic} mmHg` : "N/A",
      ],
      [
        "Average Diastolic",
        period.avgDiastolic ? `${period.avgDiastolic} mmHg` : "N/A",
      ],
      [
        "Average Blood Sugar",
        period.avgSugar ? `${period.avgSugar} mg/dL` : "N/A",
      ],
      ["Highest BP Reading", formatReadingSummary(period.extremes.highestBp)],
      ["Lowest BP Reading", formatReadingSummary(period.extremes.lowestBp)],
      [
        "Highest Sugar Reading",
        formatSugarSummary(period.extremes.highestSugar),
      ],
      ["Lowest Sugar Reading", formatSugarSummary(period.extremes.lowestSugar)],
    ],
    theme: "grid",
    headStyles: { fillColor: [15, 118, 110], fontSize: 11 },
    bodyStyles: { fontSize: 10 },
    margin: { left: 14, right: 14 },
  });

  y = getLastAutoTableY(doc) + 10;

  if (period.notes.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(`${period.label} — Notes`, 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [["Date & Time", "Note"]],
      body: period.notes.map((n) => [
        formatMeasuredAt(n.measuredAt),
        n.text,
      ]),
      theme: "striped",
      headStyles: { fillColor: [100, 116, 139], fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      margin: { left: 14, right: 14 },
    });

    y = getLastAutoTableY(doc) + 10;
  }

  if (period.readings.length > 0) {
    doc.setFontSize(12);
    doc.text(`${period.label} — All Readings`, 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [["Date & Time", "BP", "Sugar", "Type", "Notes"]],
      body: period.readings.map((r) => [
        formatMeasuredAt(r.measured_at),
        `${r.systolic}/${r.diastolic}`,
        String(r.sugar_value),
        formatSugarType(r.sugar_type),
        r.notes ?? "—",
      ]),
      theme: "striped",
      headStyles: { fillColor: [100, 116, 139], fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
      columnStyles: { 4: { cellWidth: 50 } },
    });

    y = getLastAutoTableY(doc) + 14;
  }

  return y;
}

export async function downloadPdfReport(report: DoctorReport): Promise<void> {
  const { default: jsPDF } = await import("jspdf");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  let y = 20;

  doc.setFontSize(22);
  doc.setTextColor(15, 118, 110);
  doc.text("VitalsCare Doctor Report", 14, y);

  y += 10;
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Generated: ${format(new Date(report.generatedAt), "MMMM d, yyyy 'at' h:mm a")}`,
    14,
    y
  );
  y += 6;
  doc.text(`Patient Email: ${report.patientEmail ?? "Not provided"}`, 14, y);
  y += 14;

  y = addPeriodSummary(doc, report.last7Days, y);

  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  addPeriodSummary(doc, report.last30Days, y);

  doc.save(`vitalscare-report-${format(new Date(), "yyyy-MM-dd")}.pdf`);
}
