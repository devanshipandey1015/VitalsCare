"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/readings/new", label: "Add Reading" },
  { href: "/readings", label: "History" },
  { href: "/charts", label: "Charts" },
  { href: "/export", label: "Export" },
  { href: "/settings/reminders", label: "Reminders" },
];

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="hidden border-b border-slate-200 bg-white shadow-sm md:block">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/dashboard" className="shrink-0">
          <span className="text-2xl font-bold text-teal-800">VitalsCare</span>
          <p className="text-sm text-slate-600">Blood pressure & sugar tracker</p>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-xl px-4 py-2.5 text-base font-semibold transition-colors",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-teal-700 text-white"
                  : "bg-slate-100 text-slate-800 hover:bg-teal-50"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Log Out
          </Button>
        </nav>
      </div>
    </header>
  );
}
