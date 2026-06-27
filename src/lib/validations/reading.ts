import { z } from "zod";

export const readingSchema = z.object({
  systolic: z
    .number({ error: "Systolic pressure is required" })
    .int("Systolic must be a whole number")
    .min(70, "Systolic must be between 70 and 250")
    .max(250, "Systolic must be between 70 and 250"),
  diastolic: z
    .number({ error: "Diastolic pressure is required" })
    .int("Diastolic must be a whole number")
    .min(40, "Diastolic must be between 40 and 150")
    .max(150, "Diastolic must be between 40 and 150"),
  sugar_value: z
    .number({ error: "Blood sugar value is required" })
    .int("Blood sugar must be a whole number")
    .min(30, "Blood sugar must be between 30 and 600")
    .max(600, "Blood sugar must be between 30 and 600"),
  sugar_type: z.enum(["fasting", "post_meal", "random"], {
    error: "Please select a blood sugar type",
  }),
  measured_at: z
    .string({ error: "Date and time are required" })
    .min(1, "Date and time are required"),
  notes: z.string().max(500, "Notes must be 500 characters or less").optional(),
});

export type ReadingSchema = z.infer<typeof readingSchema>;

export function parseReadingFormData(formData: FormData): {
  data: ReadingSchema | null;
  errors: Record<string, string>;
} {
  const raw = {
    systolic: formData.get("systolic"),
    diastolic: formData.get("diastolic"),
    sugar_value: formData.get("sugar_value"),
    sugar_type: formData.get("sugar_type"),
    measured_at: formData.get("measured_at"),
    notes: formData.get("notes") || undefined,
  };

  const parsed = readingSchema.safeParse({
    systolic: raw.systolic ? Number(raw.systolic) : undefined,
    diastolic: raw.diastolic ? Number(raw.diastolic) : undefined,
    sugar_value: raw.sugar_value ? Number(raw.sugar_value) : undefined,
    sugar_type: raw.sugar_type || undefined,
    measured_at: raw.measured_at || undefined,
    notes: raw.notes || undefined,
  });

  if (parsed.success) {
    return { data: parsed.data, errors: {} };
  }

  const errors: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0]?.toString() ?? "form";
    if (!errors[field]) {
      errors[field] = issue.message;
    }
  }

  return { data: null, errors };
}
