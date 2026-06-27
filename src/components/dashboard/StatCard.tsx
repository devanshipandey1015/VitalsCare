import { Card } from "@/components/ui/Card";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
}

export function StatCard({ title, value, unit, subtitle }: StatCardProps) {
  return (
    <Card className="flex min-h-[140px] flex-col justify-center px-3 py-4 text-center sm:min-h-0 sm:px-6 sm:py-6">
      <p className="text-sm font-semibold leading-snug text-slate-600 sm:text-lg">
        {title}
      </p>
      <div className="mt-2 flex flex-col items-center gap-0.5 sm:mt-3">
        <p className="text-3xl font-bold leading-none text-teal-800 sm:text-4xl lg:text-5xl">
          {value}
        </p>
        {unit && (
          <p className="text-sm font-semibold text-slate-500 sm:text-xl">
            {unit}
          </p>
        )}
      </div>
      {subtitle && (
        <p className="mt-2 text-xs leading-snug text-slate-500 sm:text-base lg:text-lg">
          {subtitle}
        </p>
      )}
    </Card>
  );
}
