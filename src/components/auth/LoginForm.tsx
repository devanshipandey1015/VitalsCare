"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatAuthError } from "@/lib/auth/errors";
import { getAuthCallbackUrl } from "@/lib/auth/site-url";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  async function handleResendConfirmation() {
    setResendMessage(null);

    const supabase = createClient();
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: getAuthCallbackUrl() },
    });

    setResendMessage(
      resendError
        ? formatAuthError(resendError.message)
        : "Confirmation email sent. Check your inbox and spam folder."
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResendMessage(null);
    setNeedsConfirmation(false);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(formatAuthError(authError.message));
      setNeedsConfirmation(
        authError.message.toLowerCase().includes("email not confirmed")
      );
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <PasswordInput
        label="Password"
        name="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3">
          <p className="text-base font-medium text-red-700">{error}</p>

          {needsConfirmation && (
            <button
              type="button"
              onClick={handleResendConfirmation}
              className="mt-2 text-base font-semibold text-red-800 underline"
            >
              Resend confirmation email
            </button>
          )}
        </div>
      )}

      {resendMessage && (
        <p className="rounded-xl bg-teal-50 px-4 py-3 text-base font-medium text-teal-800">
          {resendMessage}
        </p>
      )}

      <Button type="submit" fullWidth size="lg" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      <p className="text-center text-lg text-slate-600">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-teal-700 underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
