export function LoadingSpinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-teal-200 border-t-teal-700"
        role="status"
        aria-label={label}
      />
      <p className="text-lg font-medium text-slate-600">{label}</p>
    </div>
  );
}
