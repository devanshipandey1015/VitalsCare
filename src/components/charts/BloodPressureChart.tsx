"use client";

import { format } from "date-fns";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Reading } from "@/lib/types/reading";
import { Card } from "@/components/ui/Card";

interface BloodPressureChartProps {
  readings: Reading[];
}

export function BloodPressureChart({ readings }: BloodPressureChartProps) {
  const chartData = [...readings]
    .sort(
      (a, b) =>
        new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime()
    )
    .map((reading) => ({
      date: format(new Date(reading.measured_at), "MMM d"),
      systolic: reading.systolic,
      diastolic: reading.diastolic,
    }));

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card title="Blood Pressure Over Time">
      <div className="h-72 w-full sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 14, fill: "#475569" }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 14, fill: "#475569" }}
              domain={[40, "auto"]}
              label={{
                value: "mmHg",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 14, fill: "#64748b" },
              }}
            />
            <Tooltip
              contentStyle={{
                fontSize: 16,
                borderRadius: 12,
                border: "1px solid #e2e8f0",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 16, paddingTop: 16 }} />
            <Line
              type="monotone"
              dataKey="systolic"
              name="Systolic"
              stroke="#0f766e"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="diastolic"
              name="Diastolic"
              stroke="#0369a1"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
