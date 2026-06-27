interface DashboardGreetingProps {
  name: string;
}

export function DashboardGreeting({ name }: DashboardGreetingProps) {
  return (
    <div className="rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-700 to-teal-600 px-5 py-6 text-white shadow-sm sm:px-8 sm:py-7">
      <p className="text-2xl font-bold sm:text-3xl">Hello {name}!</p>
      <p className="mt-2 text-base text-teal-50 sm:text-lg">
        Welcome back to your health dashboard.
      </p>
    </div>
  );
}
