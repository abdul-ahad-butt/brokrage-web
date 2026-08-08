import type { MCStatus } from "@freightbridge/shared-types";

interface ComplianceBadgeProps {
  status: MCStatus | null;
  showLabel?: boolean;
  className?: string;
}

const STATUS_CONFIG: Record<
  MCStatus,
  { label: string; className: string; dot: string }
> = {
  ACTIVE: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  INACTIVE: {
    label: "Inactive",
    className: "bg-rose-50 text-rose-700 border border-rose-200",
    dot: "bg-rose-500",
  },
  BROKER: {
    label: "Broker (No Carrier Auth)",
    className: "bg-rose-50 text-rose-700 border border-rose-200",
    dot: "bg-rose-500",
  },
  UNKNOWN: {
    label: "Unknown",
    className: "bg-slate-100 text-slate-600 border border-slate-200",
    dot: "bg-slate-400",
  },
};

export function ComplianceBadge({
  status,
  showLabel = true,
  className = "",
}: ComplianceBadgeProps) {
  const config = status ? STATUS_CONFIG[status] : STATUS_CONFIG.UNKNOWN;
  const label = status ? config.label : "Not Verified";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-badge px-2 py-0.5 text-xs font-semibold ${config.className} ${className}`}
      title={`MC Status: ${label}`}
      aria-label={`Compliance status: ${label}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${config.dot}`} aria-hidden="true" />
      {showLabel && <span>{label}</span>}
    </span>
  );
}
