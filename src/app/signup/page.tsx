import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "Create Account — VitalsCare",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-teal-50 via-white to-slate-50 px-4 py-8 pb-[env(safe-area-inset-bottom)] sm:py-12">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center">
        <div className="mb-6 text-center sm:mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold text-teal-800 sm:text-4xl">
              VitalsCare
            </span>
          </Link>
          <p className="mt-2 text-base text-slate-600 sm:text-lg">
            Create an account to start tracking
          </p>
        </div>

        <Card className="shadow-md" title="Create Account">
          <SignupForm />
        </Card>
      </div>
    </div>
  );
}
