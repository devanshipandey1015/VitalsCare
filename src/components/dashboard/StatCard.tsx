import { Card } from "@/components/ui/Card";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
}

export function StatCard({ title, value, unit, subtitle }: StatCardProps) {
  return (
    <Card className="text-center">
      <p className="text-lg font-semibold text-slate-600">{title}</p>
      <p className="mt-3 text-4xl font-bold text-teal-800 sm:text-5xl">
        {value}
        {unit && (
          <span className="ml-1 text-2xl font-semibold text-slate-500">
            {unit}
          </span>
        )}
      </p>
      {subtitle && (
        <p className="mt-2 text-base text-slate-500 sm:text-lg">{subtitle}</p>
      )}
    </Card>
  );
}
