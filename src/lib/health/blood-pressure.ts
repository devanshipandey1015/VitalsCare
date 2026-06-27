export type StatusLevel = "success" | "warning" | "danger";

export interface HealthStatus {
  label: string;
  level: StatusLevel;
  description: string;
}

export function getBloodPressureStatus(
  systolic: number,
  diastolic: number
): HealthStatus {
  if (systolic >= 180 || diastolic >= 120) {
    return {
      label: "Hypertensive Crisis",
      level: "danger",
      description:
        "Very high BP reading detected. Please recheck after resting. If it remains very high or symptoms are present, contact a doctor/emergency care.",
    };
  }

  if (systolic >= 140 || diastolic >= 90) {
    return {
      label: "Stage 2 Hypertension",
      level: "danger",
      description:
        "High BP reading recorded. Consider rechecking and sharing this reading with your healthcare provider.",
    };
  }

  if (systolic >= 130 || diastolic >= 80) {
    return {
      label: "Stage 1 Hypertension",
      level: "warning",
      description:
        "Elevated BP reading recorded. Continue monitoring and share trends with your healthcare provider.",
    };
  }

  if (systolic >= 120 && diastolic < 80) {
    return {
      label: "Elevated",
      level: "warning",
      description:
        "Slightly elevated systolic reading recorded. Keep tracking and share trends with your healthcare provider.",
    };
  }

  return {
    label: "Normal",
    level: "success",
    description: "Blood pressure reading is within a general normal range.",
  };
}

export function isBloodPressureAbnormal(
  systolic: number,
  diastolic: number
): boolean {
  const status = getBloodPressureStatus(systolic, diastolic);
  return status.level !== "success";
}

export function isBloodPressureCritical(
  systolic: number,
  diastolic: number
): boolean {
  return systolic >= 180 || diastolic >= 120;
}
