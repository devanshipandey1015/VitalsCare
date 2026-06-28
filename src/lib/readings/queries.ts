import { subDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import type { DateFilter, Reading } from "@/lib/types/reading";

export async function getReadings(filter: DateFilter = "all"): Promise<Reading[]> {
  const supabase = await createClient();

  let query = supabase
    .from("readings")
    .select("*")
    .order("measured_at", { ascending: false });

  if (filter === "7") {
    query = query.gte("measured_at", subDays(new Date(), 7).toISOString());
  } else if (filter === "30") {
    query = query.gte("measured_at", subDays(new Date(), 30).toISOString());
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Reading[];
}

export async function getReadingById(id: string): Promise<Reading | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("readings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data as Reading;
}

export function calculateAverages(readings: Reading[]) {
  const last7Days = readings.filter(
    (r) => new Date(r.measured_at) >= subDays(new Date(), 7)
  );

  if (last7Days.length === 0) {
    return { systolic: null, diastolic: null, sugar: null, weight: null, count: 0 };
  }

  const totals = last7Days.reduce(
    (acc, reading) => ({
      systolic: acc.systolic + reading.systolic,
      diastolic: acc.diastolic + reading.diastolic,
      sugar: acc.sugar + (reading.sugar_value ?? 0),
      sugarCount: acc.sugarCount + (reading.sugar_value != null ? 1 : 0),
      weight: acc.weight + (reading.weight_kg ?? 0),
      weightCount: acc.weightCount + (reading.weight_kg != null ? 1 : 0),
    }),
    { systolic: 0, diastolic: 0, sugar: 0, sugarCount: 0, weight: 0, weightCount: 0 }
  );

  const count = last7Days.length;

  return {
    systolic: Math.round(totals.systolic / count),
    diastolic: Math.round(totals.diastolic / count),
    sugar:
      totals.sugarCount > 0
        ? Math.round(totals.sugar / totals.sugarCount)
        : null,
    weight:
      totals.weightCount > 0
        ? Math.round((totals.weight / totals.weightCount) * 10) / 10
        : null,
    count,
  };
}
