export function formatAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("rate limit")) {
    return "Too many sign-up emails were sent. Wait about an hour and try again, or sign in if you already created an account.";
  }

  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return "This email is already registered. Try signing in instead.";
  }

  return message;
}
