"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLoad, useLoadBids } from "@/lib/hooks";
import { LoadStatusBadge } from "@/components/ui/LoadStatusBadge";
import { BidList } from "@/components/shipper/BidList";
import { Spinner } from "@/components/ui/Spinner";

export default function ShipperLoadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: load, isLoading: loadLoading, error: loadError, refetch: refetchLoad } = useLoad(id);
  const { data: bids, isLoading: bidsLoading, error: bidsError, refetch: refetchBids } = useLoadBids(
    id,
  );

  const handleBidAccepted = () => {
    refetchLoad();
    refetchBids();
  };

  if (loadLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" className="text-action" />
      </div>
    );
  }

  if (loadError || !load) {
    return (
      <div className="rounded-lg bg-rose-50 border border-rose-200 p-6 text-center">
        <p className="font-medium text-rose-700">{loadError ?? "Load not found"}</p>
        <Link href="/shipper/loads" className="btn-secondary mt-4 inline-flex">
          ← Back to My Loads
        </Link>
      </div>
    );
  }

  const isBooked = ["BOOKED", "IN_TRANSIT", "DELIVERED"].includes(load.status);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-xs text-content-muted hover:text-content-primary transition-colors"
            >
              ← Back
            </button>
            <LoadStatusBadge status={load.status} />
          </div>
          <h1 className="text-xl font-bold text-navy-900">
            {load.originAddress} → {load.destAddress}
          </h1>
          <p className="text-sm text-content-secondary">
            {load.equipmentType.replace("_", " ")} · {load.weightLbs.toLocaleString()} lbs ·{" "}
            {load.commodity}
          </p>
        </div>
        {load.askingPrice && (
          <div className="text-right">
            <p className="text-xs text-content-muted">Asking price</p>
            <p className="text-2xl font-bold text-content-primary">
              ${load.askingPrice.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Load details */}
      <div className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-content-primary">Shipment Details</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
          {[
            ["Pickup Date", new Date(load.pickupDate).toLocaleDateString()],
            ["Delivery Date", new Date(load.deliveryDate).toLocaleDateString()],
            ["Equipment", load.equipmentType.replace("_", " ")],
            ["Weight", `${load.weightLbs.toLocaleString()} lbs`],
            [
              "Dimensions",
              `${load.lengthFt}ft × ${load.widthFt}ft × ${load.heightFt}ft`,
            ],
            ["Posted", new Date(load.createdAt).toLocaleDateString()],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-content-muted">{label}</dt>
              <dd className="mt-0.5 font-medium text-content-primary">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Booking info (if booked) */}
      {isBooked && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
          <p className="font-semibold text-emerald-800">
            ✓ This load has been{" "}
            {load.status === "DELIVERED" ? "delivered" : "booked with a carrier"}.
          </p>
          {load.status !== "DELIVERED" && (
            <p className="mt-1 text-sm text-emerald-700">
              Track progress under{" "}
              <Link href="/shipper/active-shipments" className="underline">
                Active Shipments
              </Link>
              .
            </p>
          )}
        </div>
      )}

      {/* Bids section (only for OPEN loads owned by this shipper) */}
      {load.status === "OPEN" && (
        <BidList
          bids={bids}
          isLoading={bidsLoading}
          error={bidsError}
          loadAskingPrice={load.askingPrice}
          onBidAccepted={handleBidAccepted}
        />
      )}
    </div>
  );
}
