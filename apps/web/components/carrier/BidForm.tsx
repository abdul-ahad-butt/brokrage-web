"use client";

import { useState } from "react";
import type { User } from "@freightbridge/shared-types";
import { bidsApi, ApiClientError } from "../../lib/apiClient";
import { Spinner } from "../ui/Spinner";

interface BidFormProps {
  loadId: string;
  carrier: User | null;
  isLoading: boolean;
  onBidPlaced: () => void;
}

export function BidForm({ loadId, carrier, isLoading, onBidPlaced }: BidFormProps) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // If carrier is not ACTIVE, show a disabled banner instead of the form
  const mcStatus = carrier?.mcStatus ?? null;
  const isEligible = mcStatus === "ACTIVE";

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner size="md" className="text-action" />
      </div>
    );
  }

  if (!isEligible) {
    return (
      <div
        className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm"
        role="alert"
        aria-live="polite"
        id="bid-blocked-banner"
      >
        <p className="font-semibold text-amber-800">⚠ Bidding Not Available</p>
        <p className="mt-1 text-amber-700">
          {mcStatus === "INACTIVE"
            ? "Your MC authority is currently INACTIVE. You must hold ACTIVE carrier authority to submit bids."
            : mcStatus === "BROKER"
              ? "Your MC is registered as a property BROKER, not an operating carrier. Broker-only MCs cannot bid on loads."
              : "Your MC status could not be verified. Please ensure your MC number is on file and try again."}
        </p>
        <p className="mt-2 text-amber-600 text-xs">
          If you believe this is an error, contact{" "}
          <a href="mailto:support@freightbridge.com" className="underline">
            support@freightbridge.com
          </a>
          .
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm animate-fade-in">
        <p className="font-semibold text-emerald-800">✓ Bid Placed Successfully</p>
        <p className="mt-1 text-emerald-700">
          Your bid of ${Number(amount).toLocaleString()} has been submitted. The shipper will be
          notified.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid bid amount");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await bidsApi.create(loadId, { amount: Number(amount), message: message || undefined });
      setSuccess(true);
      onBidPlaced();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to submit bid");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-4" aria-label="Submit bid">
      <h2 className="font-semibold text-content-primary">Place Your Bid</h2>
      <div className="form-field">
        <label htmlFor="bid-amount" className="form-label">
          Your Bid Amount <span className="text-compliance-inactive">*</span>
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-content-muted">
            $
          </span>
          <input
            id="bid-amount"
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="pl-7"
            required
          />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="bid-message" className="form-label">
          Message to Shipper <span className="text-content-muted">(optional)</span>
        </label>
        <textarea
          id="bid-message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell the shipper why you're the best choice for this load..."
          className="resize-none"
        />
      </div>
      {error && <p className="text-sm text-compliance-inactive">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full"
        id="submit-bid-btn"
      >
        {submitting ? <Spinner size="sm" className="text-white" /> : "Submit Bid"}
      </button>
    </form>
  );
}
