"use client";

import Link from "next/link";

export function MobileTopBar() {
  return (
    <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-md md:hidden">
      <Link href="/dashboard" className="block text-center">
        <span className="text-xl font-bold text-teal-800">VitalsCare</span>
        <span className="mt-0.5 block text-xs text-slate-500">
          Blood pressure & sugar tracker
        </span>
      </Link>
    </div>
  );
}
