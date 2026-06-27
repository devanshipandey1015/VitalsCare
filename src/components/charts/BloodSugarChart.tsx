"use client";

import { formatMeasuredAtChartDay } from "@/lib/dates/measured-at";
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
import { formatSugarType } from "@/lib/health/blood-sugar";
import { Card } from "@/components/ui/Card";

interface BloodSugarChartProps {
  readings: Reading[];
}

export function BloodSugarChart({ readings }: BloodSugarChartProps) {
  const chartData = [...readings]
    .sort(
      (a, b) =>
        new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime()
    )
    .map((reading) => ({
      date: formatMeasuredAtChartDay(reading.measured_at),
      sugar: reading.sugar_value,
      type: formatSugarType(reading.sugar_type),
    }));

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card title="Blood Sugar Over Time">
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
              domain={[0, "auto"]}
              label={{
                value: "mg/dL",
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
              formatter={(value, _name, props) => {
                const payload = props.payload as { type?: string };
                return [`${value} mg/dL (${payload.type ?? ""})`, "Blood Sugar"];
              }}
            />
            <Legend wrapperStyle={{ fontSize: 16, paddingTop: 16 }} />
            <Line
              type="monotone"
              dataKey="sugar"
              name="Blood Sugar"
              stroke="#b45309"
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
