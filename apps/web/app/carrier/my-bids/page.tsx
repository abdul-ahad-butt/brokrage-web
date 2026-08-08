"use client";

import Link from "next/link";
import { useCarrierBids, bidsApi } from "@/lib/hooks";
import { LoadStatusBadge } from "@/components/ui/LoadStatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useState } from "react";

const BID_STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

const BID_STATUS_CLASS: Record<string, string> = {
  PENDING: "badge-pending",
  ACCEPTED: "badge-active",
  REJECTED: "badge-inactive",
  WITHDRAWN: "badge-neutral",
};

export default function CarrierMyBidsPage() {
  const { data: bids, isLoading, error, refetch } = useCarrierBids();
  const [withdrawing, setWithdrawing] = useState<string | null>(null);

  const handleWithdraw = async (bidId: string) => {
    if (!confirm("Withdraw this bid?")) return;
    setWithdrawing(bidId);
    try {
      await bidsApi.withdraw(bidId);
      refetch();
    } catch {
      alert("Failed to withdraw bid. Please try again.");
    } finally {
      setWithdrawing(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">My Bids</h1>
        <p className="mt-1 text-content-secondary">
          Track all bids you have placed across loads.
        </p>
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
      {!isLoading && !error && (!bids || bids.length === 0) && (
        <EmptyState
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          title="No bids yet"
          description="Browse the load board and submit your first bid."
          action={
            <Link href="/carrier/find-loads" className="btn-primary">
              Find Loads
            </Link>
          }
        />
      )}

      {!isLoading && bids && bids.length > 0 && (
        <div className="overflow-x-auto rounded-card border border-surface-border">
          <table className="data-table" aria-label="My bids table">
            <thead>
              <tr>
                <th>Route</th>
                <th>Equipment</th>
                <th>Pickup</th>
                <th>My Bid</th>
                <th>Bid Status</th>
                <th>Load Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => {
                const load = (bid as any).load;
                return (
                  <tr key={bid.id} id={`bid-row-${bid.id}`}>
                    <td>
                      {load ? (
                        <Link
                          href={`/carrier/find-loads/${load.id}`}
                          className="font-medium text-action hover:underline"
                        >
                          {load.originAddress?.split(",")[0]} →{" "}
                          {load.destAddress?.split(",")[0]}
                        </Link>
                      ) : (
                        <span className="text-content-muted">—</span>
                      )}
                    </td>
                    <td>{load?.equipmentType?.replace("_", " ") ?? "—"}</td>
                    <td>
                      {load?.pickupDate
                        ? new Date(load.pickupDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="font-semibold">${bid.amount.toLocaleString()}</td>
                    <td>
                      <span className={BID_STATUS_CLASS[bid.status] ?? "badge-neutral"}>
                        {BID_STATUS_LABEL[bid.status] ?? bid.status}
                      </span>
                    </td>
                    <td>
                      {load?.status ? (
                        <LoadStatusBadge status={load.status} />
                      ) : (
                        <span className="text-content-muted">—</span>
                      )}
                    </td>
                    <td>
                      {bid.status === "PENDING" && (
                        <button
                          type="button"
                          onClick={() => handleWithdraw(bid.id)}
                          disabled={withdrawing === bid.id}
                          className="text-xs text-compliance-inactive hover:underline disabled:opacity-50"
                        >
                          {withdrawing === bid.id ? "..." : "Withdraw"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
