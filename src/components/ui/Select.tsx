import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export function Select({
  label,
  error,
  options,
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <div className="space-y-2">
      <label
        htmlFor={selectId}
        className="block text-lg font-semibold text-slate-800"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={cn(
          "w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-lg text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100",
          error && "border-red-400 focus:border-red-500 focus:ring-red-100",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-base font-medium text-red-600">{error}</p>}
    </div>
  );
}
