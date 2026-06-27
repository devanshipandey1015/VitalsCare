import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "Sign In — VitalsCare",
};

export default function LoginPage() {
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
            Sign in to track your health readings
          </p>
        </div>

        <Card className="shadow-md" title="Sign In">
          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
