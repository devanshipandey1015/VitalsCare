"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const primaryItems = [
  { href: "/dashboard", label: "Home", icon: "🏠" },
  { href: "/readings/new", label: "Add", icon: "➕" },
  { href: "/readings", label: "History", icon: "📋" },
  { href: "/charts", label: "Charts", icon: "📈" },
];

const moreItems = [
  { href: "/export", label: "Doctor Export" },
  { href: "/settings/reminders", label: "Reminders" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const moreActive = moreItems.some((item) => isActive(pathname, item.href));

  return (
    <>
      {moreOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Close menu"
          onClick={() => setMoreOpen(false)}
        />
      )}

      {moreOpen && (
        <div className="fixed inset-x-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl md:hidden">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            More
          </p>
          <div className="space-y-2">
            {moreItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMoreOpen(false)}
                className={cn(
                  "flex min-h-[52px] items-center rounded-xl px-4 text-lg font-semibold",
                  isActive(pathname, item.href)
                    ? "bg-teal-700 text-white"
                    : "bg-slate-50 text-slate-800"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Button variant="secondary" fullWidth onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        </div>
      )}

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md md:hidden"
        aria-label="Main navigation"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1 px-2 py-2">
          {primaryItems.map((item) => {
            const active = isActive(pathname, item.href);
            const isAdd = item.href === "/readings/new";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-center transition-colors",
                  active && !isAdd && "bg-teal-50 text-teal-800",
                  isAdd &&
                    "relative -mt-3 rounded-2xl bg-teal-700 text-white shadow-lg shadow-teal-700/30",
                  !active && !isAdd && "text-slate-600"
                )}
              >
                <span className="text-xl leading-none" aria-hidden>
                  {item.icon}
                </span>
                <span className="text-[11px] font-bold leading-tight sm:text-xs">
                  {item.label}
                </span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMoreOpen((o) => !o)}
            className={cn(
              "flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-center",
              moreActive || moreOpen ? "bg-teal-50 text-teal-800" : "text-slate-600"
            )}
          >
            <span className="text-xl leading-none" aria-hidden>
              ⋯
            </span>
            <span className="text-[11px] font-bold leading-tight sm:text-xs">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
