"use client";

import { useState } from "react";
import type { LoadFilters } from "@freightbridge/shared-types";
import { useLoads } from "@/lib/hooks";
import { LoadFiltersPanel } from "@/components/carrier/LoadFilters";
import { LoadCard } from "@/components/carrier/LoadCard";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CarrierFindLoadsPage() {
  const [filters, setFilters] = useState<LoadFilters>({ status: "OPEN" });
  const { data, isLoading, error } = useLoads(filters);

  const loads = data?.data ?? [];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Load Board</h1>
        <p className="mt-1 text-content-secondary">
          Browse open loads and submit competitive bids.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Filters sidebar */}
        <div className="w-full lg:w-64 lg:flex-shrink-0">
          <LoadFiltersPanel onFiltersChange={setFilters} />
        </div>

        {/* Load list */}
        <div className="flex-1 min-w-0">
          {data && (
            <p className="mb-4 text-xs text-content-muted">
              {data.pagination.total} load{data.pagination.total !== 1 ? "s" : ""} found
            </p>
          )}

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
            <EmptyState
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
              title="No loads match your filters"
              description="Try adjusting your equipment type or expanding your radius."
            />
          )}
          {!isLoading && loads.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {loads.map((load) => (
                <LoadCard key={load.id} load={load} href={`/carrier/find-loads/${load.id}`} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, page: p }))}
                  className={`h-8 w-8 rounded-md text-sm font-medium transition-colors ${
                    p === (filters.page ?? 1)
                      ? "bg-action text-white"
                      : "bg-surface-muted text-content-secondary hover:bg-surface-border"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
