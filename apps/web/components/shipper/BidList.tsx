"use client";

import { useState } from "react";
import type { Bid } from "@freightbridge/shared-types";
import { BidCard } from "./BidCard";
import { EmptyState } from "../ui/EmptyState";
import { Spinner } from "../ui/Spinner";

interface BidListProps {
  bids: Bid[] | null;
  isLoading: boolean;
  error: string | null;
  loadAskingPrice: number | null;
  onBidAccepted: () => void;
}

type SortKey = "amount" | "rating" | "date";

export function BidList({ bids, isLoading, error, loadAskingPrice, onBidAccepted }: BidListProps) {
  const [sortKey, setSortKey] = useState<SortKey>("amount");

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" className="text-action" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  if (!bids || bids.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        }
        title="No bids yet"
        description="Carriers will place bids once your load is live on the board."
      />
    );
  }

  const sorted = [...bids].sort((a, b) => {
    if (sortKey === "amount") return a.amount - b.amount;
    if (sortKey === "rating")
      return (b.carrier?.ratingAverage ?? 0) - (a.carrier?.ratingAverage ?? 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <section aria-labelledby="bids-heading">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 id="bids-heading" className="text-base font-semibold text-content-primary">
          {bids.length} Bid{bids.length !== 1 ? "s" : ""} Received
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-content-muted">Sort by</span>
          {(["amount", "rating", "date"] as SortKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSortKey(key)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                sortKey === key
                  ? "bg-action text-white"
                  : "bg-surface-muted text-content-secondary hover:bg-surface-border"
              }`}
            >
              {key === "amount" ? "Price ↑" : key === "rating" ? "Rating" : "Newest"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {sorted.map((bid) => (
          <BidCard
            key={bid.id}
            bid={bid}
            loadAskingPrice={loadAskingPrice}
            onAccepted={onBidAccepted}
          />
        ))}
      </div>
    </section>
  );
}
