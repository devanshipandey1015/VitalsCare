import type { User } from "@supabase/supabase-js";

export function getDisplayName(user: User | null): string {
  if (!user) return "there";

  const metadata = user.user_metadata ?? {};
  const fromMetadata =
    metadata.full_name ?? metadata.name ?? metadata.display_name;

  if (typeof fromMetadata === "string" && fromMetadata.trim()) {
    return fromMetadata.trim();
  }

  if (user.email) {
    const local = user.email.split("@")[0] ?? "there";
    return local
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  }

  return "there";
}
