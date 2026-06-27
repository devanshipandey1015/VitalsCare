import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function Card({ children, className, title, subtitle }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6",
        className
      )}
    >
      {(title || subtitle) && (
        <header className="mb-4">
          {title && (
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm leading-snug text-slate-600 sm:text-base lg:text-lg">
              {subtitle}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
