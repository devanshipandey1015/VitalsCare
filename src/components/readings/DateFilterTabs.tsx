"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { DateFilter } from "@/lib/types/reading";

const filters: Array<{ value: DateFilter; label: string }> = [
  { value: "7", label: "Last 7 Days" },
  { value: "30", label: "Last 30 Days" },
  { value: "all", label: "All Readings" },
];

export function DateFilterTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = (searchParams.get("filter") as DateFilter) || "all";

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = current === filter.value;
        const href =
          filter.value === "all"
            ? pathname
            : `${pathname}?filter=${filter.value}`;

        return (
          <Link
            key={filter.value}
            href={href}
            className={cn(
              "rounded-xl px-5 py-3 text-base font-semibold transition-colors sm:text-lg",
              isActive
                ? "bg-teal-700 text-white"
                : "bg-white text-slate-700 border-2 border-slate-200 hover:bg-teal-50"
            )}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
