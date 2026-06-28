import type { SugarType } from "@/lib/types/reading";
import type { HealthStatus, StatusLevel } from "@/lib/health/blood-pressure";

export function getBloodSugarStatus(
  value: number,
  type: SugarType
): HealthStatus {
  if (value < 70) {
    return {
      label: "Low",
      level: "danger",
      description:
        "Low blood sugar reading recorded. Recheck if needed and follow your healthcare provider's guidance.",
    };
  }

  switch (type) {
    case "fasting":
      if (value > 130) {
        return {
          label: "High",
          level: "danger",
          description:
            "High fasting blood sugar reading recorded. Share this trend with your healthcare provider.",
        };
      }
      if (value >= 80 && value <= 130) {
        return {
          label: "Target Range",
          level: "success",
          description:
            "Fasting blood sugar is within the general target range (80–130 mg/dL).",
        };
      }
      return {
        label: "Below Target",
        level: "warning",
        description:
          "Fasting blood sugar is below the general target range of 80–130 mg/dL.",
      };

    case "post_meal":
      if (value >= 180) {
        return {
          label: "High",
          level: "danger",
          description:
            "High post-meal blood sugar reading recorded. Share this trend with your healthcare provider.",
        };
      }
      return {
        label: "Target Range",
        level: "success",
        description:
          "Post-meal blood sugar is below the general target of 180 mg/dL.",
      };

    case "random":
      if (value > 180) {
        return {
          label: "High",
          level: "danger",
          description:
            "High random blood sugar reading recorded. Share this trend with your healthcare provider.",
        };
      }
      return {
        label: "Normal",
        level: "success",
        description: "Random blood sugar reading is within a general range.",
      };
  }
}

export function isBloodSugarAbnormal(
  value: number,
  type: SugarType
): boolean {
  const status = getBloodSugarStatus(value, type);
  return status.level !== "success";
}

export function formatSugarType(type: SugarType | null): string {
  if (!type) return "—";
  const labels: Record<SugarType, string> = {
    fasting: "Fasting",
    post_meal: "Post-Meal",
    random: "Random",
  };
  return labels[type];
}

export function getStatusBadgeClasses(level: StatusLevel): string {
  const classes: Record<StatusLevel, string> = {
    success: "bg-emerald-100 text-emerald-800 border-emerald-200",
    warning: "bg-amber-100 text-amber-900 border-amber-200",
    danger: "bg-red-100 text-red-800 border-red-200",
  };
  return classes[level];
}
