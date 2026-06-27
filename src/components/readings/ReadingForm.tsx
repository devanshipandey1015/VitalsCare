"use client";

import { format } from "date-fns";
import { useActionState } from "react";
import { createReading, updateReading } from "@/lib/readings/actions";
import type { Reading } from "@/lib/types/reading";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

function getDefaultDateTime(): string {
  return format(new Date(), "yyyy-MM-dd'T'HH:mm");
}

function toLocalDateTime(iso: string): string {
  return format(new Date(iso), "yyyy-MM-dd'T'HH:mm");
}

const sugarTypeOptions = [
  { value: "fasting", label: "Fasting" },
  { value: "post_meal", label: "Post-Meal" },
  { value: "random", label: "Random" },
];

interface ReadingFormProps {
  reading?: Reading;
  mode?: "create" | "edit";
}

export function ReadingForm({ reading, mode = "create" }: ReadingFormProps) {
  const action =
    mode === "edit" && reading
      ? updateReading.bind(null, reading.id)
      : createReading;

  const [state, formAction, pending] = useActionState(
    async (_prev: { errors: Record<string, string> } | null, formData: FormData) => {
      const result = await action(formData);
      return result ?? null;
    },
    null
  );

  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Systolic (top number)"
          name="systolic"
          type="number"
          inputMode="numeric"
          min={70}
          max={250}
          required
          defaultValue={reading?.systolic ?? ""}
          error={errors.systolic}
          hint="Normal range: 70–250 mmHg"
        />
        <Input
          label="Diastolic (bottom number)"
          name="diastolic"
          type="number"
          inputMode="numeric"
          min={40}
          max={150}
          required
          defaultValue={reading?.diastolic ?? ""}
          error={errors.diastolic}
          hint="Normal range: 40–150 mmHg"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Blood Sugar (mg/dL)"
          name="sugar_value"
          type="number"
          inputMode="numeric"
          min={30}
          max={600}
          required
          defaultValue={reading?.sugar_value ?? ""}
          error={errors.sugar_value}
          hint="Normal range: 30–600 mg/dL"
        />
        <Select
          label="Blood Sugar Type"
          name="sugar_type"
          required
          defaultValue={reading?.sugar_type ?? "fasting"}
          options={sugarTypeOptions}
          error={errors.sugar_type}
        />
      </div>

      <Input
        label="Date & Time"
        name="measured_at"
        type="datetime-local"
        required
        defaultValue={
          reading ? toLocalDateTime(reading.measured_at) : getDefaultDateTime()
        }
        error={errors.measured_at}
        hint="You can change this to log readings from previous days"
      />

      <Textarea
        label="Notes (optional)"
        name="notes"
        placeholder="How were you feeling? Any medications taken?"
        defaultValue={reading?.notes ?? ""}
        error={errors.notes}
      />

      {errors.form && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-base font-medium text-red-700">
          {errors.form}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="lg" disabled={pending} fullWidth>
          {pending
            ? "Saving..."
            : mode === "edit"
              ? "Update Reading"
              : "Save Reading"}
        </Button>
      </div>
    </form>
  );
}
