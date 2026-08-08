interface KpiCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  id?: string;
}

export function KpiCard({ label, value, subValue, trend, icon, id }: KpiCardProps) {
  return (
    <div
      className="card p-5 flex items-start gap-4 animate-slide-up"
      id={id}
      aria-label={`${label}: ${value}`}
    >
      {icon && (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-content-muted">{label}</p>
        <p className="mt-1 text-2xl font-bold text-content-primary truncate">{value}</p>
        {subValue && (
          <p
            className={`mt-0.5 text-xs font-medium ${
              trend === "up"
                ? "text-compliance-active"
                : trend === "down"
                  ? "text-compliance-inactive"
                  : "text-content-muted"
            }`}
          >
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
}
