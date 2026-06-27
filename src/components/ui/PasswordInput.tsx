"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string;
  error?: string;
  hint?: string;
}

export function PasswordInput({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: PasswordInputProps) {
  const inputId = id ?? props.name;
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-lg font-semibold text-slate-800"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          className={cn(
            "w-full rounded-xl border-2 border-slate-200 bg-white py-3 pl-4 pr-14 text-lg text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100",
            error && "border-red-400 focus:border-red-500 focus:ring-red-100",
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 min-h-[44px] min-w-[44px] -translate-y-1/2 rounded-lg px-2 text-sm font-semibold text-teal-700 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-200"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {hint && !error && (
        <p className="text-base text-slate-500">{hint}</p>
      )}
      {error && <p className="text-base font-medium text-red-600">{error}</p>}
    </div>
  );
}
