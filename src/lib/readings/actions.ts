"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseReadingFormData } from "@/lib/validations/reading";
import {
  isMissingWeightKgColumn,
  weightFieldsForInsert,
} from "@/lib/readings/weight";
import type { ReadingSchema } from "@/lib/validations/reading";

function buildReadingPayload(data: ReadingSchema, useLegacyLbsColumn: boolean) {
  return {
    systolic: data.systolic,
    diastolic: data.diastolic,
    sugar_value: data.sugar_value ?? null,
    sugar_type: data.sugar_type ?? null,
    ...weightFieldsForInsert(data.weight_kg, useLegacyLbsColumn),
    measured_at: data.measured_at,
    notes: data.notes || null,
  };
}

export async function createReading(formData: FormData) {
  const { data, errors } = parseReadingFormData(formData);

  if (!data) {
    return { success: false as const, errors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let payload = { user_id: user.id, ...buildReadingPayload(data, false) };
  let { error } = await supabase.from("readings").insert(payload);

  if (isMissingWeightKgColumn(error)) {
    payload = { user_id: user.id, ...buildReadingPayload(data, true) };
    ({ error } = await supabase.from("readings").insert(payload));
  }

  if (error) {
    return {
      success: false as const,
      errors: { form: error.message },
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/readings");
  revalidatePath("/charts");
  redirect("/dashboard");
}

export async function updateReading(id: string, formData: FormData) {
  const { data, errors } = parseReadingFormData(formData);

  if (!data) {
    return { success: false as const, errors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let payload = buildReadingPayload(data, false);
  let { error } = await supabase.from("readings").update(payload).eq("id", id);

  if (isMissingWeightKgColumn(error)) {
    payload = buildReadingPayload(data, true);
    ({ error } = await supabase.from("readings").update(payload).eq("id", id));
  }

  if (error) {
    return {
      success: false as const,
      errors: { form: error.message },
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/readings");
  revalidatePath("/charts");
  redirect("/readings");
}

export async function deleteReading(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("readings").delete().eq("id", id);

  if (error) {
    return { success: false as const, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/readings");
  revalidatePath("/charts");

  return { success: true as const };
}
