"use client";

import { useState } from "react";
import type { Bid } from "@freightbridge/shared-types";
import { StarRating } from "../ui/StarRating";
import { ComplianceBadge } from "../ui/ComplianceBadge";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { loadsApi, ApiClientError } from "../../lib/apiClient";
import { Spinner } from "../ui/Spinner";

interface BidCardProps {
  bid: Bid;
  loadAskingPrice: number | null;
  onAccepted: () => void;
}

export function BidCard({ bid, loadAskingPrice, onAccepted }: BidCardProps) {
  const [accepting, setAccepting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feeBreakdown, setFeeBreakdown] = useState<{
    bookingFeeCharged: number;
    carrierPayoutAmount: number;
    platformAccountTxnId: string;
    carrierPayoutInvoiceId: string;
  } | null>(null);

  const carrier = bid.carrier;
  const isCompliantCarrier = carrier?.mcStatus === "ACTIVE";

  const handleOpenConfirm = async () => {
    setError(null);
    setConfirmOpen(true);
  };

  const handleAccept = async () => {
    setAccepting(true);
    try {
      const result = await loadsApi.acceptBid(bid.loadId, bid.id);
      setFeeBreakdown(result.payment);
      onAccepted();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to accept bid");
    } finally {
      setAccepting(false);
      setConfirmOpen(false);
    }
  };

  const savings =
    loadAskingPrice && bid.amount < loadAskingPrice
      ? loadAskingPrice - bid.amount
      : null;

  return (
    <>
      <div
        className={`card p-4 transition-all duration-200 ${
          isCompliantCarrier ? "hover:shadow-card-hover" : "opacity-75"
        }`}
        id={`bid-card-${bid.id}`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Carrier info */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
              {carrier?.fullName?.[0] ?? "?"}
            </div>
            <div>
              <p className="font-semibold text-content-primary">{carrier?.fullName ?? "Unknown"}</p>
              {carrier?.companyName && (
                <p className="text-xs text-content-muted">{carrier.companyName}</p>
              )}
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <ComplianceBadge status={carrier?.mcStatus ?? null} />
                {carrier?.mcNumber && (
                  <span className="text-xs text-content-muted">MC# {carrier.mcNumber}</span>
                )}
                {carrier && (
                  <StarRating
                    value={carrier.ratingAverage}
                    count={carrier.ratingCount}
                    size="sm"
                  />
                )}
              </div>
              {bid.message && (
                <p className="mt-2 text-xs text-content-secondary italic">&ldquo;{bid.message}&rdquo;</p>
              )}
            </div>
          </div>

          {/* Bid amount + action */}
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-2xl font-bold text-content-primary">
                ${bid.amount.toLocaleString()}
              </p>
              {savings && (
                <p className="text-xs text-compliance-active font-medium">
                  ${savings.toLocaleString()} below asking
                </p>
              )}
            </div>
            <p className="text-xs text-content-muted">
              {new Date(bid.createdAt).toLocaleDateString()}
            </p>
            {bid.status === "PENDING" && isCompliantCarrier && (
              <button
                type="button"
                onClick={handleOpenConfirm}
                disabled={accepting}
                className="btn-primary text-sm"
                id={`accept-bid-${bid.id}`}
              >
                {accepting ? <Spinner size="sm" className="text-white" /> : "Accept Bid"}
              </button>
            )}
            {!isCompliantCarrier && (
              <span className="text-xs text-compliance-inactive font-medium">
                Carrier ineligible
              </span>
            )}
          </div>
        </div>

        {/* Fee breakdown — shown after acceptance */}
        {feeBreakdown && (
          <div className="mt-4 rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm animate-fade-in">
            <p className="font-semibold text-emerald-800 mb-2">✓ Bid Accepted</p>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <dt className="text-content-muted">Platform Booking Fee</dt>
              <dd className="text-right font-medium">${feeBreakdown.bookingFeeCharged.toFixed(2)}</dd>
              <dt className="text-content-muted">Carrier Payout</dt>
              <dd className="text-right font-medium">${feeBreakdown.carrierPayoutAmount.toFixed(2)}</dd>
              <dt className="text-content-muted">Txn ID</dt>
              <dd className="text-right font-mono text-xs">{feeBreakdown.platformAccountTxnId}</dd>
            </dl>
          </div>
        )}

        {error && (
          <p className="mt-2 text-xs text-compliance-inactive">{error}</p>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Accept this bid?"
        description={`You're accepting ${carrier?.fullName ?? "this carrier"}'s bid of $${bid.amount.toLocaleString()}. A 10% booking fee will be charged. This action cannot be undone.`}
        confirmLabel="Yes, Accept Bid"
        cancelLabel="Cancel"
        onConfirm={handleAccept}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
