"use client";

import { useState } from "react";
import type { DoctorReport } from "@/lib/types/report";
import { downloadCsvReport } from "@/lib/reports/csv";
import { downloadPdfReport } from "@/lib/reports/pdf";
import { Button } from "@/components/ui/Button";

interface ExportButtonsProps {
  report: DoctorReport;
}

export function ExportButtons({ report }: ExportButtonsProps) {
  const [pdfLoading, setPdfLoading] = useState(false);

  async function handlePdfDownload() {
    setPdfLoading(true);
    try {
      await downloadPdfReport(report);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Button size="lg" onClick={handlePdfDownload} disabled={pdfLoading} fullWidth>
        {pdfLoading ? "Generating PDF..." : "Download PDF Report"}
      </Button>
      <Button
        variant="secondary"
        size="lg"
        onClick={() => downloadCsvReport(report)}
        fullWidth
      >
        Download CSV
      </Button>
    </div>
  );
}
