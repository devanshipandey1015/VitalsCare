export type SugarType = "fasting" | "post_meal" | "random";

export interface Reading {
  id: string;
  user_id: string;
  systolic: number;
  diastolic: number;
  sugar_value: number;
  sugar_type: SugarType;
  measured_at: string;
  notes: string | null;
  created_at: string;
}

export interface ReadingFormData {
  systolic: number;
  diastolic: number;
  sugar_value: number;
  sugar_type: SugarType;
  measured_at: string;
  notes?: string;
}

export type DateFilter = "7" | "30" | "all";
