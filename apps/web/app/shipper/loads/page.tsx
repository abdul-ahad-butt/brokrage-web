"use client";

import Link from "next/link";
import { useLoads } from "@/lib/hooks";
import { LoadStatusBadge } from "@/components/ui/LoadStatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import type { Load, LoadStatus } from "@freightbridge/shared-types";

const STATUS_OPTIONS: { value: LoadStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "OPEN", label: "Open" },
  { value: "BOOKED", label: "Booked" },
  { value: "IN_TRANSIT", label: "In Transit" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function ShipperLoadsPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<LoadStatus | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"date" | "bids">("date");

  const { data, isLoading, error } = useLoads(
    statusFilter !== "ALL" ? { status: statusFilter } : undefined,
  );

  const loads: Load[] = data?.data ?? [];

  const sorted = [...loads].sort((a, b) => {
    if (sortBy === "bids") return (b.bidCount ?? 0) - (a.bidCount ?? 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Only show loads for this shipper
  const myLoads = user ? sorted.filter((l) => l.shipperId === user.id) : sorted;

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">My Loads</h1>
          <p className="mt-1 text-content-secondary">Manage and track your posted shipments.</p>
        </div>
        <Link href="/shipper/post-load" className="btn-primary">
          + Post a Load
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
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
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-content-muted">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "bids")}
            className="text-xs"
          >
            <option value="date">Newest First</option>
            <option value="bids">Most Bids</option>
          </select>
        </div>
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
      {!isLoading && !error && myLoads.length === 0 && (
        <EmptyState
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          title="No loads yet"
          description="Post your first load to start receiving bids from vetted carriers."
          action={
            <Link href="/shipper/post-load" className="btn-primary">
              Post Your First Load
            </Link>
          }
        />
      )}

      {!isLoading && myLoads.length > 0 && (
        <div className="space-y-3">
          {myLoads.map((load) => (
            <Link
              key={load.id}
              href={`/shipper/loads/${load.id}`}
              className="card-hover block p-4 no-underline"
              id={`load-row-${load.id}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <LoadStatusBadge status={load.status} />
                    <span className="text-xs text-content-muted">
                      {load.equipmentType.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-1 font-semibold text-content-primary truncate">
                    {load.originAddress}
                  </p>
                  <p className="text-sm text-content-secondary truncate">→ {load.destAddress}</p>
                  <p className="mt-1 text-xs text-content-muted">
                    Pickup: {new Date(load.pickupDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  {load.askingPrice && (
                    <p className="text-lg font-bold text-content-primary">
                      ${load.askingPrice.toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs text-content-muted">
                    {load.bidCount ?? 0} bid{load.bidCount !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-content-muted">
                    Posted {new Date(load.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
