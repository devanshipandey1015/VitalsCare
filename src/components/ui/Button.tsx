import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-teal-700 text-white hover:bg-teal-800 focus-visible:ring-teal-600",
  secondary:
    "bg-white text-teal-900 border-2 border-teal-200 hover:bg-teal-50 focus-visible:ring-teal-600",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
  ghost:
    "bg-transparent text-teal-800 hover:bg-teal-50 focus-visible:ring-teal-600",
};

const sizes = {
  sm: "px-4 py-2 text-base min-h-[44px]",
  md: "px-6 py-3 text-lg min-h-[52px]",
  lg: "px-8 py-4 text-xl min-h-[60px]",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  fullWidth?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  fullWidth = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    />
  );
}
