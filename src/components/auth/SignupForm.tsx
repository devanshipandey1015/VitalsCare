"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getAuthCallbackUrl } from "@/lib/auth/site-url";
import { formatAuthError } from "@/lib/auth/errors";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getAuthCallbackUrl(),
      },
    });

    if (authError) {
      setError(formatAuthError(authError.message));
      setLoading(false);
      return;
    }

    // With email confirmation enabled, signUp returns no session — the account
    // is not usable until the emailed link is clicked. Redirecting to a
    // protected route here would just bounce back to /login with no
    // explanation, so show the "check your email" state instead.
    if (!data.session) {
      setConfirmationSent(true);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (confirmationSent) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-teal-50 px-5 py-6 text-center">
          <h2 className="text-2xl font-bold text-teal-900">
            Check your email
          </h2>
          <p className="mt-3 text-lg text-teal-800">
            We sent a confirmation link to{" "}
            <span className="font-semibold break-words">{email}</span>. Click it
            to activate your account, then sign in.
          </p>
          <p className="mt-3 text-base text-teal-700">
            The link can take a few minutes to arrive. Remember to check your
            spam folder.
          </p>
        </div>

        <Link href="/login" className="block">
          <Button type="button" fullWidth size="lg">
            Go to Sign In
          </Button>
        </Link>
      </div>
    );
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
        autoComplete="new-password"
        required
        hint="At least 8 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <PasswordInput
        label="Confirm Password"
        name="confirmPassword"
        autoComplete="new-password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-base font-medium text-red-700">
          {error}
        </p>
      )}

      <Button type="submit" fullWidth size="lg" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-center text-lg text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-teal-700 underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
