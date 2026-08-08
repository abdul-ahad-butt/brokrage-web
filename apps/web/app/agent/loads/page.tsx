"use client";

import { useAgentLoads } from "@/lib/hooks";
import { MarginTable } from "@/components/agent/MarginTable";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useState } from "react";
import type { LoadStatus } from "@freightbridge/shared-types";

const STATUS_OPTIONS: { value: LoadStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "OPEN", label: "Open" },
  { value: "BOOKED", label: "Booked" },
  { value: "IN_TRANSIT", label: "In Transit" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function AgentLoadsPage() {
  const [statusFilter, setStatusFilter] = useState<LoadStatus | "ALL">("ALL");
  const { data, isLoading, error } = useAgentLoads();

  const loads = (data?.data ?? []).filter(
    (l) => statusFilter === "ALL" || l.status === statusFilter,
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">All Loads</h1>
          <p className="mt-1 text-content-secondary">
            Full load inventory with computed margin for each booked shipment.
          </p>
        </div>
        <p className="text-xs text-content-muted">
          {data?.pagination.total ?? 0} total loads
        </p>
      </div>

      {/* Status filter */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setStatusFilter(opt.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              statusFilter === opt.value
                ? "bg-navy-900 text-white"
                : "bg-surface-muted text-content-secondary hover:bg-surface-border"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" className="text-action" />
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}
      {!isLoading && !error && loads.length === 0 && (
        <EmptyState title="No loads found" description="Try changing the status filter." />
      )}
      {!isLoading && loads.length > 0 && <MarginTable loads={loads as any[]} />}
    </div>
  );
}
