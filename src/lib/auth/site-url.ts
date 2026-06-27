/**
 * Base URL for auth redirects (email confirm, etc.).
 * Client: uses current origin. Server: uses NEXT_PUBLIC_SITE_URL.
 */
export function getSiteUrl(origin?: string): string {
  if (origin) return origin.replace(/\/$/, "");

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

export function getAuthCallbackUrl(origin?: string): string {
  return `${getSiteUrl(origin)}/auth/callback`;
}
