const LBS_PER_KG = 2.2046226218;

export function kgToLbs(kg: number): number {
  return Math.round(kg * LBS_PER_KG * 10) / 10;
}

export function lbsToKg(lbs: number): number {
  return Math.round((lbs / LBS_PER_KG) * 10) / 10;
}

type WeightRow = {
  weight_kg?: number | string | null;
  weight_lbs?: number | string | null;
};

export function weightFromRow(row: WeightRow): number | null {
  if (row.weight_kg != null && row.weight_kg !== "") {
    return Number(row.weight_kg);
  }
  if (row.weight_lbs != null && row.weight_lbs !== "") {
    return lbsToKg(Number(row.weight_lbs));
  }
  return null;
}

export function weightFieldsForInsert(
  weightKg: number | null | undefined,
  useLegacyLbsColumn: boolean
): Record<string, number | null> {
  if (weightKg == null) {
    return useLegacyLbsColumn ? { weight_lbs: null } : { weight_kg: null };
  }
  return useLegacyLbsColumn
    ? { weight_lbs: kgToLbs(weightKg) }
    : { weight_kg: weightKg };
}

export function isMissingWeightKgColumn(error: { code?: string; message?: string } | null) {
  return (
    error?.code === "PGRST204" &&
    (error.message?.includes("weight_kg") ?? false)
  );
}
