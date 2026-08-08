import type { LoadStatus } from "@freightbridge/shared-types";

interface LoadStatusBadgeProps {
  status: LoadStatus;
  className?: string;
}

const STATUS_CONFIG: Record<LoadStatus, { label: string; className: string }> = {
  DRAFT: {
    label: "Draft",
    className: "bg-slate-100 text-slate-600 border border-slate-200",
  },
  OPEN: {
    label: "Open",
    className: "bg-action-light text-action border border-blue-200",
  },
  BOOKED: {
    label: "Booked",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  IN_TRANSIT: {
    label: "In Transit",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-emerald-50 text-emerald-800 border border-emerald-300",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-rose-50 text-rose-700 border border-rose-200",
  },
};

export function LoadStatusBadge({ status, className = "" }: LoadStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-badge px-2 py-0.5 text-xs font-semibold ${config.className} ${className}`}
      aria-label={`Load status: ${config.label}`}
    >
      {config.label}
    </span>
  );
}
