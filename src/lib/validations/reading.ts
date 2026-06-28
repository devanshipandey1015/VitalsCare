import { z } from "zod";

const sugarTypeSchema = z.enum(["fasting", "post_meal", "random"]);

export const readingSchema = z
  .object({
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
      .number()
      .int("Blood sugar must be a whole number")
      .min(30, "Blood sugar must be between 30 and 600")
      .max(600, "Blood sugar must be between 30 and 600")
      .optional(),
    sugar_type: sugarTypeSchema.optional(),
    weight_kg: z
      .number()
      .min(20, "Weight must be between 20 and 500 kg")
      .max(500, "Weight must be between 20 and 500 kg")
      .optional(),
    measured_at: z
      .string({ error: "Date and time are required" })
      .min(1, "Date and time are required"),
    notes: z.string().max(500, "Notes must be 500 characters or less").optional(),
  })
  .superRefine((data, ctx) => {
    const hasSugarValue = data.sugar_value != null;
    const hasSugarType = data.sugar_type != null;

    if (hasSugarValue && !hasSugarType) {
      ctx.addIssue({
        code: "custom",
        path: ["sugar_type"],
        message: "Please select a blood sugar type",
      });
    }

    if (!hasSugarValue && hasSugarType) {
      ctx.addIssue({
        code: "custom",
        path: ["sugar_value"],
        message: "Enter a blood sugar value when selecting a type",
      });
    }
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
    weight_kg: formData.get("weight_kg"),
    measured_at: formData.get("measured_at"),
    notes: formData.get("notes") || undefined,
  };

  const sugarRaw = raw.sugar_value?.toString().trim();
  const weightRaw = raw.weight_kg?.toString().trim();
  const sugarTypeRaw = raw.sugar_type?.toString().trim();

  const parsed = readingSchema.safeParse({
    systolic: raw.systolic ? Number(raw.systolic) : undefined,
    diastolic: raw.diastolic ? Number(raw.diastolic) : undefined,
    sugar_value: sugarRaw ? Number(sugarRaw) : undefined,
    sugar_type: sugarRaw && sugarTypeRaw ? sugarTypeRaw : undefined,
    weight_kg: weightRaw ? Number(weightRaw) : undefined,
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
