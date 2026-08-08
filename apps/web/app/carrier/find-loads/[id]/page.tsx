"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLoad } from "@/lib/hooks";
import { useAuth } from "@/lib/auth";
import { BidForm } from "@/components/carrier/BidForm";
import { LoadStatusBadge } from "@/components/ui/LoadStatusBadge";
import { Spinner } from "@/components/ui/Spinner";

export default function CarrierLoadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const { data: load, isLoading: loadLoading, error, refetch } = useLoad(id);

  if (loadLoading || authLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" className="text-action" />
      </div>
    );
  }

  if (error || !load) {
    return (
      <div className="rounded-lg bg-rose-50 border border-rose-200 p-6 text-center">
        <p className="font-medium text-rose-700">{error ?? "Load not found"}</p>
        <Link href="/carrier/find-loads" className="btn-secondary mt-4 inline-flex">
          ← Back to Load Board
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Breadcrumb / header */}
      <div>
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-2 text-xs text-content-muted hover:text-content-primary transition-colors"
        >
          ← Back to Load Board
        </button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <LoadStatusBadge status={load.status} />
              <span className="text-xs text-content-muted">
                {load.equipmentType.replace("_", " ")}
              </span>
            </div>
            <h1 className="text-xl font-bold text-navy-900">
              {load.originAddress} → {load.destAddress}
            </h1>
            <p className="text-sm text-content-secondary">{load.commodity}</p>
          </div>
          {load.askingPrice && (
            <div className="text-right">
              <p className="text-xs text-content-muted">Asking</p>
              <p className="text-2xl font-bold text-content-primary">
                ${load.askingPrice.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Details */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5">
            <h2 className="mb-4 text-sm font-semibold text-content-primary">Shipment Details</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
              {[
                ["Pickup Date", new Date(load.pickupDate).toLocaleDateString()],
                ["Delivery Date", new Date(load.deliveryDate).toLocaleDateString()],
                ["Weight", `${load.weightLbs.toLocaleString()} lbs`],
                ["Length", `${load.lengthFt} ft`],
                ["Width", `${load.widthFt} ft`],
                ["Height", `${load.heightFt} ft`],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-content-muted">{label}</dt>
                  <dd className="mt-0.5 font-medium text-content-primary">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Bid range — competitor bids shown as range only, not individual amounts */}
          {(load.lowestBid || load.highestBid) && (
            <div className="card p-4">
              <h3 className="mb-3 text-sm font-semibold text-content-primary">Current Bid Activity</h3>
              <div className="flex gap-6 text-sm">
                {load.lowestBid && (
                  <div>
                    <p className="text-content-muted">Lowest Bid</p>
                    <p className="font-semibold text-compliance-active">
                      ${load.lowestBid.toLocaleString()}
                    </p>
                  </div>
                )}
                {load.highestBid && (
                  <div>
                    <p className="text-content-muted">Highest Bid</p>
                    <p className="font-semibold text-content-primary">
                      ${load.highestBid.toLocaleString()}
                    </p>
                  </div>
                )}
                {load.bidCount && (
                  <div>
                    <p className="text-content-muted">Total Bids</p>
                    <p className="font-semibold text-content-primary">{load.bidCount}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bid form sidebar */}
        <div>
          {load.status === "OPEN" ? (
            <BidForm
              loadId={load.id}
              carrier={user}
              isLoading={authLoading}
              onBidPlaced={refetch}
            />
          ) : (
            <div className="card p-5 text-center text-sm text-content-muted">
              <p className="font-medium text-content-secondary">Load is {load.status}</p>
              <p className="mt-1">This load is no longer accepting bids.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
